<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CampaignRequestAccepted;
use App\Mail\CampaignRequestReject;
use App\Mail\CreatorCampaignRequest;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\CampaignSubmission;
use App\Models\CampaignSubmissionReview;
use App\Models\ContentCategory;
use App\Models\Country;
use App\Models\CreatorCategory;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\User;
use App\Models\UserEarning;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Yajra\DataTables\Facades\DataTables;

class CampaignController extends Controller
{
    public function my_campaign()
    {
        $active_campaigns = Campaign::where('status',Campaign::ACTIVE)->count();
        $pending_campaigns = Campaign::where('status',Campaign::PENDING)->count();
        $decline_campaigns = Campaign::where('status',Campaign::DECLINE)->count();
        $completed_campaigns = Campaign::where('status',Campaign::COMPLETED)->count();
        return view('admin.pages.campaign.index',compact('active_campaigns','pending_campaigns','decline_campaigns','completed_campaigns'));
    }

    public function active_campaigns(Request  $request)
    {
        if($request->ajax()){
            $campaigns = Campaign::where('status',Campaign::ACTIVE)
                ->orderBy('id', 'DESC');
            return DataTables::of($campaigns)
                ->addColumn('actions', function ($campaign){
                    $html = '<div class="btn-group btn-group-sm">';
                    $html .= '<a href="'.route('manage_campaign_detail',$campaign).'" class="text-50">
                                     <i class="material-icons">more_vert</i>
                              </a>';
                    return $html .'</div>';
                })
                ->editColumn('status', function (){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-status text-50 mb-4pt">Active</small>
                                                                    <span class="indicator-line rounded bg-primary"></span>
                                                                </div>';
                })
                ->editColumn('sponsor', function ($campaign){
                    $words = explode(" ", $campaign->sponsor);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    $disable_status = 'Enabled';
                    if ($campaign->is_disbale){
                        $disable_status = 'Disabled';
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-32pt mr-8pt">
                                                                        <span class="avatar-title rounded-circle">'.$acronym.'</span>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex align-items-center">
                                                                            <div class="flex d-flex flex-column">
                                                                                <p class="mb-0">
                                                                                <strong class="js-lists-values-lead">'.$campaign->sponsor.'</strong>
                                                                                </p>
                                                                                 <small class="text-50">'.$disable_status.'</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('project', function ($campaign){
                    $words = explode(" ", $campaign->name);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-sm mr-8pt">
                                                                    <a  href="'.route('manage_campaign_detail',$campaign).'" class="">
                                                                       <span class="avatar-title rounded bg-primary text-white">'.$acronym.'</span>
                                                                    </a>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex flex-column">
                                                                            <a  href="'.route('manage_campaign_detail',$campaign).'"class="">
                                                                            <small class="js-lists-values-project">
                                                                                  <strong>'.$campaign->name.'</strong>
                                                                            </small>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('budget', function ($campaign){
                    $budget = Campaign::calculate_estimated_price($campaign);
                    $budget = number_format($budget,3);
                    $check_payment = Payment::where('campaign_id',$campaign->id)->first();
                    $payment_status = 'Processing';
                    if ($check_payment){
                        $payment_status = 'Paid';
                    }
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-budget">
                                                                        <strong>
                                                                        <img src="'.asset('images/nairalogo.png').'" alt="N" width="11px" height="11px" class="flex">
                                                                        '.$budget.'
                                                                        </strong>
                                                                    </small>
                                                                    <small class="text-50">'.$payment_status.'</small>
                                                                </div>';
                })
                ->editColumn('end_date', function ($campaign){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-date"><strong>'.Carbon::parse($campaign->end_date)->format('d/m/y').'</strong></small>
                                                                </div>';
                })
                ->rawColumns(['actions','status','sponsor','project','budget','end_date'])
                ->setRowId(function ($campaign) {
                    return route('manage_campaign_detail',$campaign);
                })
                ->make(true);
        }
    }
    public function pending_campaigns(Request $request)
    {
        if($request->ajax()){
            $campaigns = Campaign::where('status',Campaign::PENDING)
                ->orderBy('id', 'DESC');
            return DataTables::of($campaigns)
                ->addColumn('actions', function ($campaign){
                    $html = '<div class="btn-group btn-group-sm">';
                    $html .= '<a href="'.route('manage_campaign_detail',$campaign).'" class="text-50">
                                     <i class="material-icons">more_vert</i>
                              </a>';
                    return $html .'</div>';
                })
                ->editColumn('status', function (){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-status text-50 mb-4pt">Pending</small>
                                                                    <span class="indicator-line rounded bg-info"></span>
                                                                </div>';
                })
                ->editColumn('sponsor', function ($campaign){
                    $words = explode(" ", $campaign->sponsor);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    $disable_status = 'Enabled';
                    if ($campaign->is_disbale){
                        $disable_status = 'Disabled';
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-32pt mr-8pt">
                                                                        <span class="avatar-title rounded-circle">'.$acronym.'</span>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex align-items-center">
                                                                            <div class="flex d-flex flex-column">
                                                                                <p class="mb-0">
                                                                                <strong class="js-lists-values-lead">'.$campaign->sponsor.'</strong>
                                                                                </p>
                                                                                 <small class="text-50">'.$disable_status.'</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('project', function ($campaign){
                    $words = explode(" ", $campaign->name);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-sm mr-8pt">
                                                                    <a  href="'.route('manage_campaign_detail',$campaign).'" class="">
                                                                       <span class="avatar-title rounded bg-primary text-white">'.$acronym.'</span>
                                                                    </a>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex flex-column">
                                                                            <a  href="'.route('manage_campaign_detail',$campaign).'"class="">
                                                                            <small class="js-lists-values-project">
                                                                                  <strong>'.$campaign->name.'</strong>
                                                                            </small>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('budget', function ($campaign){
                    $budget = Campaign::calculate_estimated_price($campaign);
                    $budget = number_format($budget,3);
                    $check_payment = Payment::where('campaign_id',$campaign->id)->first();
                    $payment_status = 'Processing';
                    if ($check_payment){
                        $payment_status = 'Paid';
                    }
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-budget">
                                                                        <strong>
                                                                        <img src="'.asset('images/nairalogo.png').'" alt="N" width="11px" height="11px" class="flex">
                                                                    '.$budget.'
                                                                        </strong>
                                                                    </small>
                                                                   <small class="text-50">'.$payment_status.'</small>
                                                                </div>';
                })
                ->editColumn('end_date', function ($campaign){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-date"><strong>'.Carbon::parse($campaign->end_date)->format('d/m/y').'</strong></small>
                                                                </div>';
                })
                ->rawColumns(['actions','status','sponsor','project','budget','end_date'])
                ->setRowId(function ($campaign) {
                    return route('manage_campaign_detail',$campaign);
                })
                ->make(true);
        }
    }
    public function declined_campaigns(Request $request)
    {
        if($request->ajax()){
            $campaigns = Campaign::where('status',Campaign::DECLINE)
                ->orderBy('id', 'DESC');
            return DataTables::of($campaigns)
                ->addColumn('actions', function ($campaign){
                    $html = '<div class="btn-group btn-group-sm">';
                    $html .= '<a href="'.route('manage_campaign_detail',$campaign).'" class="text-50">
                                     <i class="material-icons">more_vert</i>
                              </a>';
                    return $html .'</div>';
                })
                ->editColumn('status', function (){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-status text-50 mb-4pt">Declined</small>
                                                                    <span class="indicator-line rounded bg-danger"></span>
                                                                </div>';
                })
                ->editColumn('sponsor', function ($campaign){
                    $words = explode(" ", $campaign->sponsor);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    $disable_status = 'Enabled';
                    if ($campaign->is_disbale){
                        $disable_status = 'Disabled';
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-32pt mr-8pt">
                                                                        <span class="avatar-title rounded-circle">'.$acronym.'</span>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex align-items-center">
                                                                            <div class="flex d-flex flex-column">
                                                                                <p class="mb-0">
                                                                                <strong class="js-lists-values-lead">'.$campaign->sponsor.'</strong>
                                                                                </p>
                                                                                <small class="text-50">'.$disable_status.'</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('project', function ($campaign){
                    $words = explode(" ", $campaign->name);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-sm mr-8pt">
                                                                    <a  href="'.route('manage_campaign_detail',$campaign).'" class="">
                                                                       <span class="avatar-title rounded bg-primary text-white">'.$acronym.'</span>
                                                                    </a>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex flex-column">
                                                                            <a  href="'.route('manage_campaign_detail',$campaign).'"class="">
                                                                            <small class="js-lists-values-project">
                                                                                  <strong>'.$campaign->name.'</strong>
                                                                            </small>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('budget', function ($campaign){
                    $budget = Campaign::calculate_estimated_price($campaign);
                    $budget = number_format($budget,3);
                    $check_payment = Payment::where('campaign_id',$campaign->id)->first();
                    $payment_status = 'Processing';
                    if ($check_payment){
                        $payment_status = 'Paid';
                    }
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-budget">
                                                                        <strong>
                                                                        <img src="'.asset('images/nairalogo.png').'" alt="N" width="11px" height="11px" class="flex">
                                                                    '.$budget.'
                                                                        </strong>
                                                                    </small>
                                     <small class="text-50">'.$payment_status.'</small>
                                                                </div>';
                })
                ->editColumn('end_date', function ($campaign){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-date"><strong>'.Carbon::parse($campaign->end_date)->format('d/m/y').'</strong></small>
                                                                </div>';
                })
                ->rawColumns(['actions','status','sponsor','project','budget','end_date'])
                ->setRowId(function ($campaign) {
                    return route('manage_campaign_detail',$campaign);
                })
                ->make(true);
        }
    }
    public function completed_campaigns(Request $request)
    {
        if($request->ajax()){
            $campaigns = Campaign::where('status',Campaign::COMPLETED)
                ->orderBy('id', 'DESC');
            return DataTables::of($campaigns)
                ->addColumn('actions', function ($campaign){
                    $html = '<div class="btn-group btn-group-sm">';
                    $html .= '<a href="'.route('manage_campaign_detail',$campaign).'" class="text-50">
                                     <i class="material-icons">more_vert</i>
                              </a>';
                    return $html .'</div>';
                })
                ->editColumn('status', function (){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-status text-50 mb-4pt">Completed</small>
                                                                    <span class="indicator-line rounded bg-success"></span>
                                                                </div>';
                })
                ->editColumn('sponsor', function ($campaign){
                    $words = explode(" ", $campaign->sponsor);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    $disable_status = 'Enabled';
                    if ($campaign->is_disbale){
                        $disable_status = 'Disabled';
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-32pt mr-8pt">
                                                                        <span class="avatar-title rounded-circle">'.$acronym.'</span>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex align-items-center">
                                                                            <div class="flex d-flex flex-column">
                                                                                <p class="mb-0">
                                                                                <strong class="js-lists-values-lead">'.$campaign->sponsor.'</strong>
                                                                                </p>
                                                                                <small class="text-50">'.$disable_status.'</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('project', function ($campaign){
                    $words = explode(" ", $campaign->name);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                                                    <div class="avatar avatar-sm mr-8pt">
                                                                    <a  href="'.route('manage_campaign_detail',$campaign).'" class="">
                                                                       <span class="avatar-title rounded bg-primary text-white">'.$acronym.'</span>
                                                                    </a>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex flex-column">
                                                                            <a  href="'.route('manage_campaign_detail',$campaign).'"class="">
                                                                            <small class="js-lists-values-project">
                                                                                  <strong>'.$campaign->name.'</strong>
                                                                            </small>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('budget', function ($campaign){
                    $budget = Campaign::calculate_estimated_price($campaign);
                    $budget = number_format($budget,3);
                    $check_payment = Payment::where('campaign_id',$campaign->id)->first();
                    $payment_status = 'Processing';
                    if ($check_payment){
                        $payment_status = 'Paid';
                    }
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-budget">
                                                                        <strong>
                                                                        <img src="'.asset('images/nairalogo.png').'" alt="N" width="11px" height="11px" class="flex">
                                                                    '.$budget.'
                                                                        </strong>
                                                                    </small>
                                                                    <small class="text-50">'.$payment_status.'</small>
                                                                </div>';
                })
                ->editColumn('end_date', function ($campaign){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-date"><strong>'.Carbon::parse($campaign->end_date)->format('d/m/y').'</strong></small>
                                                                </div>';
                })
                ->rawColumns(['actions','status','sponsor','project','budget','end_date'])
                ->setRowId(function ($campaign) {
                    return route('manage_campaign_detail',$campaign);
                })
                ->make(true);
        }
    }
    public function campaign_detail(Campaign $campaign)
    {
        $campaign->load('owner');
        $count_posts_story = Campaign::calculate_total_deliverables($campaign);
        $budget = Campaign::calculate_estimated_price($campaign);
        return view('admin.pages.campaign.detail',compact('campaign','count_posts_story','budget'));
    }
    public function campaign_change_status(Campaign $campaign)
    {
        if ($campaign->status == Campaign::PENDING || $campaign->status == \App\Models\Campaign::DECLINE ){
            $campaign->update([
                'status' => Campaign::ACTIVE
            ]);
            $message = 'Campaign Approve Successfully';
        }else{
            $campaign->update([
                'status' => Campaign::DECLINE
            ]);
            $message = 'Campaign Decline Successfully';
        }

        return redirect()->back()->with('success',$message);
    }
    public function campaign_approve(Campaign $campaign)
    {
        $campaign->update([
            'status' => Campaign::ACTIVE
        ]);
        $message = 'Campaign Approve Successfully';
        return redirect()->back()->with('success',$message);
    }
    public function campaign_complete(Campaign $campaign)
    {
        $campaign->update([
            'status' => Campaign::COMPLETED
        ]);
        $message = 'Campaign Completed Successfully';
        return redirect()->back()->with('success',$message);
    }
    public function campaign_declined(Campaign $campaign)
    {
        $campaign->update([
            'status' => Campaign::DECLINE
        ]);
        $message = 'Campaign Decline Successfully';
        return redirect()->back()->with('success',$message);
    }
    public function create_campaign()
    {
        $content_categories = ContentCategory::all();
        $creator_categories = CreatorCategory::all();
        return view('admin.pages.campaign.create_campaign',compact('content_categories','creator_categories'));
    }

    public function campaign_save(Request $request)
    {
        $request->validate([
            'campaign_sponsor' => 'required|string|max:100',
            'campaign_name' => 'required|string|max:100|unique:campaigns,name',
            'campaign_description' => 'required',
            'campaign_kpi' => 'required',
            'campaign_type' => 'required',
            'campaign_category' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'campaign_cover_image' => 'required|image|mimes:jpeg,png,jpg',
            'media_files' => 'required|array|max:5',
            'media_files.*' => 'image|mimes:jpeg,png,jpg',
            'campaign_duration' => 'required',
        ]);

        $user = User::where('user_name','igotrend')->first();

        $campaign =    Campaign::create([
            'user_id' =>  $user->id,
            'sponsor' =>  $request->campaign_sponsor,
            'name' =>  $request->campaign_name,
            'description' =>  $request->campaign_description,
            'kpis' =>  $request->campaign_kpi,
            'age_range' =>  $request->age_range,
            'type' =>  $request->campaign_type,
            'campaign_category_id' =>  $request->campaign_category,
            'creator_category_id' =>  $request->creator_category,
            'no_of_trender' =>  $request->no_of_trender,
            'start_date' =>  $request->start_date,
            'end_date' =>  $request->end_date,
            'daily_instagram_post' =>  $request->daily_instagram_post,
            'daily_instagram_story_post' =>  $request->daily_instagram_story_post,
            'daily_instagram_reel' =>  $request->daily_instagram_reel,
            'daily_instagram_live' =>  $request->daily_instagram_live,
            'daily_fb_post' =>  $request->daily_fb_post,
            'daily_fb_story_post' =>  $request->daily_fb_story_post,
            'daily_fb_reel' =>  $request->daily_fb_reel,
            'daily_fb_live' =>  $request->daily_fb_live,
            'daily_tiktok_post' =>  $request->daily_tiktok_post,
            'daily_tiktok_video_15_s' =>  $request->daily_tiktok_video_15_seconds,
            'daily_tiktok_video_60_s' =>  $request->daily_tiktok_video_60_seconds,
            'daily_tiktok_video_10_m' =>  $request->daily_tiktok_video_10_minutes,
            'daily_youtube_post' =>  $request->daily_youtube_post,
            'daily_youtube_video' =>  $request->daily_youtube_video,
            'daily_youtube_short' =>  $request->daily_youtube_short,
            'daily_youtube_live' =>  $request->daily_youtube_live,
            'daily_twitter_post' =>  $request->daily_twitter_post,
            'daily_twitter_poll' =>  $request->daily_twitter_poll,
            'daily_twitter_space' =>  $request->daily_twitter_space,
            'daily_snapchat_story' =>  $request->daily_snapchat_story,
            'daily_snapchat_video' =>  $request->daily_snapchat_video,
            'weekly_instagram_post' =>  $request->weekly_instagram_post,
            'weekly_instagram_story_post' =>  $request->weekly_instagram_story_post,
            'weekly_instagram_reel' =>  $request->weekly_instagram_reel,
            'weekly_instagram_live' =>  $request->weekly_instagram_live,
            'weekly_fb_post' =>  $request->weekly_fb_post,
            'weekly_fb_story_post' =>  $request->weekly_fb_story_post,
            'weekly_fb_reel' =>  $request->weekly_fb_reel,
            'weekly_fb_live' =>  $request->weekly_fb_live,
            'weekly_tiktok_post' =>  $request->weekly_tiktok_post,
            'weekly_tiktok_video_15_s' =>  $request->weekly_tiktok_video_15_seconds,
            'weekly_tiktok_video_60_s' =>  $request->weekly_tiktok_video_60_seconds,
            'weekly_tiktok_video_10_m' =>  $request->weekly_tiktok_video_10_minutes,
            'weekly_youtube_post' =>  $request->weekly_youtube_post,
            'weekly_youtube_video' =>  $request->weekly_youtube_video,
            'weekly_youtube_short' =>  $request->weekly_youtube_short,
            'weekly_youtube_live' =>  $request->weekly_youtube_live,
            'weekly_twitter_post' =>  $request->weekly_twitter_post,
            'weekly_twitter_poll' =>  $request->weekly_twitter_poll,
            'weekly_twitter_space' =>  $request->weekly_twitter_space,
            'weekly_snapchat_story' =>  $request->weekly_snapchat_story,
            'weekly_snapchat_video' =>  $request->weekly_snapchat_video,
            'no_of_day' =>  $request->no_of_day,
            'no_of_week' =>  $request->no_of_week,
            'campaign_duration' =>  $request->campaign_duration,
        ]);

        if ($request->file('campaign_cover_image')){
            $campaign->addMedia($request->file('campaign_cover_image'))->toMediaCollection('campaign_cover_image');
        }
        if ($request->media_files){
            foreach ($request->media_files as $file){
                $campaign->addMedia($file)->toMediaCollection('campaign_media_files');
            }
        }
        return redirect()->route('manage_campaign_brief',$campaign);
    }

    public function campaign_brief(Campaign $campaign)
    {
        return view('admin.pages.campaign.campaign_brief',compact('campaign'));
    }

    public function campaign_brief_save(Request $request,Campaign $campaign)
    {
        $request->validate([
            'brand_description' => 'required' ,
            'post_caption_text' =>  'required' ,
            'handles_hash' =>  'required' ,
            'dos' => 'required' ,
            'donts' => 'required' ,
        ]);
        $campaign->update([
            'brand_description' => $request->brand_description ,
            'post_caption_text' =>  $request->post_caption_text ,
            'handles_hash' =>  $request->handles_hash ,
            'dos' => $request->dos ,
            'donts' => $request->donts ,
        ]);
        return redirect()->route('manage_add_trenders',$campaign);
    }

    public function add_trenders(Request $request,Campaign $campaign)
    {
        $estimated_budget = Campaign::calculate_estimated_price($campaign);
        $campaign->load('campaign_users');
        $campaign_users = $campaign->campaign_users->pluck('user_id')->toArray();
        $total_trenders_selected = $campaign->campaign_users->count();
        $countries = Country::all();
        $trenders = null ;

        if (is_null($campaign->creator_category_id)){
            $trenders = User::Where('role',User::CREATOR)
                ->where('is_active',User::ACTIVE);
        }else{
            $trenders = User::Where('role',User::CREATOR)
                ->where('is_active',User::ACTIVE)
                ->whereNotNull('creator_category')
                ->whereRaw('FIND_IN_SET(?, creator_category)', [$campaign->creator_category_id]);
        }

        $filter_name  =null;
        $filter_level  = null;
        $filter_sex = null;
        $filter_country  = null;
        $filter_state  = null;

        if ($request->filter_name){
            $trenders->where('first_name', 'like', '%' . $request->filter_name . '%');
            $trenders->orwhere('last_name', 'like', '%' . $request->filter_name . '%');
            $filter_name =  $request->filter_name;
        }
        if ($request->filter_level){
            if ($request->filter_level != 'all'){
                $trenders->where('badge',$request->filter_level);
            }
            $filter_level =  $request->filter_level;
        }
        if ($request->filter_sex){
            if (!$request->filter_sex == "both"){
                $trenders->where('user_name',$request->filter_sex);
            }
            $filter_sex =  $request->filter_sex;
        }
        if ($request->filter_country){
            $trenders->where('country_id',$request->filter_country);
            $filter_country =  $request->filter_country;
        }
        if ($request->filter_state){
            $trenders->where('state_id',$request->filter_state);
            $filter_state =  $request->filter_state;
        }
        $trenders = $trenders->paginate(10);

        return view('admin.pages.campaign.add_trenders',compact('campaign',
            'countries',
            'trenders',
            'campaign_users',
            'total_trenders_selected',
            'filter_name',
            'filter_level',
            'filter_sex',
            'filter_country',
            'filter_state',
            'estimated_budget',

        ));
    }

    public function add_trenders_save(Request $request,Campaign $campaign)
    {
        $campaign->update([
            'mood' => $request->campaign_mode
        ]);
        return redirect()->route('manage_review_payment',$campaign);
    }

    public function review_payment(Campaign $campaign)
    {
        if ($campaign->mood == "public"){
            $check_campaign_users = CampaignInvite::where('campaign_id',$campaign->id)->first();
            if (!$check_campaign_users) {
                return redirect()->back()->with('warning','you must select at-least one trender for continue');
            }
        }
        $campaign->load('campaign_category');
        $count_posts_story = Campaign::calculate_total_deliverables($campaign);
        $budget = Campaign::calculate_estimated_price($campaign);
        return view('admin.pages.campaign.review_payment',compact('campaign','count_posts_story','budget'));
    }

    public function delete_campaign(Campaign $campaign)
    {
        Campaign::destroy($campaign->id);
        return response()->json([
            'status' => true,
            'redirect_url' => route('manage_admin_campaigns')
        ]);
    }

    public function edit_campaign(Campaign $campaign)
    {
        $content_categories = ContentCategory::all();
        $creator_categories = CreatorCategory::all();
        $age_range = $this->get_range_points($campaign);
        return view('admin.pages.campaign.edit_campaign',compact('campaign','content_categories','creator_categories','age_range'));
    }

    public function update_campaign(Request $request,Campaign $campaign)
    {

        $request->validate([
            'campaign_sponsor' => 'required|string|max:100',
            'campaign_name' => 'required|string|max:100|unique:campaigns,name,'.$campaign->id,
            'campaign_description' => 'required',
            'campaign_kpi' => 'required',
            'campaign_type' => 'required',
            'campaign_category' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'campaign_cover_image' => 'sometimes|image|mimes:jpeg,png,jpg',
            'media_files' => 'sometimes|array|max:5',
            'media_files.*' => 'image|mimes:jpeg,png,jpg',
            'campaign_duration' => 'required',
        ]);

        $campaign->update([
            'sponsor' =>  $request->campaign_sponsor,
            'name' =>  $request->campaign_name,
            'description' =>  $request->campaign_description,
            'kpis' =>  $request->campaign_kpi,
            'age_range' =>  $request->age_range,
            'type' =>  $request->campaign_type,
            'campaign_category_id' =>  $request->campaign_category,
            'creator_category_id' =>  $request->creator_category,
            'no_of_trender' =>  $request->no_of_trender,
            'start_date' =>  $request->start_date,
            'end_date' =>  $request->end_date,
            'daily_instagram_post' =>  $request->daily_instagram_post ?? 0,
            'daily_instagram_story_post' =>  $request->daily_instagram_story_post ?? 0,
            'daily_instagram_reel' =>  $request->daily_instagram_reel ?? 0,
            'daily_instagram_live' =>  $request->daily_instagram_live ?? 0,
            'daily_fb_post' =>  $request->daily_fb_post ?? 0,
            'daily_fb_story_post' =>  $request->daily_fb_story_post ?? 0,
            'daily_fb_reel' =>  $request->daily_fb_reel ?? 0,
            'daily_fb_live' =>  $request->daily_fb_live ?? 0,
            'daily_tiktok_post' =>  $request->daily_tiktok_post ?? 0,
            'daily_tiktok_video_15_s' =>  $request->daily_tiktok_video_15_seconds ?? 0,
            'daily_tiktok_video_60_s' =>  $request->daily_tiktok_video_60_seconds ?? 0,
            'daily_tiktok_video_10_m' =>  $request->daily_tiktok_video_10_minutes ?? 0,
            'daily_youtube_post' =>  $request->daily_youtube_post ?? 0,
            'daily_youtube_video' =>  $request->daily_youtube_video ?? 0,
            'daily_youtube_short' =>  $request->daily_youtube_short ?? 0,
            'daily_youtube_live' =>  $request->daily_youtube_live ?? 0,
            'daily_twitter_post' =>  $request->daily_twitter_post ?? 0,
            'daily_twitter_poll' =>  $request->daily_twitter_poll ?? 0,
            'daily_twitter_space' =>  $request->daily_twitter_space ?? 0,
            'daily_snapchat_story' =>  $request->daily_snapchat_story ?? 0,
            'daily_snapchat_video' =>  $request->daily_snapchat_video ?? 0,
            'weekly_instagram_post' =>  $request->weekly_instagram_post ?? 0,
            'weekly_instagram_story_post' =>  $request->weekly_instagram_story_post ?? 0,
            'weekly_instagram_reel' =>  $request->weekly_instagram_reel ?? 0,
            'weekly_instagram_live' =>  $request->weekly_instagram_live ?? 0,
            'weekly_fb_post' =>  $request->weekly_fb_post ?? 0,
            'weekly_fb_story_post' =>  $request->weekly_fb_story_post ?? 0,
            'weekly_fb_reel' =>  $request->weekly_fb_reel ?? 0,
            'weekly_fb_live' =>  $request->weekly_fb_live ?? 0,
            'weekly_tiktok_post' =>  $request->weekly_tiktok_post ?? 0,
            'weekly_tiktok_video_15_s' =>  $request->weekly_tiktok_video_15_seconds ?? 0,
            'weekly_tiktok_video_60_s' =>  $request->weekly_tiktok_video_60_seconds ?? 0,
            'weekly_tiktok_video_10_m' =>  $request->weekly_tiktok_video_10_minutes ?? 0,
            'weekly_youtube_post' =>  $request->weekly_youtube_post ?? 0,
            'weekly_youtube_video' =>  $request->weekly_youtube_video ?? 0,
            'weekly_youtube_short' =>  $request->weekly_youtube_short ?? 0,
            'weekly_youtube_live' =>  $request->weekly_youtube_live ?? 0,
            'weekly_twitter_post' =>  $request->weekly_twitter_post ?? 0,
            'weekly_twitter_poll' =>  $request->weekly_twitter_poll ?? 0,
            'weekly_twitter_space' =>  $request->weekly_twitter_space ?? 0,
            'weekly_snapchat_story' =>  $request->weekly_snapchat_story ?? 0,
            'weekly_snapchat_video' =>  $request->weekly_snapchat_video ?? 0,
            'no_of_day' =>  $request->no_of_day,
            'no_of_week' =>  $request->no_of_week,
            'campaign_duration' =>  $request->campaign_duration,
        ]);

        if ($request->file('campaign_cover_image')){
            $media = $campaign->getMedia('campaign_cover_image');
            if (!$media->isEmpty()){
                $media->first()->delete();
                $campaign->addMedia($request->file('campaign_cover_image'))
                    ->toMediaCollection('campaign_cover_image');
            }else{
                $campaign->addMedia($request->file('campaign_cover_image'))
                    ->toMediaCollection('campaign_cover_image');
            }
        }
        if ($request->media_files){
            $media = $campaign->getMedia('campaign_media_files');
            if (!$media->isEmpty()){
                foreach ($media as $med){
                    $med->delete();
                }
                foreach ($request->media_files as $file){
                    $campaign->addMedia($file)->toMediaCollection('campaign_media_files');
                }
            }else{
                foreach ($request->media_files as $file){
                    $campaign->addMedia($file)->toMediaCollection('campaign_media_files');
                }
            }
        }

        return redirect()->route('manage_campaign_brief',$campaign);
    }


    public function get_range_points($campaign)
    {
        $from = 0;
        $to = 0;
        foreach (explode(';',$campaign->age_range) as $key => $value){
            if ($key == 0){
                if ($value == "0"){
                    $from = 0;
                }
                if ($value == "12"){
                    $from = 1;
                }
                if ($value == "18"){
                    $from = 2;
                }
                if ($value == "21"){
                    $from = 3;
                }
                if ($value == "30"){
                    $from = 4;
                }
                if ($value == "40"){
                    $from = 5;
                }
                if ($value == "50"){
                    $from = 6;
                }
                if ($value == "60"){
                    $from = 7;
                }
                if ($value == "100"){
                    $from = 8;
                }
            }
            if ($key == 1){
                if ($value == "0"){
                    $to = 0;
                }
                if ($value == "12"){
                    $to = 1;
                }
                if ($value == "18"){
                    $to = 2;
                }
                if ($value == "21"){
                    $to = 3;
                }
                if ($value == "30"){
                    $to = 4;
                }
                if ($value == "40"){
                    $to = 5;
                }
                if ($value == "50"){
                    $to = 6;
                }
                if ($value == "60"){
                    $to = 7;
                }
                if ($value == "100"){
                    $to = 8;
                }
            }
        }
        return [
            'from' =>$from,
            'to' =>$to,
        ];

    }

    public function getCampaignUserInfo(User $user,Campaign $campaign){
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
            $info = view('admin.pages.campaign.trender_info',compact('user','campaign','exist_user','rating','total_engagement','total_reach'))->render();
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
            $info = view('admin.pages.campaign.user_info',compact('user','rating','total_engagement','total_reach'))->render();
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
                    $message = view('admin.includes.notification_message',compact('type'))->render();
                    Notification::create_record($user->id,$type,$message);
                }
                return redirect()->back()->with('success','Trender Added to Campaign !');
            }
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

    public function trenders_requests(Request $request)
    {
        if($request->ajax()){
            $campaigns = Campaign::all();
            if ($request->campaign){
                $campaigns = $campaigns->where('id',$request->campaign);
            }
            $campaigns_ids =  $campaigns->pluck('id')->toArray();
            $invitations = CampaignInvite::has('campaign')
                ->has('user')
                ->whereIn('campaign_id',$campaigns_ids)
                ->orderBy('id', 'DESC');

            return DataTables::of($invitations)
                ->addColumn('actions', function ($invite){

                    $html = '<div class="btn-group">';

                    $html .= '<a href="#"  class="btn btn-sm btn-primary view_trender_info" data-url="'.route('getCampaignUserInfo',[$invite->user,$invite->campaign]).'">View</a>';
                    if ($invite->payment_status == "paid"){
                        $html .= '<a href="'.route('accept_trender_invitation',$invite).'" class="btn btn-sm btn-success">Accept</a>';
                    }else{
                        $html .= '<a href="'.route('payRequestUser',$invite).'" class="btn btn-sm btn-success">Accept / Pay</a>';
                    }

                    $html .= '<a href="'.route('admin_decline_invitation',$invite).'" class="btn btn-danger btn-sm">Decline</a>';

                    return $html .' </div>';
                })
                ->addColumn('trender', function ($invite){
                    $name =  $invite->user->first_name.' '.$invite->user->last_name;
                    $words = explode(" ",$name);
                    $acronym = "";
                    foreach ($words as $w) {
                        $acronym .= ucwords(mb_substr($w, 0, 1));
                    }
                    return '<div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                    <div class="avatar avatar-32pt mr-8pt">
                                        <a href="#" class="view_trender_info" data-url="'.route('getCampaignUserInfo',[$invite->user,$invite->campaign]).'">
                                           <span class="avatar-title rounded-circle">'.$acronym.'</span>
                                        </a>
                                    </div>
                                    <div class="media-body">
                                        <div class="d-flex flex-column">
                                            <p class="mb-0"><strong class="js-lists-values-employee-name">'.ucwords($name).'</strong></p>
                                            <a href="#" class="view_trender_info" data-url="'.route('getCampaignUserInfo',[$invite->user,$invite->campaign]).'">
                                                <small class="text-50 ">
                                                    IGT@'.$invite->user->user_name.'
                                                </small>
                                            </a>
                                        </div>
                                    </div>
                                </div>';
                })
                ->addColumn('category', function ($invite){
                    $category = '';
                    if (!is_null($invite->user->creator_category)){
                        $category = 'Creator';
                    }else{
                        $category = 'Influencer';
                    }
                    return '<div class="d-flex align-items-center">
                                    <span href="#" class="text-warning">
                                       <i class="material-icons mr-8pt">star</i>
                                    </span>
                                    <span class="js-lists-values-employer-name">'.$category.'</span>
                                </div>';
                })
                ->addColumn('badge', function ($invite){
                    return '<span href="" class="chip chip-outline-secondary">'.$invite->user->badge.'</span>';
                })
                ->addColumn('level', function ($invite){
                    return User::get_user_level($invite->user);
                })
                ->addColumn('platform', function ($invite){
                    $html = '<span>';
                    if ($invite->user->facebook_profile){
                        $html .= '<img src="'.asset('images/facebook.png').'" width="16" height="16" alt="YT">';
                    }
                    if ($invite->user->instagram_profile){
                        $html .= '<img src="'.asset('images/instagram.png').'" width="16" height="16" alt="YT">';
                    }
                    if ($invite->user->twitter_profile){
                        $html .= '<img src="'.asset('images/twitter.png').'" width="16" height="16" alt="YT">';
                    }
                    if ($invite->user->youtube_profile){
                        $html .= '<img src="'.asset('images/youtube.png').'" width="16" height="16" alt="YT">';
                    }
                    if ($invite->user->tiktok_profile){
                        $html .= '<img src="'.asset('images/tiktok.png').'" width="16" height="16" alt="YT">';
                    }
                    if ($invite->user->snapchat_profile){
                        $html .= '<img src="'.asset('images/snapchat.png').'" width="16" height="16" alt="YT">';
                    }
                    return $html .'</span>';
                })
                ->addColumn('payout', function ($invite){
                    return '       <strong>
                                    <img src="'.asset('images/nairalogo.png').'" alt="N" width="11px" height="11px" class="flex">
                                    '.number_format(Campaign::get_trender_payout($invite->campaign,$invite->user),3).'
                                </strong>';
                })
                ->editColumn('status', function ($invite){
                    if ($invite->status == CampaignInvite::PENDING){
                        return 'Pending';
                    }elseif($invite->status == CampaignInvite::ACTIVE){
                        return 'Accepted';
                    }elseif($invite->status == CampaignInvite::DECLINE){
                        return 'Decline';
                    }elseif($invite->status == CampaignInvite::COMPLETED){
                        return 'Completed';
                    }
                })
                ->addColumn('payment_status', function ($invite){
                    if ($invite->payment_status == "paid"){
                        return 'Paid';
                    }else{
                        return 'Un-Paid';
                    }
//                    if ($invite->campaign->mood == 'private'){
//                        return 'Paid';
//                    }elseif ($invite->campaign->mood == 'public'){
//                        $check_payment = UserEarning::where('user_id',$invite->user_id)
//                            ->where('campaign_id',$invite->campaign_id)
//                            ->first();
//                        if ($check_payment){
//                            return 'Paid';
//                        }else{
//                            return 'Un-Paid';
//                        }
//                    }
                })
                ->rawColumns(['actions','trender','category','badge','platform','payout'])
                ->make(true);
        }
    }

    public function accept_invitation(CampaignInvite $invite)
    {
        $invite->update([
            'status' => CampaignInvite::ACTIVE
        ]);
        $user  = User::find($invite->user_id);
        $influencer_user_name = $user->first_name.' '.$user->last_name;
        Mail::to($user->email)->send(new CampaignRequestAccepted($influencer_user_name));

        $type = 'campaign_request_accepted';
        $message = view('admin.includes.notification_message',compact('type'))->render();
        Notification::create_record($invite->user_id,$type,$message);
        return redirect()->back()->with('success','Invitation Accepted');
    }
    public function decline_invitation(CampaignInvite $invite)
    {
        $invite->update([
            'status' => CampaignInvite::DECLINE
        ]);
        $user  = User::find($invite->user_id);
        $influencer_user_name = $user->first_name.' '.$user->last_name;
        Mail::to($user->email)->send(new CampaignRequestReject($influencer_user_name));

        $type = 'campaign_request_rejected';
        $message = view('admin.includes.notification_message',compact('type'))->render();
        Notification::create_record($invite->user_id,$type,$message);
        return redirect()->back()->with('success','Invitation Declined');
    }
}
