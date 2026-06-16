<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Mail\CreatorCampaignSubmission;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\CampaignSubmission;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\UserReward;
use App\Traits\imageUploadTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class CampaignController extends Controller
{
    use imageUploadTrait;
    public function my_campaigns()
    {
        $active_campaigns_count = CampaignInvite::where('user_id',auth()->user()->id)
            ->where('status',CampaignInvite::ACTIVE)
            ->count();
        $pending_campaigns_count = CampaignInvite::where('user_id',auth()->user()->id)
            ->where('status',CampaignInvite::PENDING)
            ->count();
        $declined_campaigns_count = CampaignInvite::where('user_id',auth()->user()->id)
            ->where('status',CampaignInvite::DECLINE)
            ->count();
        $completed_campaigns_count = CampaignInvite::where('user_id',auth()->user()->id)
            ->where('status',CampaignInvite::COMPLETED)
            ->count();
        $settings = Setting::first();
        $total_gems_received = UserReward::where('user_id',\auth()->user()->id)
            ->where('type','gems')
            ->sum('amount');
        $total_recharge_received = UserReward::where('user_id',\auth()->user()->id)
            ->where('type','air_time')
            ->sum('amount');

        return view('creators.pages.campaigns.index',compact('active_campaigns_count',
            'pending_campaigns_count',
            'declined_campaigns_count',
            'completed_campaigns_count',
            'settings',
            'total_gems_received',
            'total_recharge_received'
        ));
    }

    public function active_campaigns(Request  $request)
    {
        if($request->ajax()){
            $invities_id = CampaignInvite::where('user_id',auth()->user()->id)
                ->where('status',CampaignInvite::ACTIVE)
                ->pluck('campaign_id');

            $campaigns = Campaign::whereIn('id',$invities_id)
                ->orderBy('id', 'DESC');
            return DataTables::of($campaigns)
                ->addColumn('actions', function ($campaign){
                    $html = '<div class="btn-group btn-group-sm">';
                    $html .= '<a href="'.route('creator_campaign_detail',$campaign).'" class="text-50">
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
                                                                    <a  href="'.route('creator_campaign_detail',$campaign).'" class="">
                                                                       <span class="avatar-title rounded bg-primary text-white">'.$acronym.'</span>
                                                                    </a>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex flex-column">
                                                                            <a  href="'.route('creator_campaign_detail',$campaign).'"class="">
                                                                            <small class="js-lists-values-project">
                                                                                  <strong>'.$campaign->name.'</strong>
                                                                            </small>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('amount', function ($campaign){
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
                ->editColumn('due', function ($campaign){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-date">
                                                                        <strong>'.Carbon::parse($campaign->end_date)->format('d/m/y').'</strong>
                                                                    </small>
                                                                </div>';
                })
                ->rawColumns(['actions','status','sponsor','project','amount','due'])
                ->make(true);
        }
    }
    public function pending_campaigns(Request $request)
    {
        if($request->ajax()){
            $invities_id = CampaignInvite::where('user_id',auth()->user()->id)
                ->where('status',CampaignInvite::PENDING)
                ->pluck('campaign_id');
            $campaigns = Campaign::whereIn('id',$invities_id)
                ->orderBy('id', 'DESC');

            return DataTables::of($campaigns)
                ->addColumn('actions', function ($campaign){
                    $html = '<div class="btn-group btn-group-sm">';
                    $html .= '<a href="'.route('creator_campaign_detail',$campaign).'" class="text-50">
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
                                                                    <a  href="'.route('creator_campaign_detail',$campaign).'" class="">
                                                                       <span class="avatar-title rounded bg-primary text-white">'.$acronym.'</span>
                                                                    </a>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex flex-column">
                                                                            <a  href="'.route('creator_campaign_detail',$campaign).'"class="">
                                                                            <small class="js-lists-values-project">
                                                                                  <strong>'.$campaign->name.'</strong>
                                                                            </small>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('amount', function ($campaign){
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
                ->editColumn('due', function ($campaign){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-date">
                                                                        <strong>'.Carbon::parse($campaign->end_date)->format('d/m/y').'</strong>
                                                                    </small>
                                                                </div>';
                })
                ->rawColumns(['actions','status','sponsor','project','amount','due'])
                ->make(true);
        }
    }
    public function declined_campaigns(Request $request){
        if($request->ajax()){
            $invities_id = CampaignInvite::where('user_id',auth()->user()->id)
                ->where('status',CampaignInvite::DECLINE)
                ->pluck('campaign_id');
            $campaigns = Campaign::whereIn('id',$invities_id)
                ->orderBy('id', 'DESC');
            return DataTables::of($campaigns)
                ->addColumn('actions', function ($campaign){
                    $html = '<div class="btn-group btn-group-sm">';
                    $html .= '<a href="'.route('creator_campaign_detail',$campaign).'" class="text-50">
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
                                                                    <a  href="'.route('creator_campaign_detail',$campaign).'" class="">
                                                                       <span class="avatar-title rounded bg-primary text-white">'.$acronym.'</span>
                                                                    </a>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex flex-column">
                                                                            <a  href="'.route('creator_campaign_detail',$campaign).'"class="">
                                                                            <small class="js-lists-values-project">
                                                                                  <strong>'.$campaign->name.'</strong>
                                                                            </small>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>';
                })
                ->addColumn('amount', function ($campaign){
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
                ->editColumn('due', function ($campaign){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-date"><strong>'.Carbon::parse($campaign->end_date)->format('d/m/y').'</strong></small>
                                                                </div>';
                })
                ->rawColumns(['actions','status','sponsor','project','amount','due'])
                ->make(true);
        }
    }
    public function completed_campaigns(Request $request){
        if($request->ajax()){
            $invities_id = CampaignInvite::where('user_id',auth()->user()->id)
                ->where('status',CampaignInvite::COMPLETED)
                ->pluck('campaign_id');
            $campaigns = Campaign::whereIn('id',$invities_id)
                ->orderBy('id', 'DESC');
            return DataTables::of($campaigns)
                ->addColumn('actions', function ($campaign){
                    $html = '<div class="btn-group btn-group-sm">';
                    $html .= '<a href="'.route('creator_campaign_detail',$campaign).'" class="text-50">
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
                                                                    <a  href="'.route('creator_campaign_detail',$campaign).'" class="">
                                                                       <span class="avatar-title rounded bg-primary text-white">'.$acronym.'</span>
                                                                    </a>
                                                                    </div>
                                                                    <div class="media-body">
                                                                        <div class="d-flex flex-column">
                                                                            <a  href="'.route('creator_campaign_detail',$campaign).'"class="">
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
                                     <small class="text-50">'.$payment_status.'</smal
                                                                </div>';
                })
                ->editColumn('end_date', function ($campaign){
                    return '<div class="d-flex flex-column">
                                                                    <small class="js-lists-values-date">
                                                                      <strong>'.Carbon::parse($campaign->end_date)->format('d/m/y').'</strong>
                                                                    </small>
                                                                </div>';
                })
                ->rawColumns(['actions','status','sponsor','project','budget','end_date'])
                ->setRowId(function ($campaign) {
                    return route('creator_campaign_detail',$campaign);
                })
                ->make(true);
        }
    }

    public function campaign_detail(Campaign $campaign)
    {
        $check_status =CampaignInvite::where('user_id',\auth()->user()->id)
            ->where('campaign_id',$campaign->id)
            ->first();
        $count_posts_story = Campaign::calculate_total_deliverables($campaign);
        $budget = Campaign::calculate_estimated_price($campaign);
        $campaign_screenshot = CampaignSubmission::where('campaign_id',$campaign->id)
            ->where('user_id',Auth::id())
            ->get();

        return view('creators.pages.campaigns.detail',compact('check_status','campaign','count_posts_story','budget','campaign_screenshot'));
    }

    public function upload_campaign_screenshot(Request $request,Campaign $campaign){
        $validator = Validator::make( $request->all(), [
            'screen_shots' => 'required',
            'screen_shots.*' => 'required|image',
        ]);
        if ( $validator->fails() ) {
            return response()->json( [
                'error'    => true,
                "form"     => true,
                'messages' => $validator->errors(),
            ] );
        }else{
            $check_approve_submission = CampaignSubmission::where([
                'campaign_id' => $campaign->id,
                'user_id' => Auth::id(),
                'status' => CampaignSubmission::APPROVED
            ])->first();

            $check_pending_submission = CampaignSubmission::where([
                'campaign_id' => $campaign->id,
                'user_id' => Auth::id(),
                'status' => CampaignSubmission::REVIEW
            ])->first();

            if ($check_approve_submission){
                return response()->json( [
                    'error'    => true,
                    'message' => "You submission already approve against this campaign",
                ] );
            }else if ($check_pending_submission){
                return response()->json( [
                    'error'    => true,
                    'message' => "You submission already pending against this campaign",
                ] );
            }else{
                $files = $request->screen_shots;
                $images = array();
                foreach ($files as $file){
                    $extension = $file->getClientOriginalExtension();
                    $name = $file->getClientOriginalName();
                    $slug = uniqid() . '-' . Str::slug($name);
                    $image_name = $slug . '-' . Carbon::now()->toDateString() .'.'.$extension;
                    $file->storeAs('public/screen_shots',$image_name);
                    array_push($images,$image_name);
                }
                $submission = CampaignSubmission::create([
                    'campaign_id' => $campaign->id,
                    'user_id' => Auth::id(),
                    'screenshot_image' => implode(',',$images)
                ]);
                $brand = $submission->campaign->owner;
                $brand_user_name = $brand->user_name;
                $trender_user_name = $submission->user->user_name;
                Mail::to($brand->email)->send(new CreatorCampaignSubmission($brand_user_name,$trender_user_name));


                $type = 'campaign_submission';
                $message = view('creators.includes.notification_message',compact('type'))->render();
                Notification::create_record($brand->id,$type,$message);

                return response()->json( [
                    'error'    => false,
                    'form'     => false,
                    'redirect_url' => route('creator_campaign_detail',$campaign),
                ] );
            }
        }
    }

    public function remove_campaign_submission(CampaignSubmission $submission){
        foreach (explode(',',$submission->screenshot_image) as $image){
            unlink(storage_path('app/public/screen_shots/'.$image));
        }
        CampaignSubmission::destroy($submission->id);
    }

    public function update_screenshot_views(Request $request,CampaignSubmission $submission){
        $submission->update([
            'views' => $request->views
        ]);
        return redirect()->back()->with('success','views updated successfully');
    }

    public function update_screenshot_likes(Request $request,CampaignSubmission $submission){
        $submission->update([
            'likes' => $request->likes
        ]);
        return redirect()->back()->with('success','likes updated successfully');
    }
}
