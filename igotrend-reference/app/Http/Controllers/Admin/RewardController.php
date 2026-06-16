<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserReward;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use KingFlamez\Rave\Facades\Rave as Flutterwave;
use Yajra\DataTables\Facades\DataTables;

class RewardController extends Controller
{
    public function reward()
    {

        $campaigns = Campaign::where('status',Campaign::ACTIVE)
            ->orwhere('status',Campaign::COMPLETED)
            ->get();


        $setting = Setting::first();

        return view('admin.pages.reward.index',compact('setting','campaigns'));
    }
    public function pay_reward(Request $request)
    {
        if ((int)$request->amount <= 0){
            return redirect()->back()->with('danger','Please enter amount greater then 0');
        }else{
            if ($request->payment_type == "mobile_airtime"){
                $setting = Setting::first();
                $users_ids = [];
                $total_air_time_amount = 0;
                $igotrend_user = User::first();
                foreach ($request->users as $val){
                    $user = User::find($val);
                    if ($user){
                        array_push($users_ids,$user->id);
                        $total_air_time_amount +=  $request->amount;
                    }
                }

                $brand_service_percentage = $setting->brand_service_fee ;

                $percentage_amount = $brand_service_percentage / 100 * $total_air_time_amount;
                $total_pay_with_percentage = $total_air_time_amount + $percentage_amount;
                if ($total_pay_with_percentage > 0){
                    //This generates a payment reference
                    $reference = Flutterwave::generateReference();
                    // Enter the details of the payment
                    $data = [
                        'payment_options' => 'account,card,banktransfer',
                        'amount' => $total_pay_with_percentage ,
                        'email' => $igotrend_user->email,
                        'tx_ref' => $reference,
                        'currency' => "NGN",
                        'redirect_url' => route('adminAirTimePaymentSuccess'),
                        'customer' => [
                            'email' => $igotrend_user->email,
                            "name" => $igotrend_user->first_name.' ',$igotrend_user->last_name
                        ],
                        "customizations" => [
                            "title" => 'IgoTrend',
                            "description" => "Airtime Payment",
                            'logo' => asset('images/igthomelogo.png')
                        ],
                        "meta" => [
                            "user_id" => $igotrend_user->id,
                            "airtime" => $request->amount,
                            "users" => implode(',',$users_ids),
                            "tax_amount" => $percentage_amount,
                        ]
                    ];
                    $payment = Flutterwave::initializePayment($data);

                    if ($payment['status'] !== 'success') {
                        return redirect()->back()->with('warning','Something went wrong');
                    }
                    return redirect($payment['data']['link']);
                }else{
                    return redirect()->back()->with('warning','total amount less then zero');
                }
            }
            if ($request->payment_type == "gems"){
                $setting = Setting::first();
                $users_ids = [];
                $total_gems_amount = 0;
                foreach ($request->users as $val){
                    $user = User::find($val);
                    if ($user){
                        array_push($users_ids,$user->id);
                        $total_gems_amount +=  $request->amount * $setting->gem_price;
                    }
                }
                $brand_service_percentage = $setting->brand_service_fee ;

                $percentage_amount = $brand_service_percentage / 100 * $total_gems_amount;
                $total_pay_with_percentage = $total_gems_amount + $percentage_amount;
                $user = User::first();

                if ($total_pay_with_percentage > 0){
                    //This generates a payment reference
                    $reference = Flutterwave::generateReference();
                    // Enter the details of the payment
                    $data = [
                        'payment_options' => 'account,card,banktransfer',
                        'amount' => $total_pay_with_percentage ,
                        'email' => $user->email,
                        'tx_ref' => $reference,
                        'currency' => "NGN",
                        'redirect_url' => route('adminTrenderGemPaymentSuccess'),
                        'customer' => [
                            'email' => $user->email,
                            "name" => $user->first_name.' ',$user->last_name
                        ],
                        "customizations" => [
                            "title" => 'IgoTrend',
                            "description" => "Gem Payment",
                            'logo' => asset('images/igthomelogo.png')
                        ],
                        "meta" => [
                            "user_id" => $user->id,
                            "gems" => $request->amount,
                            "users" => implode(',',$users_ids),
                            "tax_amount" => $percentage_amount,
                        ]
                    ];
                    $payment = Flutterwave::initializePayment($data);
                    if ($payment['status'] !== 'success') {
                        return redirect()->back()->with('warning','Something went wrong');
                    }
                    return redirect($payment['data']['link']);
                }else{
                    return redirect()->back()->with('warning','total amount less then zero');
                }
            }
            return redirect()->back()->with('danger','Please Select any Reward type');
        }
    }
    public function get_reward_data(Request $request){
        if($request->ajax()){
            $campaigns_users_id = [];
            if ($request->campaign){
                $campaigns_users_id = CampaignInvite::where('campaign_id','=',$request->campaign)
                    ->where('status',CampaignInvite::ACTIVE)
                    ->orwhere('status',CampaignInvite::COMPLETED)
                    ->pluck('user_id');
                $campaigns_users_id = $campaigns_users_id->toArray();
            }
            $rewards = UserReward::has('reward_user')
                ->whereIn('user_id',$campaigns_users_id)
                ->orderBy('id', 'DESC');

            return DataTables::of($rewards)
                ->addColumn('trender', function ($reward){
                    $name = $reward->reward_user->first_name." ".$reward->reward_user->last_name;
                    $words = explode(" ", $name);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-32pt mr-8pt">
                                                                        <span class="avatar-title rounded-circle">'.$acronym.'</span>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex align-items-center">
                                                                            <div class="flex d-flex flex-column">
                                                                               <a data-url="'.route('getAdminTrenderInfo',$reward->reward_user).'" class="view_trender_info" class="mb-0" style="cursor: pointer">
                                                                                <strong class="js-lists-values-lead">'.$name.'</strong>
                                                                                </a>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('category', function ($reward){
                    $html = '';
                    if (is_null($reward->reward_user->creator_category)){
                        $html .= 'Influencer';
                    }else{
                        $html .= 'Creator';
                    }
                    return $html;
                })
                ->addColumn('level', function ($reward){
                    return User::get_user_level($reward->reward_user);
                })
                ->addColumn('plateform', function ($reward){
                    $html = '<span>';
                    if ($reward->reward_user->facebook_profile){
                        $html .=  '<img width="16" height="16"  src="'.asset('images/facebook.png').'" />';
                    }
                    if ($reward->reward_user->instagram_profile){
                        $html .=  '<img class="ml-1" width="16" height="16"  src="'.asset('images/instagram.png').'" />';
                    }
                    if ($reward->reward_user->twitter_profile){
                        $html .=  '<img class="ml-1" width="16" height="16"  src="'.asset('images/twitter.png').'" />';
                    }
                    if ($reward->reward_user->youtube_profile){
                        $html .=  '<img class="ml-1" width="16" height="16"  src="'.asset('images/youtube.png').'" />';
                    }
                    if ($reward->reward_user->tiktok_profile){
                        $html .=  '<img class="ml-1" width="16" height="16"  src="'.asset('images/tiktok.png').'" />';
                    }
                    if ($reward->reward_user->snapchat_profile){
                        $html .=  '<img class="ml-1" width="16" height="16"  src="'.asset('images/snapchat.png').'" />';
                    }
                    $html .= '</span>';
                    return $html;
                })
                ->editColumn('type', function ($payment){
                    if ($payment->type == "air_time"){
                        return "Air Time";
                    }else{
                        return "Gems";
                    }
                })
                ->rawColumns(['trender','category','level','plateform'])
                ->make(true);
        }
    }

    public function get_campaign_users(Campaign $campaign)
    {

        $campaigns_invites = CampaignInvite::where('campaign_id',$campaign->id)
            ->where('status',CampaignInvite::ACTIVE)
            ->orwhere('status',CampaignInvite::COMPLETED)
            ->distinct('user_id')
            ->pluck('user_id');

        $users = User::whereIn('id',$campaigns_invites)
            ->select('id','first_name','last_name')
            ->get();


        if ($users->count() >= 1){
            return response()->json([
                'status' => true,
                'users' => $users
            ]);

        }else{
            return response()->json([
                'status' => false
            ]);
        }
    }
}
