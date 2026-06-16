<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Mail\CreatorAcceptCampaignInvite;
use App\Mail\CreatorRejectCampaignInvite;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Yajra\DataTables\Facades\DataTables;

class DashboardController extends Controller
{
    public function index()
    {
        $total_invitations = CampaignInvite::where('user_id',auth()->user()->id)->count();
        $completed_invitations = CampaignInvite::where('user_id',auth()->user()->id)
            ->where('status',CampaignInvite::COMPLETED)
            ->count();
        $declined_invitations = CampaignInvite::where('user_id',auth()->user()->id)
            ->where('status',CampaignInvite::DECLINE)
            ->count();
        return view('creators.index',compact('total_invitations','completed_invitations','declined_invitations'));
    }

    public function user_invitations(Request $request)
    {
        if($request->ajax()){
            $campaign_invites = CampaignInvite::whereHas('campaign', function($q){
                    $q->where('status',Campaign::ACTIVE);
                    $q->orwhere('status',Campaign::COMPLETED);
                })
                ->where('status',CampaignInvite::PENDING)
                ->where('user_id',auth()->user()->id)
                ->orderBy('id', 'DESC');
            return DataTables::of($campaign_invites)
                ->addColumn('actions', function ($invite){
                    $invite->load('campaign');
                   $html = '<div class="btn-group">';

                    $html .= '<a href="'.route('creator_campaign_detail',$invite->campaign).'" class="btn btn-sm btn-primary">View</a>';
                    if ($invite->status == CampaignInvite::PENDING) {
                        $html .= '<a href="' . route('accept_invitation', $invite) . '" class="btn btn-sm btn-success">Accept</a>';
                        $html .= ' <a href="' . route('decline_invitation', $invite) . '" class="btn btn-sm btn-danger">Decline</a>';
                    }

                    return $html .' </div>';
                })
                ->addColumn('campaign_name', function ($invite){
                    $invite->load('campaign');
                    $image_url = null;
                    if(!$invite->campaign->getMedia('campaign_cover_image')->isEmpty()){
                        $image_url = asset($invite->campaign->getMedia('campaign_cover_image')->first()->getUrl());
                    }else{
                        $image_url = 'https://dummyimage.com/64.png/fff';
                    }
                    return '                                <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">
                                    <div class="avatar avatar-lg mr-3">
                                        <a href="'.route('creator_campaign_detail',$invite->campaign).'">
                                            <img src="'.$image_url.'" alt="avatar" class="avatar-img rounded"></a>
                                    </div>
                                    <div class="media-body">
                                        <div class="posts-card__title flex d-flex flex-column">
                                            <h6 class="card-title m-0">
                                                <a href="'.route('creator_campaign_detail',$invite->campaign).'" class="hjs-lists-values-campaign-name">'.$invite->campaign->name.'</a></h6>
                                            <small class="text-50">Content Creators</small>
                                        </div>
                                    </div>
                                </div>';
                })
                ->addColumn('amount', function ($invite){
                    $amount = Campaign::calculate_estimated_price($invite->campaign);
                    return '<strong>
                                    <img src="'.asset('images/nairalogo.png').'" alt="N" width="11px" height="11px" class="flex">'.number_format($amount,3).'
                            </strong>';
                })
                ->addColumn('duration', function ($invite){
                    return Campaign::calculate_duration($invite->campaign);
                })
                ->addColumn('end_date', function ($invite){
                    return Carbon::parse($invite->campaign->end_date)->format('d/m/y');
                })
                ->addColumn('trenders', function ($invite){
                    $trenders = CampaignInvite::where('campaign_id',$invite->campaign_id);
                    $trenders_count = $trenders->count();
                    $trenders_more = $trenders_count - 3;
                    $trenders_users_id = $trenders->pluck('user_id');
                    if ($trenders_more < 0) {
                        $trenders_more = 0;
                    }
                    $users = '';
                    foreach ($trenders_users_id as $key => $user_id){
                        $user = User::find($user_id);
                        if ($user){
                            $users .= '<div class="avatar avatar-xs" data-toggle="tooltip" data-placement="top" title="'.ucfirst($user->first_name). ' '.ucfirst($user->last_name).'">
                                            <img src="'.get_user_image($user->id).'" alt="Avatar" class="avatar-img rounded-circle">
                                        </div>';
                        }
                        if ($key > 2){
                            break;
                        }
                    }
                    return '<div class="media mr-2 ml-sm-auto align-items-center">
                                    <div class="media-left mr-2 avatar-group">'.$users.'</div>
                                    <div class="media-body">
                                        <a href="#">+'.$trenders_more.' more</a>
                                    </div>
                                </div>';
                })
                ->rawColumns(['actions','trenders','campaign_name','amount'])
                ->make(true);
        }
    }

    public function accept_invitation(CampaignInvite $invite)
    {
        $invite->update([
            'status' => CampaignInvite::ACTIVE
        ]);
        $campaign = Campaign::find($invite->campaign_id);
        $campaign->load('owner');
        $user  = User::find($invite->user_id);
        $brand_user_name = $campaign->owner->first_name.' '.$campaign->owner->last_name;
        $influencer_user_name = $user->first_name.' '.$user->last_name;
        Mail::to($campaign->owner->email)->send(new CreatorAcceptCampaignInvite($influencer_user_name,$brand_user_name));


        $type = 'accept_campaign_invite';
        $message = view('creators.includes.notification_message',compact('type'))->render();
        Notification::create_record($campaign->owner->id,$type,$message);
        return redirect()->back()->with('success','Invitation Accepted');
    }

    public function decline_invitation(CampaignInvite $invite)
    {
        $invite->update([
            'status' => CampaignInvite::DECLINE
        ]);
        $campaign = Campaign::find($invite->campaign_id);
        $campaign->load('owner');
        $user  = User::find($invite->user_id);
        $brand_user_name = $campaign->owner->first_name.' '.$campaign->owner->last_name;
        $influencer_user_name = $user->first_name.' '.$user->last_name;
        Mail::to($campaign->owner->email)->send(new CreatorRejectCampaignInvite($influencer_user_name,$brand_user_name));


        $type = 'reject_campaign_invite';
        $message = view('creators.includes.notification_message',compact('type'))->render();
        Notification::create_record($campaign->owner->id,$type,$message);
        return redirect()->back()->with('success','Invitation Declined');
    }


}
