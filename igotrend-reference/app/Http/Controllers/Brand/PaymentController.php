<?php

namespace App\Http\Controllers\Brand;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Payment;
use App\Models\UserReward;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class PaymentController extends Controller
{
    public function payment_history(Request $request)
    {
        if($request->ajax()){
            $payments = Payment::where('user_id',auth()->user()->id)
                ->orderBy('id', 'DESC');
            return DataTables::of($payments)
                ->addColumn('actions', function ($payment){
                    $html = '<div class="d-inline-flex align-items-center">';
                    $html .= '  <a href="'.route('invoice_detail',$payment).'" class="btn btn-sm btn-outline-secondary mr-16pt">View invoice
                                          <i class="icon--right material-icons">
                                          keyboard_arrow_right
                                          </i>
                                      </a>';
//                    $html .= '<a href="#" class="btn btn-sm btn-outline-secondary">Download
//                                     <i class="icon--right material-icons">
//                                     file_download
//                                     </i>
//                                 </a>';
                    return $html .'</div>';
                })
                ->addColumn('status', function (){
                    return '<div class="d-flex flex-column">
                                    <small class="js-lists-values-status text-50 mb-4pt">Paid </small>
                                    <span class="indicator-line rounded bg-success"></span>
                                </div>';
                })
                ->addColumn('activity', function ($payment){
                    $payment->load('campaign');
                    if ($payment->campaign){
                        return $payment->campaign->name .'Campaign';
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
                ->editColumn('amount', function ($payment){
                    return '<img src="'.asset('images/nairalogo.png').'" alt="N" class="flex">'.$payment->amount;
                })
                ->editColumn('created_at', function ($payment){
                    return Carbon::parse($payment->created_at)->format('d/m/Y');
                })
                ->rawColumns(['actions','amount','status'])
                ->make(true);
        }
        return view('brands.pages.payments.history');
    }

    public function billing()
    {
        return view('brands.pages.billing');
    }

    public function invoice_detail(Payment $payment)
    {
        $payment->load('user','campaign');
        return view('brands.pages.invoice',compact('payment'));
    }

    public function reward_detail(Request $request)
    {
        if($request->ajax()){
            $payments = UserReward::has('reward_user')
                ->with('reward_user')
                ->where('is_guest',0)
                ->where('from_user',auth()->user()->id)
                ->orderBy('user_rewards.id', 'DESC');
            return DataTables::of($payments)
                ->editColumn('type', function ($payment){
                    if ($payment->type == "air_time"){
                        return "Air Time";
                    }else{
                        return "Gems";
                    }
                })
                ->addColumn('status', function ($payment){
                    if ($payment->status == 1){
                        return '<div class="d-flex flex-column">
                                    <small class="js-lists-values-status text-50 mb-4pt">Successful </small>
                                    <span class="indicator-line rounded bg-success"></span>
                                </div>';
                    }
                    if ($payment->status == 0){
                        return '<div class="d-flex flex-column">
                                    <small class="js-lists-values-status text-50 mb-4pt">Pending </small>
                                    <span class="indicator-line rounded bg-danger"></span>
                                </div>';
                    }
                })
                ->addColumn('user_name', function ($payment){
                    return $payment->reward_user->user_name;
                })
                ->editColumn('created_at', function ($payment){
                    return Carbon::parse($payment->created_at)->format('d/m/Y');
                })
                ->rawColumns(['status'])
                ->make(true);
        }
    }
}
