<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AcceptAccountDetails;
use App\Mail\RejectAccountDetails;
use App\Models\Admin;
use App\Models\BankName;
use App\Models\Campaign;
use App\Models\GemPayoutRequest;
use App\Models\Payment;
use App\Models\PaymentFailedLog;
use App\Models\PayoutRequest;
use App\Models\User;
use App\Models\UserAccountInfoRequest;
use App\Models\UserPaymentInfoRequest;
use App\Models\UserReward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Yajra\DataTables\DataTables;
use KingFlamez\Rave\Facades\Rave as Flutterwave;

class VerifyRequestController extends Controller
{
    public function verify_requests(Request $request)
    {
        if($request->ajax()){
            $verify_requests = UserPaymentInfoRequest::with(['user','bank'])
                ->where('is_approved',0)
                ->orderBy('id', 'DESC');

            return DataTables::of($verify_requests)
                ->addColumn('actions', function ($verify_request){
                    if ($verify_request->is_approved == 0){
                        $html = '<div class="btn-group btn-group-sm">';
                        $html .= '<a href="'.route("approve_verify_requests",$verify_request).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-check"></i>
                            </a>';
                        $html .= '<a href="'.route("remove_request",$verify_request).'" class="btn btn-danger btn-sm">
                                <i class="fa fa-trash"></i>
                            </a>';
                        return $html .'</div>';
                    }

                })
                ->addColumn('user_name', function ($verify_request){
                    $html = '';
                    if ($verify_request->user ){
                        $html .= $verify_request->user->first_name.' '.$verify_request->user->last_name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })->addColumn('bank_name', function ($verify_request){
                    $html = '';
                    if ($verify_request->bank ){
                        $html .= $verify_request->bank->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->rawColumns(['actions','user_name','bank_name'])
                ->make(true);
        }
        return view('admin.pages.verify_request.index');
    }

    public function approve_verify_requests(UserPaymentInfoRequest $user_request)
    {

        $user = User::where('id',$user_request->user_id)->first();

        if ($user){

            $user_request->update([
                'is_approved' => 1
            ]);

            $bank = BankName::where('id',$user_request->bank_id)->first();

            $user->update([
                'bank_name' => $bank->code,
                'account_number' => $user_request->account_number,
                'is_payment_info_locked' => User::PAYMENT_INFO_UN_LOCKED,
            ]);
            Mail::to($user->email)->send(new AcceptAccountDetails($user->user_name));
            return redirect()->back()->with('success','Info Updated Successfully');

        }else{
            return redirect()->back()->with('warning','User not exist');
        }
    }
    public function remove_request(UserPaymentInfoRequest $user_request)
    {
        $user = User::where('id',$user_request->user_id)->first();

        if ($user){
            $user->update([
                'is_payment_info_locked' => User::PAYMENT_INFO_UN_LOCKED,
            ]);
            UserPaymentInfoRequest::destroy($user_request->id);
            Mail::to($user->email)->send(new RejectAccountDetails($user->user_name));
            return redirect()->back()->with('success','User Payment info Deleted Successfully');
        }else{
            return redirect()->back()->with('warning','User not exist');
        }
    }

    public function account_verify_requests(Request $request)
    {
        if($request->ajax()){
            $verify_requests = UserAccountInfoRequest::where('is_approved',0)
                ->orderBy('id', 'DESC');

            return DataTables::of($verify_requests)
                ->addColumn('actions', function ($verify_request){
                    if ($verify_request->is_approved == 0){
                        $html = '<div class="btn-group btn-group-sm">';
                        $html .= '<a href="'.route("approve_account_verify_requests",$verify_request).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-check"></i>
                            </a>';
                        return $html .'</div>';
                    }
                })
                ->rawColumns(['actions'])
                ->make(true);
        }
        return view('admin.pages.account_verify_request.index');
    }

    public function approve_account_verify_requests(UserAccountInfoRequest $user_request)
    {
        $user = User::where('id',$user_request->user_id)->first();
        if ($user){
            $user_request->update([
                'is_approved' => 1
            ]);

            $user->update([
                'user_name' => $user_request->user_name,
                'instagram_profile' => $user_request->instagram_profile,
                'facebook_profile' => $user_request->facebook_profile,
                'tiktok_profile' => $user_request->tiktok_profile,
                'snapchat_profile' =>$user_request->snapchat_profile,
                'youtube_profile' => $user_request->youtube_profile,
                'twitter_profile' => $user_request->twitter_profile,
                'is_account_info_locked' => User::ACCOUNT_INFO_UN_LOCKED,
            ]);

            return redirect()->back()->with('success','Info Updated Successfully');

        }else{
            return redirect()->back()->with('warning','User not exist');
        }
    }



    public function air_time_requests(Request $request)
    {
        if($request->ajax()){
            $verify_requests = UserReward::with('reward_user')
                ->where('type','air_time')
                ->where('status',0)
                ->orderBy('id', 'DESC');

            return DataTables::of($verify_requests)
                ->addColumn('actions', function ($verify_request){
                    if ($verify_request->status == 0){
                        $html = '<div class="btn-group btn-group-sm">';
                        $html .= '<a href="'.route("approve_air_time_request",$verify_request).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-check"></i>
                            </a>';
                        return $html .'</div>';
                    }

                })
                ->addColumn('user_name', function ($verify_request){
                    $html = '';
                    if ($verify_request->reward_user ){
                        $html .= $verify_request->reward_user->first_name.' '.$verify_request->reward_user->last_name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('user_phone', function ($verify_request){
                    $html = '';
                    if ($verify_request->reward_user){
                        $html .= $verify_request->reward_user->phone;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
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
                ->rawColumns(['actions','user_name','status','user_phone'])
                ->make(true);
        }
        return view('admin.pages.air_time_request.index');
    }
    public function approve_air_time_request(UserReward $reward)
    {
        $reward->update([
            'status' => 1
        ]);
        return redirect()->back()->with('success','Reward Approve Successfully');
    }

    public function payout_requests(Request $request)
    {
        if($request->ajax()){
            $payout_requests = PayoutRequest::with(['user'])
                ->where('status',0)
                ->orderBy('id', 'DESC');

            return DataTables::of($payout_requests)
                ->addColumn('actions', function ($payout_request){
                    if ($payout_request->status == 0){
                        $html = '<div class="btn-group btn-group-sm">';
                        $html .= '<a href="'.route("approve_payout_request",$payout_request).'" class="btn btn-accent btn-sm">
                                Approve
                            </a>';
                        return $html .'</div>';
                    }
                })
                ->addColumn('user_name', function ($payout_request){
                    $html = '';
                    if ($payout_request->user ){
                        $html .= $payout_request->user->first_name.' '.$payout_request->user->last_name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })->addColumn('bank_name', function ($payout_request){
                    $html = '';
                    $bank = BankName::where('code',$payout_request->user->bank_name)->first();
                    if ($bank){
                        $html .= $bank->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('account_number', function ($payout_request){
                    $html = '';
                    if ($payout_request->user ){
                        $html .= $payout_request->user->account_number;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('amount', function ($payout_request){
                    $payout_request->load('campaign','user');
                    return Campaign::get_trender_payout($payout_request->campaign,$payout_request->user);
                })
                ->rawColumns(['actions','user_name','bank_name','account_number'])
                ->make(true);
        }
        return view('admin.pages.payout_requests.index');
    }

    public function gem_payout_requests(Request $request)
    {
        if($request->ajax()){
            $payout_requests = GemPayoutRequest::with(['user'])
                ->where('status',0)
                ->orderBy('id', 'DESC');

            return DataTables::of($payout_requests)
                ->addColumn('actions', function ($payout_request){
                    if ($payout_request->status == 0){
                        $html = '<div class="btn-group btn-group-sm">';
                        $html .= '<a href="'.route("approve_gem_payout_request",$payout_request).'" class="btn btn-accent btn-sm">
                                Approve
                            </a>';
                        return $html .'</div>';
                    }
                })
                ->addColumn('user_name', function ($payout_request){
                    $html = '';
                    if ($payout_request->user ){
                        $html .= $payout_request->user->first_name.' '.$payout_request->user->last_name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })->addColumn('bank_name', function ($payout_request){
                    $html = '';
                    $bank = BankName::where('code',$payout_request->user->bank_name)->first();
                    if ($bank){
                        $html .= $bank->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('account_number', function ($payout_request){
                    $html = '';
                    if ($payout_request->user ){
                        $html .= $payout_request->user->account_number;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->rawColumns(['actions','user_name','bank_name','account_number'])
                ->make(true);
        }
    }

    public function approve_payout_request(PayoutRequest $payout)
    {
        $payout->load('campaign','user');
        $trender_amount = Campaign::get_trender_payout($payout->campaign,$payout->user);
        if ($trender_amount > 0){
            try {
                $reference = Flutterwave::generateReference();
                $data = [
                    "account_bank"=> $payout->user->bank_name,
                    "account_number"=>(string) $payout->user->account_number,
                    'amount' => $trender_amount,
                    "narration"=> ucwords($payout->campaign->name)." Payment",
                    "currency"=>"NGN",
                    'reference' => $reference,
                    "debit_currency"=>"NGN",
                ];

                $secret_key = getenv('FLW_SECRET_KEY');
                $transfer = Http::withToken($secret_key)->post(
                    'https://api.flutterwave.com/v3/transfers',
                    $data
                );

                if ($transfer->successful()){
                    $response = $transfer->json();
                    Payment::create([
                        'user_id' => $payout->submission_user_id,
                        'campaign_id' => $payout->campaign_id,
                        'tx_ref' => $response['data']['reference'],
                        'payment_type' => 'trender_payout_payment',
                        'amount' => $trender_amount,
                        'account_number' => $payout->user->account_number,
                        'bank_code' => $payout->user->bank_name,
                        'payment_status' => 1
                    ]);

                    $payout->update([
                       'status' => 1
                    ]);
                    return redirect()->back()->with('success','Payment Send Successfull');

                }else{
                    $response = $transfer->json();
                    PaymentFailedLog::create([
                        'user_id' => $payout->submission_user_id,
                        'campaign_id' => $payout->campaign_id,
                        'submission_id' => $payout->submission_id,
                        'message' => isset($response['message']) ? $response['message'] : '',
                    ]);
                    return redirect()->back()->with('danger','Something Went Wrong');
                }

            }catch (\Exception $exception){
                PaymentFailedLog::create([
                    'user_id' => $payout->submission_user_id,
                    'campaign_id' => $payout->campaign_id,
                    'submission_id' => $payout->submission_id,
                    'message' => isset($response['message']) ? $response['message'] : '',
                ]);
                return redirect()->back()->with('danger','Something Went Wrong');
            }
        }else{
            return redirect()->back()->with('danger','Trender Payment not be zero');
        }
    }
    public function approve_gem_payout_request(GemPayoutRequest $payout)
    {
        $payout->load('user');
        if ($payout->total_amount > 0){
            try {
                $reference = Flutterwave::generateReference();
                $data = [
                    "account_bank"=> $payout->user->bank_name,
                    "account_number"=>(string) $payout->user->account_number,
                    'amount' => $payout->total_amount,
                    "narration"=> ucwords($payout->user->first_name.' '.$payout->user->last_name)." Gem Payment",
                    "currency"=>"NGN",
                    'reference' => $reference,
                    "debit_currency"=>"NGN",
                ];

                $secret_key = getenv('FLW_SECRET_KEY');
                $transfer = Http::withToken($secret_key)->post(
                    'https://api.flutterwave.com/v3/transfers',
                    $data
                );

                if ($transfer->successful()){
                    $response = $transfer->json();
                    Payment::create([
                        'user_id' => $payout->user_id,
                        'tx_ref' => $response['data']['reference'],
                        'payment_type' => 'trender_payout_gem_payment',
                        'amount' => $payout->total_amount,
                        'account_number' => $payout->user->account_number,
                        'bank_code' => $payout->user->bank_name,
                        'payment_status' => 1,
                    ]);

                    $payout->update([
                       'status' => 1
                    ]);
                    return redirect()->back()->with('success','Payment Send Successfully');

                }else{
                    $response = $transfer->json();
                    PaymentFailedLog::create([
                        'user_id' => $payout->user_id,
                        'message' => isset($response['message']) ? $response['message'] : '',
                    ]);
                    return redirect()->back()->with('danger','Something Went Wrong');
                }

            }catch (\Exception $exception){
                PaymentFailedLog::create([
                    'user_id' => $payout->user_id,
                    'message' => isset($response['message']) ? $response['message'] : '',
                ]);
                return redirect()->back()->with('danger','Something Went Wrong');
            }
        }else{
            return redirect()->back()->with('danger','Total amount not be zero');
        }
    }
}
