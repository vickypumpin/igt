<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\GemPayment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{

    public function index()
    {
        $campaigns = Campaign::all();
        $active_campaigns = Campaign::where('status',Campaign::ACTIVE)->count();
        $complete_campaigns = Campaign::where('status',Campaign::COMPLETED)->count();
        $total_revenue = Payment::sum('amount');
        $current_month_revenue = Payment::whereMonth('created_at', Carbon::now()->month)->sum('amount');
        $total_payout = Payment::where('payment_type', 'trender_payout_payment')
            ->orwhere('payment_type', 'trender_payout_gem_payment')
            ->sum('amount');
        $current_month_payout = Payment::whereMonth('created_at', Carbon::now()->month)
            ->where('payment_type', 'trender_payout_payment')
            ->orwhere('payment_type', 'trender_payout_gem_payment')
            ->sum('amount');
        $total_invitations = CampaignInvite::count();
        $total_pending_invitations = CampaignInvite::where('status',CampaignInvite::PENDING)->count();
        $total_decline_invitations = CampaignInvite::where('status',CampaignInvite::DECLINE)->count();
        $total_accept_invitations = CampaignInvite::where('status',CampaignInvite::ACTIVE)
            ->orwhere('status',CampaignInvite::COMPLETED)
            ->count();

        $total_payments_taxes = Payment::sum('tax_amount');
        $total_gem_payments_taxes = GemPayment::sum('tax_amount');

        $total_taxes = $total_payments_taxes + $total_gem_payments_taxes;

        return view('admin.dashboard',compact('campaigns','total_invitations','total_pending_invitations',
            'total_decline_invitations','total_accept_invitations','active_campaigns','complete_campaigns',
            'total_revenue','current_month_revenue','total_payout','current_month_payout','total_taxes'));
    }
}
