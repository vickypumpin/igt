<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AdminEmailNotify;
use App\Models\Admin;
use App\Models\Setting;
use App\Models\User;
use App\Traits\smsLive247Trait;
use App\Traits\TwilioTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
//    use TwilioTrait;
    use smsLive247Trait;
    public function index()
    {
        return view('admin.email');
    }

    public function send(Request $request)
    {
        $check_user = User::where('user_name',$request->to)->first();
        if ($check_user){
            $bcc = null;
            if ($request->bcc != "none"){
                if ($request->bcc == "all_users"){
                    $bcc = User::where('is_active',User::ACTIVE)
                        ->where('is_locked',User::UN_LOCKED)
                        ->pluck('email');
                }
                if ($request->bcc == "brands"){
                    $bcc = User::where('is_active',User::ACTIVE)
                        ->where('is_locked',User::UN_LOCKED)
                        ->where('role',User::BRAND)
                        ->pluck('email');
                }
                if ($request->bcc == "creators"){
                    $bcc = User::where('is_active',User::ACTIVE)
                        ->where('is_locked',User::UN_LOCKED)
                        ->where('role',User::CREATOR)
                        ->whereNotNull('creator_category')
                        ->pluck('email');
                }

                if ($request->bcc == "influencer"){
                    $bcc = User::where('is_active',User::ACTIVE)
                        ->where('is_locked',User::UN_LOCKED)
                        ->where('role',User::CREATOR)
                        ->whereNull('creator_category')
                        ->pluck('email');
                }

                if ($request->bcc == "administrator"){
                    $bcc = Admin::orderBy('id','desc')
                        ->pluck('email');
                }
            }
            $subject = $request->subject;
            $message = $request->message;
            $from_name = $request->from;
            if (!is_null($bcc)){
                Mail::to($check_user->email)
                    ->bcc($bcc->toArray())
                    ->send(new AdminEmailNotify($subject,$message,$from_name));
            }else{
                Mail::to($check_user->email)->send(new AdminEmailNotify($subject,$message,$from_name));
            }

            $setting = Setting::first();

            if ($setting->sms_notify){
                if ($request->sms_notify){
                    $sms_users = $request->sms_users ;
                    $users = null;

                    if ($sms_users == "brands"){
                        $users = User::where('role',User::BRAND)->whereNotNull('phone')
                            ->where('is_active',User::ACTIVE)
                            ->where('is_locked',User::UN_LOCKED)
                            ->select('id','phone')
                            ->get();
                    }
                    else if ($sms_users == "creators"){
                        $users = User::where('role',User::CREATOR)
                            ->where('is_active',User::ACTIVE)
                            ->where('is_locked',User::UN_LOCKED)
                            ->whereNotNull('phone')
                            ->select('id','phone')
                            ->get();
                    }
                    else if($sms_users == "both"){
                        $users = User::whereNotNull('phone')
                            ->where('is_active',User::ACTIVE)
                            ->where('is_locked',User::UN_LOCKED)
                            ->select('id','phone')
                            ->get();
                    }
                    else if($sms_users == "none"){
                        $users = collect();
                    }

                    if ($users != null && $users->count() != 0){
                        foreach ($users as $user){
                            if ($user->phone){
                                $this->sendSMS($user->phone,$message);
                            }
                        }
                    }
                    if($sms_users == "none"){
                        if ($check_user->phone){
                            $this->sendSMS($check_user->phone,$message);
                        }
                    }
                }
            }
            return redirect()->back()->with('success','Send Successfully');
        }else{
            return redirect()->back()->with('danger','User not Exist');
        }
    }
}
