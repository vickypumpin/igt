<?php

namespace App\Http\Controllers;

use App\Mail\CreatorRejection;
use App\Mail\GuestGemSender;
use App\Mail\SendContact;
use App\Mail\TrenderGetGems;
use App\Models\Campaign;
use App\Models\CampaignSubmission;
use App\Models\CampaignSubmissionReview;
use App\Models\Country;
use App\Models\GemPayment;
use App\Models\LegalPage;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\UserReward;
use Illuminate\Http\Request;
use App\Models\CreatorCategory;
use App\Models\ContentCategory;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use KingFlamez\Rave\Facades\Rave as Flutterwave;

class FrontendController extends Controller
{
    public function index_page()
    {
        $creator_categories = CreatorCategory::all();
        $content_categories = ContentCategory::all();

        $random_creator_categories = CreatorCategory::limit(10)->get();
        $random_content_categories = ContentCategory::limit(10)->get();

        return view('index', compact('creator_categories', 'content_categories','random_content_categories','random_creator_categories'));
    }

    public function brands()
    {
        return view('frontend.pages.brands.index');
    }
    public function creators()
    {
        return view('frontend.pages.creators.index');
    }
    public function services()
    {
        return view('frontend.pages.services');
    }
    public function contact()
    {
        return view('frontend.pages.contact');
    }
    public function send_contact(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'company_email' => 'required|email',
            'company_phone' => 'required',
            'company_name' => 'required',
            'message' => 'required|max:255',
        ]);

        $user_name = $request->name;
        $company_email= $request->company_email;
        $company_phone = $request->company_phone;
        $company_name = $request->company_name;
        $message= $request->message;

        try {
            Mail::to("trend@igotrend.com")->send(new SendContact($user_name,$company_email,$company_phone,$company_name,$message));
            return redirect()->back()->with('success','email send successfully');
        }catch (\Exception $e){

        }
    }

    public function blog()
    {
        return view('frontend.pages.blog');
    }

    public function case_studies()
    {
        return view('frontend.pages.case_studies');
    }

    public function summary(User $user)
    {
        if ($user->role == User::CREATOR){
            if (Auth::check()){
                $campaigns = Campaign::where('user_id',auth()->user()->id)
                    ->where('status',Campaign::ACTIVE)
                    ->get();
            }else{
                $campaigns = collect();
            }
            $rating = CampaignSubmissionReview::where('to_user',$user->id)->max('rating');
            $total_reach = CampaignSubmission::where('user_id',$user->id)
                ->where('status',CampaignSubmission::APPROVED)
                ->sum('views');
            $total_engagement = CampaignSubmission::where('user_id',$user->id)
                ->where('status',CampaignSubmission::APPROVED)
                ->sum('likes');
            return view('frontend.pages.profile_summary',compact('user','campaigns','rating','total_reach','total_engagement'));
        }else{
            return redirect(404);
        }
    }

    public function send_user_gem(Request $request)
    {
        $request->validate([
            'first_name' => 'required|max:50',
            'last_name' => 'required|max:50',
            'email' => 'required|email',
            'gem' => 'required',
        ]);

        $setting = Setting::first();
        $per_gem_price = $setting->gem_price;
        $gem_service_percentage = $setting->gem_service_fee ;

        $total_pay_amount = $request->gem * $per_gem_price;

        $percentage_amount = $gem_service_percentage / 100 * $total_pay_amount;
        $total_pay_with_percentage = $total_pay_amount + $percentage_amount;


        $reference = Flutterwave::generateReference();

        $data = [
            'payment_options' => 'account,card,banktransfer',
            'amount' => $total_pay_with_percentage,
            'email' => $request->email,
            'tx_ref' => $reference,
            'currency' => "NGN",
            'redirect_url' => route('success_gem_payment'),
            'customer' => [
                'email' => $request->email,
                "name" => $request->first_name.' '.$request->last_name
            ],
            "customizations" => [
                "title" => 'IgoTrend',
                "description" => "Gem Payment",
                'logo' => asset('images/igthomelogo.png')
            ],
            "meta" => [
                "trender_id" => $request->trender_id,
                "pay_user_email" => $request->email,
                "pay_user_name" =>  $request->first_name.' '.$request->last_name,
                "gems" => $request->gem,
                "tax_amount" => $percentage_amount,
            ]
        ];
        $payment = Flutterwave::initializePayment($data);
        if ($payment['status'] !== 'success') {
            return redirect()->back()->with('warning','Something went wrong');
        }
        return redirect($payment['data']['link']);
    }

    public function gems_callback(Request $request)
    {
        $status = request()->status;
        //if payment is successful
        if ($status ==  'successful' || $status ==  'completed') {
            $transactionID = Flutterwave::getTransactionIDFromCallback();
            $data = Flutterwave::verifyTransaction($transactionID);

            $trender = User::find($data['data']['meta']['trender_id']);

            if ($trender){

                $trender->increment('gems',$data['data']['meta']['gems']);

                GemPayment::create([
                    'tx_ref' => $data['data']['tx_ref'],
                    'flw_ref' => $data['data']['flw_ref'],
                    'trender_id' => $data['data']['meta']['trender_id'],
                    'amount' => $data['data']['amount'],
                    'tax_amount' => $data['data']['meta']['tax_amount'],
                ]);

                UserReward::create([
                    'user_id' =>  $data['data']['meta']['trender_id'],
                    'user_name' =>  $data['data']['meta']['pay_user_name'],
                    'type' =>  'gems',
                    'amount' =>  $data['data']['meta']['gems'],
                    'is_guest' =>  1,
                ]);

                try {
                    $user_name = $trender->first_name." ".$trender->last_name;
                    $sender_name = $data['data']['meta']['pay_user_name'];
                    $sender_email = $data['data']['meta']['pay_user_email'];

                    Mail::to($trender->email)->send(new TrenderGetGems($user_name,$sender_name));

                    Mail::to($sender_email)->send(new GuestGemSender($user_name,$sender_name));

                }catch (\Exception $e){
                    Log::info($e->getMessage());

                }
            }
            return redirect()->route('summary',$trender)->with('success','Gems Send Successfully');
        } elseif ($status ==  'cancelled'){
            return redirect('/')->with('danger','Sorry your payment cancelled');
        } else{
            return redirect('/')->with('danger','Something went wrong');
        }
    }

    public function page(LegalPage $legal_page)
    {
        return view('frontend.pages.legal-page',compact('legal_page'));
    }

    public function faqs()
    {
        return view('frontend.pages.faqs');
    }

    public function influencer_mean()
    {
        return view('frontend.pages.what_does_influencer_mean');
    }

    public function explore(Request $request)
    {
        $countries = Country::all();
        $creator_categories = CreatorCategory::all();
        $content_categories = ContentCategory::all();

        //filter
        $platform = $request->input('platform');
        $content = json_decode($request->input('content_categories'));
        $creator = json_decode($request->input('creator_categories'));

        $countryy = $request->input('country');
        $gender = $request->input('gender');
        $user_name = $request->input('user_name');

        $query = User::query();
        $query->where('is_active', '=', 1)
            ->where('role', '=', User::CREATOR)
            ->where('is_locked', '=', 0);

        if ($platform) {
            $query->where(function ($query) use ($platform) {
                if ($platform == 'all') {
                    $query->orWhereNotNull('instagram_profile')
                        ->orWhereNotNull('facebook_profile')
                        ->orWhereNotNull('twitter_profile')
                        ->orWhereNotNull('tiktok_profile')
                        ->orWhereNotNull('youtube_profile')
                        ->orWhereNotNull('snapchat_profile');
                } elseif ($platform == 'insta') {
                    $query->orWhereNotNull('instagram_profile');
                } elseif ($platform == 'facebook') {
                    $query->orWhereNotNull('facebook_profile');
                } elseif ($platform == 'twitter') {
                    $query->orWhereNotNull('twitter_profile');
                } elseif ($platform == 'tiktok') {
                    $query->orWhereNotNull('tiktok_profile');
                } elseif ($platform == 'youtube') {
                    $query->orWhereNotNull('youtube_profile');
                } elseif ($platform == 'snapchat') {
                    $query->orWhereNotNull('snapchat_profile');
                }
            });
        }

        if ($content) {
            $query->where(function ($query) use ($content) {
                foreach ($content as $content_val) {
                    $query->orWhereRaw('FIND_IN_SET(?, content_category)', [$content_val]);
                }
            });
        }

        if ($creator) {
            $query->where(function ($query) use ($creator) {
                foreach ($creator as $creator_val) {
                    $query->orWhereRaw('FIND_IN_SET(?, creator_category)', [$creator_val]);
                }
            });
        }

        if ($countryy) {
            $query->where('country_id', $countryy);
        }

        if ($gender) {
            $query->where('gender', $gender);
        }

        if ($user_name) {
            $query->where('user_name', 'LIKE', '%' . $user_name . '%');
        }

        $users = $query->get();
        $featured_trenders = User::where('role',User::CREATOR)
            ->where('role',User::CREATOR)
            ->where('is_active',User::ACTIVE)
            ->where('is_locked',User::UN_LOCKED)
            ->where('badge',"elite")
            ->orwhere('badge',"mega")
            ->limit(7)
            ->get()
            ->toArray();


        return view('frontend.pages.explore',compact('countries','creator_categories',
            'content_categories','content','creator','platform','countryy','gender','users',
            'user_name','featured_trenders'));
    }
}
