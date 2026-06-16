<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SubmissionApproval;
use App\Mail\SubmissionRejected;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\CampaignSubmission;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\PaymentFailedLog;
use App\Models\Setting;
use App\Models\UserReward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use KingFlamez\Rave\Facades\Rave as Flutterwave;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $campaign_id = $request->campaign_id ?? null;
        $campaigns = Campaign::select('id','name');
        $campaigns_submissions = CampaignSubmission::has('user')
            ->has('campaign');
        if ($campaign_id){
            $campaigns_submissions->where('campaign_id',$campaign_id);
        }else{
            $campaigns_ids = $campaigns->pluck('id');
            $campaigns_submissions->whereIn('campaign_id',$campaigns_ids);
        }
        $campaigns_submissions = $campaigns_submissions->paginate(10);
        $campaigns = $campaigns->get() ;
        $setting = Setting::first();

        $reward_send = UserReward::sum('amount');

        $completed_campaigns = Campaign::where('status',Campaign::ACTIVE)
            ->orwhere('status',Campaign::COMPLETED)
            ->pluck('id');

        $campaign_budget = Payment::whereIn('campaign_id',$completed_campaigns)
            ->where('payment_type','campaign_payment')
            ->sum('amount');

        $trender_collabs = CampaignInvite::whereIn('campaign_id',$completed_campaigns)
            ->where('status',CampaignInvite::ACTIVE)
            ->orwhere('status',CampaignInvite::COMPLETED)
            ->count();
        $reach = CampaignSubmission::whereIn('campaign_id',$completed_campaigns)->sum('views');
        $engagement  = CampaignSubmission::whereIn('campaign_id',$completed_campaigns)->sum('likes');


        return view('admin.pages.reports.index',compact('campaigns','campaigns_submissions','campaign_id',
            'setting','reward_send','campaign_budget','trender_collabs','reach','engagement'));
    }

    public function approve_submission(CampaignSubmission $submission){

        if ($submission->user->bank_name && $submission->user->account_number){
            $submission->update([
                'status' => CampaignSubmission::APPROVED
            ]);

            CampaignInvite::where('user_id',$submission->user_id)
                ->where('campaign_id',$submission->campaign_id)
                ->where('status',CampaignInvite::ACTIVE)
                ->update([
                    'status' => CampaignInvite::COMPLETED
                ]);

            $user_name = $submission->user->user_name;
            $campaign_name = $submission->campaign->name;
            Mail::to($submission->user->email)->send(new SubmissionApproval($user_name,$campaign_name));

            $type = 'submission_approval';
            $message = view('admin.includes.notification_message',compact('type'))->render();
            Notification::create_record($submission->user->id,$type,$message);

            $trender_amount = Campaign::get_trender_payout($submission->campaign,$submission->user);
            if ($trender_amount > 0){
                try {
                    $reference = Flutterwave::generateReference();
                    $data = [
                        "account_bank"=> $submission->user->bank_name,
                        "account_number"=>(string) $submission->user->account_number,
                        'amount' => $trender_amount,
                        "narration"=> ucwords($submission->campaign->name)." Payment",
                        "currency"=>"NGN",
                        'reference' => $reference,
                        "debit_currency"=>"NGN",
                    ];

                    $secret_key = getenv('FLW_SECRET_KEY');
                    $transfer = Http::withToken($secret_key)->post(
                        'https://api.flutterwave.com/v3/transfers',
                        $data
                    );

                    if ($transfer->successful()){
                        $response = $transfer->json();
                        Payment::create([
                            'user_id' => $submission->user_id,
                            'campaign_id' => $submission->campaign_id,
                            'tx_ref' => $response['data']['reference'],
                            'payment_type' => 'trender_payout_payment',
                            'amount' => $trender_amount,
                            'payment_status' => 0,
                            'account_number' => $submission->user->account_number,
                            'bank_code' => $submission->user->bank_name,
                        ]);

                    }else{
                        $response = $transfer->json();
                        PaymentFailedLog::create([
                            'user_id' => $submission->user_id,
                            'campaign_id' => $submission->campaign_id,
                            'submission_id' => $submission->id,
                            'message' => isset($response['message']) ? $response['message'] : '',
                        ]);
                    }

                }catch (\Exception $exception){
                    PaymentFailedLog::create([
                        'user_id' => $submission->user_id,
                        'campaign_id' => $submission->campaign_id,
                        'submission_id' => $submission->id,
                        'message' => $exception->getMessage(),
                    ]);
                }
            }


            return response()->json([
                'status' => true
            ]);
        }else{
            return response()->json([
                'status' => false,
                'message' => "User Bank name and account number not found"
            ]);
        }
    }

    public function reject_submission(CampaignSubmission $submission){
        $submission->update([
            'status' => CampaignSubmission::REJECT
        ]);
        $user_name = $submission->user->user_name;
        $campaign_name = $submission->campaign->name;
        Mail::to($submission->user->email)->send(new SubmissionRejected($user_name,$campaign_name));

        $type = 'reject_approval';
        $message = view('admin.includes.notification_message',compact('type'))->render();
        Notification::create_record($submission->user->id,$type,$message);
        return response()->json([
            'status' => true
        ]);
    }

    public function campaign_report($campaign_id)
    {
        $campaign = Campaign::where('id',$campaign_id)->first();
        if ($campaign){
            $budget = Campaign::calculate_estimated_price($campaign);
            $total_reach = CampaignSubmission::where('campaign_id',$campaign->id)->sum('views');
            $total_engagement = CampaignSubmission::where('campaign_id',$campaign->id)->sum('likes');
            $count_posts_story = Campaign::calculate_total_deliverables($campaign);
            return view('admin.pages.reports.report_download',compact('campaign','budget','total_reach','total_engagement','count_posts_story'));
        }else{
            return redirect()->back()->with('warning','campaign not exist');
        }
    }

}
