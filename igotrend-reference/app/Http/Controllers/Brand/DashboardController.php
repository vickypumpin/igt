<?php

namespace App\Http\Controllers\Brand;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $active_campaigns = Campaign::where('user_id',Auth::user()->id)
            ->where('status',Campaign::ACTIVE)->count();
        $completed_campaigns = Campaign::where('user_id',Auth::user()->id)
            ->where('status',Campaign::COMPLETED)->count() ;
        $declined_campaigns = Campaign::where('user_id',Auth::user()->id)
            ->where('status',Campaign::DECLINE)->count() ;
        $pending_campaigns = Campaign::where('user_id',Auth::user()->id)
            ->where('status',Campaign::PENDING)->count() ;
        $campaigns = Campaign::where('user_id',\auth()->user()->id)->where('status',Campaign::ACTIVE);
        $campaigns_ids =  $campaigns->pluck('id')->toArray();
        $campaigns =  $campaigns->get();
        $invitations = CampaignInvite::whereIn('campaign_id',$campaigns_ids)->count();
        return view('brands.index',compact('active_campaigns','completed_campaigns',
            'declined_campaigns',
            'pending_campaigns',
            'invitations',
            'campaigns',
        ));
    }
}
