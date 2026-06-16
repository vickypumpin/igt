<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Mail\CreatorSendRequest;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\ContentCategory;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class DiscoverController extends Controller
{

    public function discover(Request $request)
    {
        $campaigns = Campaign::where('status',Campaign::ACTIVE)
            ->where('is_disable',Campaign::ENABLE)
            ->where('mood','public')
            ->whereDate('end_date', '>=', Carbon::now())
            ->orderBy('id', 'DESC');
        $campaign_name = null;
        $campaign_category = null;
        $date_range = null;
        if ($request->campaign_name){
            $campaigns->Where('name', 'like', '%' . $request->campaign_name . '%');
            $campaign_name = $request->campaign_name;
        }
        if ($request->campaign_category){
            $campaigns->Where('campaign_category_id', $request->campaign_category);
            $campaign_category = $request->campaign_category;
        }
        if ($request->date_range){
            $date_range = $request->date_range;
            $date = explode('to',$request->date_range);
            $start_date = Carbon::parse($date[0]) ;
            $end_date = Carbon::parse($date[1]);
            $campaigns->whereBetween('created_at',[$start_date, $end_date]);
        }
        $campaigns = $campaigns->paginate(10);
        $content_categories = ContentCategory::all();
        return view('creators.pages.discover.index',compact('campaigns','campaign_name','campaign_category','content_categories','date_range'));
    }

    public function discover_details(Campaign $campaign){
        $budget = Campaign::calculate_estimated_price($campaign);
        $count_posts_story = Campaign::calculate_total_deliverables($campaign);
        return view('creators.pages.discover.detail',compact('campaign','budget','count_posts_story'));
    }

    public function sendCampaignRequest(User $user,Campaign $campaign)
    {
        $campaign->load('campaign_users');
        if ($campaign->no_of_trender == $campaign->campaign_users->count()){
            return redirect()->back()->with('danger','Sorry,this campaign reached to trender limit.');
        }else{
            $check_user_send = CampaignInvite::where('campaign_id',$campaign->id)
                ->where('user_id',auth()->user()->id)
                ->first();
            if ($check_user_send){
                return redirect()->back()->with('danger','You already apply for this campaign.');
            }else{
                CampaignInvite::create([
                    'campaign_id' => $campaign->id,
                    'user_id' => $user->id
                ]);
                $brand_name = $campaign->owner->first_name.' '.$campaign->owner->last_name;
                $creator_name = $user->first_name.' '.$user->last_name;
                Mail::to($campaign->owner->email)->send(new CreatorSendRequest($creator_name,$brand_name,$campaign->name));


                $type = 'campaign_request';
                $message = view('creators.includes.notification_message',compact('type'))->render();
                Notification::create_record($campaign->owner->id,$type,$message);
                return redirect()->back()->with('success','Request Send Successfully !');
            }

        }
    }
}
