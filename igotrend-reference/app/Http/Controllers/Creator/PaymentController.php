<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Mail\RedeemGem;
use App\Models\GemPayoutRequest;
use App\Models\Payment;
use App\Models\PaymentFailedLog;
use App\Models\Setting;
use App\Models\UserReward;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use KingFlamez\Rave\Facades\Rave as Flutterwave;
use Yajra\DataTables\Facades\DataTables;

class PaymentController extends Controller
{
    public function payment_history(Request $request)
    {
        if($request->ajax()){
            $payments = Payment::where('user_id', auth()->user()->id)
                ->where(function($query) {
                    $query->where('payment_type', 'trender_payment')
                        ->orWhere('payment_type', 'trender_payout_payment')
                        ->orWhere('payment_type', 'trender_payout_gem_payment');
                })
                ->orderBy('id', 'DESC');

            return DataTables::of($payments)
                ->addColumn('actions', function ($payment){
                    $html = '<div class="d-inline-flex align-items-center">';
                    $html .= '  <a href="'.route('creator_invoice_detail',$payment).'" class="btn btn-sm btn-outline-secondary mr-16pt">View invoice
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
                ->addColumn('status', function ($payment){
                    if (!is_null($payment->payment_status)){
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
                    }else{
                        return '<div class="d-flex flex-column">
                                    <small class="js-lists-values-status text-50 mb-4pt">Paid </small>
                                    <span class="indicator-line rounded bg-success"></span>
                                </div>';
                    }

                })
                ->addColumn('activity', function ($payment){
                    $payment->load('campaign');
                    if ($payment->campaign){
                        return $payment->campaign->name .' Campaign';
                    }else{
                        if ($payment->payment_type == "trender_payout_gem_payment"){
                            return 'Gem Payment';
                        }else{
                            return '';
                        }
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
        return view('creators.pages.payments.history');
    }
    public function reward_detail(Request $request)
    {
        if($request->ajax()){
            $payments = UserReward::where('user_id',auth()->user()->id)
                ->orderBy('user_rewards.id', 'DESC');
            return DataTables::of($payments)
                ->editColumn('type', function ($payment){
                    if ($payment->type == "air_time"){
                        return "Air Time";
                    }else{
                        return "Gems";
                    }
                })
                ->addColumn('from', function ($payment){
                    if ($payment->is_guest){
                        return $payment->user_name;
                    }else{
                        if ($payment->user){
                            return $payment->user->user_name;
                        }else{
                            return "";
                        }
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
                ->editColumn('created_at', function ($payment){
                    return Carbon::parse($payment->created_at)->format('d/m/Y');
                })
                ->rawColumns(['status'])
                ->make(true);
        }
        return view('creators.pages.payments.history');
    }

    public function invoice_detail(Payment $payment)
    {
        $payment->load('user','campaign');
        return view('creators.pages.invoice',compact('payment'));
    }

    public function redeem_gems(Request $request)
    {

        $user_gems = auth()->user()->gems;
        if ($user_gems >= 1){
            $settings = Setting::first();
            $gems_price = $user_gems * $settings->gem_price;
            if ($gems_price > 0){
                if (auth()->user()->bank_name && auth()->user()->account_number){

                    GemPayoutRequest::create([
                        'gems' =>  $user_gems,
                        'user_id' =>  auth()->user()->id,
                        'gem_price' =>  $settings->gem_price,
                        'total_amount' =>  $gems_price,
                    ]);

                    auth()->user()->update([
                        'gems' => 0
                    ]);

                    Mail::to(auth()->user()->email)->send(new RedeemGem(auth()->user()->user_name));
                    return redirect()->back()->with('success','Redeem Gems Successfully');

//                    try {
//
//                        $reference = Flutterwave::generateReference();
//                        $data = [
//                            "account_bank"=> auth()->user()->bank_name,
//                            "account_number"=>(string) auth()->user()->account_number,
//                            'amount' => $gems_price,
//                            "narration"=> ucwords(auth()->user()->first_name.' '.auth()->user()->last_name)." Gem Payment",
//                            "currency"=>"NGN",
//                            'reference' => $reference,
//                            "debit_currency"=>"NGN",
//                        ];
//
//                        $secret_key = getenv('FLW_SECRET_KEY');
//                        $transfer = Http::withToken($secret_key)->post(
//                            'https://api.flutterwave.com/v3/transfers',
//                            $data
//                        );
//
//                        if ($transfer->successful()){
//                            $response = $transfer->json();
//                            Payment::create([
//                                'user_id' => auth()->user()->id,
//                                'tx_ref' => $response['data']['reference'],
//                                'payment_type' => 'trender_payout_gem_payment',
//                                'amount' => $gems_price,
//                                'payment_status' => 0,
//                                'account_number' => auth()->user()->account_number,
//                                'bank_code' => auth()->user()->bank_name,
//                            ]);
//                            auth()->user()->update([
//                                'gems' => 0
//                            ]);
//
//                            Mail::to(auth()->user()->email)->send(new RedeemGem(auth()->user()->user_name));
//                            return redirect()->back()->with('success','Redeem Gems Successfully');
//                        }else{
//                            $response = $transfer->json();
//                            PaymentFailedLog::create([
//                                'user_id' => auth()->user()->id,
//                                'message' => isset($response['message']) ? $response['message'] : '',
//                            ]);
//                            return redirect()->back()->with('danger','Something went wrong');
//                        }
//                    }
//                    catch (\Exception $exception){
//                        PaymentFailedLog::create([
//                            'user_id' => auth()->user()->id,
//                            'message' => $exception->getMessage(),
//                        ]);
//                        return redirect()->back()->with('danger','Something went wrong');
//                    }
                }else{
                    return redirect()->back()->with('danger','Please Update Bank name and account number');
                }
            }
        }else{
            return redirect()->back()->with('danger','You have no enough gems to redeem');
        }
    }
}
