<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BankName;
use App\Models\Campaign;
use App\Models\GemPayment;
use App\Models\GemPayoutRequest;
use App\Models\Payment;
use App\Models\PayoutRequest;
use App\Models\User;
use App\Models\UserEarning;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class PaymentController extends Controller
{
    public function index()
    {
        $success_full_payments = Payment::where('payment_type','campaign_payment')
            ->where('payment_type','trender_payment')
            ->sum('amount') ;
        $success_full_payout_payments = Payment::where('payment_type','trender_payout_payment')
            ->where('payment_status',1)
            ->sum('amount') ;

        $trender_payout_pending_payments = Payment::where('payment_status','=',0)
            ->where('payment_type','=','trender_payout_payment')
            ->sum('amount') ;

        $trender_payout_gem_pending_payments = Payment::where('payment_status','=',0)
            ->where('payment_type','=','trender_payout_gem_payment')
            ->sum('amount') ;

        $trender_pending_gem_payout_request = GemPayoutRequest::where('status',0)->sum('total_amount');

        $trender_pending_payout_request = PayoutRequest::where('status',0)->get();

        $payout_sum = 0;

        foreach ($trender_pending_payout_request as $payout_request){
            $payout_sum += Campaign::get_trender_payout($payout_request->campaign,$payout_request->user);
        }

        $pending_payments = $trender_payout_pending_payments  + $trender_payout_gem_pending_payments + $payout_sum + $trender_pending_gem_payout_request;


        $success_full_payments = $success_full_payments + $success_full_payout_payments +  GemPayment::sum('amount') ;
        return view('admin.payments',compact('success_full_payments','pending_payments'));
    }

    public function brand_payments(Request $request)
    {
        if($request->ajax()){
            $payments = Payment::with('campaign','user')
                ->where('payment_type', 'campaign_payment')
                ->orwhere('payment_type', 'trender_payment')
                ->orwhere('payment_type', 'trender_gem_payment')
                ->orwhere('payment_type', 'trender_air_time_payment')
                ->select('payments.*')
                ->orderBy('payments.id', 'DESC');

            return DataTables::of($payments)
                ->addColumn('actions', function ($payment){
                    return '  <a href="'.route('admin_invoice_detail',$payment).'" class="btn btn-sm btn-outline-secondary mr-16pt">View invoice <i class="icon--right material-icons">keyboard_arrow_right</i></a>';
                })
                ->addColumn('status', function ($payment){
                    return '<div class="d-flex flex-column">
                                    <small class="js-lists-values-status text-50 mb-4pt">Paid </small>
                                    <span class="indicator-line rounded bg-success"></span>
                                </div>';
                })
                ->editColumn('amount', function ($payment){
                    return '<small class=" text-50">N '. number_format($payment->amount,2) .'</small>';
                })
                ->editColumn('created_at', function ($payment){
                    return \Illuminate\Support\Carbon::parse($payment->created_at)->format('d/m/Y h:i a');
                })
                ->addColumn('campaign_name', function ($payment){
                    if ($payment->campaign){
                        return $payment->campaign->name;
                    }else{
                        if ($payment->payment_type == "trender_gem_payment"){
                            return 'Gem Payment';
                        }
                        if ($payment->payment_type == "trender_air_time_payment"){
                            return 'Air Time Payment';
                        }
                        return '';
                    }
                })
                ->addColumn('user', function ($payment){
                    if ($payment->user){
                        return $payment->user->first_name .' '.$payment->user->last_name ;
                    }else{
                        return ' ';
                    }
                })
                ->rawColumns(['actions','status','amount'])
                ->make(true);
        }
    }

    public function creator_payments(Request $request)
    {
        if($request->ajax()){
            $payments = Payment::with('campaign','user')
                ->where('payment_type', 'trender_payout_payment')
                ->orwhere('payment_type', 'trender_payout_gem_payment')
                ->select('payments.*')
                ->orderBy('payments.id', 'DESC');

            if ($request->user_type){
                if ($request->user_type != "all"){
                    $user_type = $request->user_type;
                    $payments->whereHas('user', function($q) use ($user_type) {
                        if ($user_type == "influencers"){
                            $q->whereNotNull('creator_category');
                        }
                        if ($user_type == "content_creators"){
                            $q->whereNull('creator_category');
                        }
                    });
                }
            }

            return DataTables::of($payments)
                ->addColumn('actions', function ($payment){
                    $html = '<div class="btn-group">';
                    $html .= '  <a href="'.route('admin_invoice_detail',$payment).'" class="btn btn-sm btn-outline-secondary mr-16pt">View invoice <i class="icon--right material-icons">keyboard_arrow_right</i></a>';
                    if ($payment->payment_status == 0){
                        $html .= '  <a href="'.route('admin_approve_invoice',$payment).'" class="btn btn-sm btn-primary">Approve</a>';
                    }
                    return $html . '  </div>';

                })
                ->addColumn('status', function ($payment){
                    if ($payment->payment_status == 0){
                        return '<div class="d-flex flex-column">
                                    <small class="js-lists-values-status text-50 mb-4pt">Processing </small>
                                    <span class="indicator-line rounded bg-danger"></span>
                                </div>';
                    }else{
                        return '<div class="d-flex flex-column">
                                    <small class="js-lists-values-status text-50 mb-4pt">Paid </small>
                                    <span class="indicator-line rounded bg-success"></span>
                                </div>';
                    }

                })
                ->editColumn('amount', function ($payment){
                    return '<small class=" text-50">N '. number_format($payment->amount,2) .'</small>';
                })
                ->editColumn('created_at', function ($payment){
                    return \Illuminate\Support\Carbon::parse($payment->created_at)->format('d/m/Y h:i a');
                })
                ->addColumn('campaign_name', function ($payment){
                    if ($payment->campaign){
                        return $payment->campaign->name;
                    }else{
                        return 'Gem Payment';
                    }

                })
                ->addColumn('user_name', function ($payment){
                    if ($payment->user){
                        return $payment->user->first_name .' '.$payment->user->last_name ;
                    }else{
                        return ' ';
                    }
                })
                ->addColumn('user_role', function ($payment){
                    if ($payment->user){
                        if ($payment->user->creator_category){
                            return 'Influencer';
                        }else{
                            return 'Creator';
                        }
                    }else{
                        return ' ' ;
                    }
                })
                ->addColumn('bank_name', function ($payment){
                    $bank = BankName::where('code',$payment->bank_code)->first();
                    if ($bank){
                        return $bank->name;
                    }else{
                        return ' ';
                    }
                })
                ->rawColumns(['actions','status','amount'])
                ->make(true);
        }
    }

    public function gem_payments(Request $request)
    {
        if($request->ajax()){
            $payments = GemPayment::with('trender')
                ->orderBy('gem_payments.id', 'DESC')
            ->select('gem_payments.*');

            return DataTables::of($payments)
                ->addColumn('status', function ($payment){
                    return '<div class="d-flex flex-column">
                                    <small class="js-lists-values-status text-50 mb-4pt">Paid </small>
                                    <span class="indicator-line rounded bg-success"></span>
                                </div>';
                })
                ->editColumn('amount', function ($payment){
                    return '<small class=" text-50">N '. number_format($payment->amount,2) .'</small>';
                })
                ->editColumn('created_at', function ($payment){
                    return \Illuminate\Support\Carbon::parse($payment->created_at)->format('d/m/Y h:i a');
                })
                ->addColumn('trender_name', function ($payment){
                    if ($payment->trender){
                        return $payment->trender->first_name .' '.$payment->trender->last_name ;
                    }else{
                        return ' ' ;
                    }
                })
                ->rawColumns(['status','amount'])
                ->make(true);
        }
    }

    public function invoice_detail(Payment $payment)
    {
        $payment->load('user','campaign');
        return view('admin.invoice',compact('payment'));
    }

    public function approve_invoice(Payment $payment)
    {
        $payment->update([
            'payment_status' => 1
        ]);

        UserEarning::create([
            'campaign_id' => $payment->campaign_id,
            'user_id' => $payment->user_id,
            'amount' => $payment->amount,
        ]);

        return redirect()->back()->with('success','Payment Approved');
    }
}
