<?php

namespace App\Http\Controllers\Brand;

use App\Http\Controllers\Controller;
use App\Mail\CampaignRequestAccepted;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserEarning;
use App\Models\UserReward;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use KingFlamez\Rave\Facades\Rave as Flutterwave;

class FlutterWaveController extends Controller
{
    public function initialize(Campaign $campaign)
    {
        $amount =  Campaign::calculate_estimated_price($campaign);

        $setting = Setting::first();
        $brand_service_percentage = $setting->brand_service_fee ;

        $percentage_amount = $brand_service_percentage / 100 * $amount;
        $total_pay_with_percentage = $amount + $percentage_amount;


        if ($amount == 0){
            return redirect()->back()->with('warning','Please make sure amount greater then 0');
        }else{
            //This generates a payment reference
            $reference = Flutterwave::generateReference();
            // Enter the details of the payment
            $data = [
                'payment_options' => 'account,card,banktransfer',
                'amount' => $total_pay_with_percentage,
                'email' => auth()->user()->email,
                'tx_ref' => $reference,
                'currency' => "NGN",
                'redirect_url' => route('success-campaign-payment'),
                'customer' => [
                    'email' => auth()->user()->email,
                    "phone_number" => auth()->user()->phone,
                    "name" => auth()->user()->first_name.' ',auth()->user()->last_name
                ],
                "customizations" => [
                    "title" => 'IgoTrend',
                    "description" => "Campaign Payment",
                    'logo' => asset('images/igthomelogo.png')
                ],
                "meta" => [
                    "user_id" => auth()->user()->id,
                    "campaign_id" => $campaign->id,
                    "tax_amount" => $percentage_amount,
                ]
            ];
            $payment = Flutterwave::initializePayment($data);
            if ($payment['status'] !== 'success') {
                return redirect()->back()->with('warning','Something went wrong');
            }
            return redirect($payment['data']['link']);
        }
    }
    public function callback(){
        $status = request()->status;
        //if payment is successful
        if ($status ==  'successful' || $status ==  'completed') {
            $transactionID = Flutterwave::getTransactionIDFromCallback();
            $data = Flutterwave::verifyTransaction($transactionID);
            Payment::create([
                'user_id' => $data['data']['meta']['user_id'],
                'campaign_id' => $data['data']['meta']['campaign_id'],
                'tx_ref' => $data['data']['tx_ref'],
                'flw_ref' => $data['data']['flw_ref'],
                'payment_type' => 'campaign_payment',
                'amount' => $data['data']['amount'],
                'tax_amount' => $data['data']['meta']['tax_amount'],
            ]);

            CampaignInvite::where('campaign_id',$data['data']['meta']['campaign_id'])
                ->where('payment_status','un_paid')
                ->update([
                    'payment_status' =>  'paid'
                ]);

            return redirect()->route('payment_confirmation')->with('success','Payment done Successfully');
        } elseif ($status ==  'cancelled'){
            return redirect()->route('my_campaigns')->with('danger','Sorry your payment cancelled');
        } else{
            return redirect()->route('my_campaigns')->with('danger','Something went wrong');
        }
    }
    public function success()
    {
        return view('brands.pages.campaign.payment_confirmation');
    }
    public function payTrender(CampaignInvite $invite)
    {
        $amount =  Campaign::get_trender_payout($invite->campaign,$invite->user);

        $setting = Setting::first();
        $brand_service_percentage = $setting->brand_service_fee ;

        $percentage_amount = $brand_service_percentage / 100 * $amount;
        $total_pay_with_percentage = $amount + $percentage_amount;

        if ($amount == 0){
            return redirect()->back()->with('warning','Please make sure amount greater then 0');
        }else{
            //This generates a payment reference
            $reference = Flutterwave::generateReference();
            // Enter the details of the payment
            $data = [
                'payment_options' => 'account,card,banktransfer',
                'amount' => $total_pay_with_percentage ,
                'email' => auth()->user()->email,
                'tx_ref' => $reference,
                'currency' => "NGN",
                'redirect_url' => route('trenderPaymentSuccess'),
                'customer' => [
                    'email' => auth()->user()->email,
                    "phone_number" => auth()->user()->phone,
                    "name" => auth()->user()->first_name.' ',auth()->user()->last_name
                ],
                "customizations" => [
                    "title" => 'IgoTrend',
                    "description" => "Campaign Trender Payment",
                    'logo' => asset('images/igthomelogo.png')
                ],
                "meta" => [
                    "user_id" => auth()->user()->id,
                    "campaign_id" => $invite->campaign_id,
                    "invite_id" => $invite->id,
                    "trender_id" => $invite->user_id,
                    "tax_amount" => $percentage_amount,
                ]
            ];
            $payment = Flutterwave::initializePayment($data);
            if ($payment['status'] !== 'success') {
                return redirect()->back()->with('warning','Something went wrong');
            }
            return redirect($payment['data']['link']);
        }
    }
    public function trenderPaymentSuccess(){
        $status = request()->status;
        //if payment is successful
        if ($status ==  'successful' || $status ==  'completed') {
            $transactionID = Flutterwave::getTransactionIDFromCallback();
            $data = Flutterwave::verifyTransaction($transactionID);
            Payment::create([
                'user_id' => $data['data']['meta']['user_id'],
                'campaign_id' => $data['data']['meta']['campaign_id'],
                'tx_ref' => $data['data']['tx_ref'],
                'flw_ref' => $data['data']['flw_ref'],
                'payment_type' => 'campaign_payment',
                'amount' => $data['data']['amount'],
                'tax_amount' => $data['data']['meta']['tax_amount'],
            ]);

            $check_invite = CampaignInvite::where('id',$data['data']['meta']['invite_id'])->first();

            if ($check_invite){
                $check_invite->update([
                    'payment_status' => 'paid',
                     'status' => CampaignInvite::ACTIVE
                ]);
                $user  = User::find($check_invite->user_id);
                $influencer_user_name = $user->first_name.' '.$user->last_name;
                Mail::to($user->email)->send(new CampaignRequestAccepted($influencer_user_name));
                $type = 'campaign_request_accepted';
                $message = view('brands.includes.notification_message',compact('type'))->render();
                Notification::create_record($check_invite->user_id,$type,$message);
            }
//            UserEarning::create([
//                'campaign_id' => $data['data']['meta']['campaign_id'],
//                'user_id' => $data['data']['meta']['trender_id'],
//                'amount' => $data['data']['amount'],
//            ]);


//            $trender = User::where('id',$data['data']['meta']['trender_id'])->first();
//
//            if ($trender){
//                $trender->increment('balance',$data['data']['amount']);
//            }


            return redirect()->route('brandDashboard')->with('success','Payment done Successfully');
        } elseif ($status ==  'cancelled'){
            return redirect()->route('brandDashboard')->with('danger','Sorry your payment cancelled');
        } else{
            return redirect()->route('brandDashboard')->with('danger','Something went wrong');
        }
    }
    public function GemPaymentSuccess(){
        $status = request()->status;
        //if payment is successful
        if ($status ==  'successful' || $status ==  'completed') {
            $transactionID = Flutterwave::getTransactionIDFromCallback();
            $data = Flutterwave::verifyTransaction($transactionID);
            Payment::create([
                'user_id' => $data['data']['meta']['user_id'],
                'tx_ref' => $data['data']['tx_ref'],
                'flw_ref' => $data['data']['flw_ref'],
                'payment_type' => 'trender_gem_payment',
                'amount' => $data['data']['amount'],
                'tax_amount' => $data['data']['meta']['tax_amount'],
            ]);
            $users = explode(',',$data['data']['meta']['users']);
            $from_user = $data['data']['meta']['user_id'];
            $gems = $data['data']['meta']['gems'];
            foreach ($users as $user){
                $user = User::find($user);
                if ($user){
                    $user->increment('gems',(int)$gems);
                    UserReward::create([
                        'user_id' => $user->id,
                        'from_user' => $from_user,
                        'type' => 'gems',
                        'amount' => $gems,
                    ]);
                }
            }
            return redirect()->route('brand_reward_contacts')->with('success','Reward Send Successfully');
        } elseif ($status ==  'cancelled'){
            return redirect()->route('brand_reward_contacts')->with('danger','Sorry your payment cancelled');
        } else{
            return redirect()->route('brand_reward_contacts')->with('danger','Something went wrong');
        }
    }
    public function AirTimePaymentSuccess(){
        $status = request()->status;
        //if payment is successful
        if ($status ==  'successful' || $status ==  'completed') {
            $transactionID = Flutterwave::getTransactionIDFromCallback();
            $data = Flutterwave::verifyTransaction($transactionID);
            Payment::create([
                'user_id' => $data['data']['meta']['user_id'],
                'tx_ref' => $data['data']['tx_ref'],
                'flw_ref' => $data['data']['flw_ref'],
                'payment_type' => 'trender_air_time_payment',
                'amount' => $data['data']['amount'],
                'tax_amount' => $data['data']['meta']['tax_amount'],
            ]);
            $users = explode(',',$data['data']['meta']['users']);
            $from_user = $data['data']['meta']['user_id'];
            $airtime= $data['data']['meta']['airtime'];
            foreach ($users as $user){
                $user = User::find($user);
                if ($user){
                    UserReward::create([
                        'user_id' => $user->id,
                        'from_user' => $from_user,
                        'type' => 'air_time',
                        'amount' => $airtime,
                        'status' => 0,
                    ]);
                }
            }
            return redirect()->route('brand_reward_contacts')->with('success','Reward Send Successfully');
        } elseif ($status ==  'cancelled'){
            return redirect()->route('brand_reward_contacts')->with('danger','Sorry your payment cancelled');
        } else{
            return redirect()->route('brand_reward_contacts')->with('danger','Something went wrong');
        }
    }
}
