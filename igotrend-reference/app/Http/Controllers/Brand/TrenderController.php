<?php

namespace App\Http\Controllers\Brand;

use App\Http\Controllers\Controller;
use App\Mail\CreatorCampaignRequest;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\CampaignSubmission;
use App\Models\CampaignSubmissionReview;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TrenderController extends Controller
{
    public function getUserInfo(User $user,Campaign $campaign){
        $user = User::find($user->id);
        if ($user){
            $exist_user = CampaignInvite::where('campaign_id',$campaign->id)
                ->where('user_id',$user->id)->first();
            $rating = CampaignSubmissionReview::where('to_user',$user->id)->max('rating');
            $total_reach = CampaignSubmission::where('user_id',$user->id)
                ->where('status',CampaignSubmission::APPROVED)
                ->sum('views');
            $total_engagement = CampaignSubmission::where('user_id',$user->id)
                ->where('status',CampaignSubmission::APPROVED)
                ->sum('likes');
            $info = view('brands.pages.campaign.trender_info',compact('user','campaign','exist_user','rating','total_reach','total_engagement'))
                ->render();
            return response()->json([
                'status' => 'true',
                'user' => $user,
                'info' => $info,
            ]);
        }else{
            return response()->json([
                'status' => 'false',
            ]);
        }
    }
    public function getTrenderInfo(User $user){
        $user = User::find($user->id);
        if ($user){
            $rating = CampaignSubmissionReview::where('to_user',$user->id)->max('rating');
            $total_reach = CampaignSubmission::where('user_id',$user->id)
                ->where('status',CampaignSubmission::APPROVED)
                ->sum('views');
            $total_engagement = CampaignSubmission::where('user_id',$user->id)
                ->where('status',CampaignSubmission::APPROVED)
                ->sum('likes');
            $info = view('brands.pages.campaign.user_info',compact('user','rating','total_engagement','total_reach'))->render();
            return response()->json([
                'status' => 'true',
                'info' => $info,
            ]);
        }else{
            return response()->json([
                'status' => 'false',
            ]);
        }
    }

    public function addCampaignUser(User $user,Campaign $campaign)
    {
        $campaign->load('campaign_users');
        if ($campaign->no_of_trender == $campaign->campaign_users->count()){
            return redirect()->back()->with('danger','You have reached trender limit');
        }else{
            $exist = CampaignInvite::where('campaign_id',$campaign->id)
                ->where('user_id',$user->id)->first();
            if ($exist){
                return redirect()->back()->with('danger','Trender Already Added to Campaign !');
            }else{
                CampaignInvite::create([
                    'campaign_id' => $campaign->id,
                    'user_id' => $user->id
                ]);
                if ($campaign->status == Campaign::ACTIVE || $campaign->status == Campaign::COMPLETED ){
                    $brand_name = $campaign->owner->first_name.' '.$campaign->owner->last_name;
                    $trender_name = $user->first_name.' '.$user->last_name;
                    Mail::to($user->email)->send(new CreatorCampaignRequest($trender_name,$brand_name,$campaign->owner->company_name,$campaign->name));

                    $type = 'campaign_request_send';
                    $message = view('brands.includes.notification_message',compact('type'))->render();
                    Notification::create_record($user->id,$type,$message);
                }
                return redirect()->back()->with('success','Trender Added to Campaign !');
            }
        }
    }

    public function hire_trender(Request $request,User $user)
    {
        $campaign = Campaign::find($request->campaign);
        if ($campaign){
            $campaign->load('campaign_users');
            if ($campaign->no_of_trender == $campaign->campaign_users->count()){
                return redirect()->back()->with('danger','You have reached trender limit');
            }else{
                $exist = CampaignInvite::where('campaign_id',$campaign->id)
                    ->where('user_id',$user->id)->first();
                if ($exist){
                    return redirect()->back()->with('danger','Trender Already Added to Campaign !');
                }else{
                    CampaignInvite::create([
                        'campaign_id' => $campaign->id,
                        'user_id' => $user->id
                    ]);
                    if ($campaign->status == Campaign::ACTIVE || $campaign->status == Campaign::COMPLETED ){
                        $brand_name = $campaign->owner->first_name.' '.$campaign->owner->last_name;
                        $trender_name = $user->first_name.' '.$user->last_name;
                        Mail::to($user->email)->send(new CreatorCampaignRequest($trender_name,$brand_name,$campaign->owner->company_name,$campaign->name));

                        $type = 'campaign_request_send';
                        $message = view('brands.includes.notification_message',compact('type'))->render();
                        Notification::create_record($user->id,$type,$message);
                    }
                    return redirect()->back()->with('success','Trender Added to Campaign !');
                }
            }
        }else{
            return redirect()->back()->with('error','Campaign not exist !');
        }
    }

    public function removeCampaignUser(User $user,Campaign $campaign)
    {
        $exist_user = CampaignInvite::where('campaign_id',$campaign->id)
            ->where('user_id',$user->id)->first();
        if ($exist_user){
            CampaignInvite::destroy($exist_user->id);
            return redirect()->back()->with('success','Trender Removed from Campaign !');
        }else{
            return redirect()->back()->with('danger','something went wrong ');
        }
    }
}
