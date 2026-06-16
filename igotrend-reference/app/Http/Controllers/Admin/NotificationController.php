<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CampaignRequestAccepted;
use App\Mail\MessageBoard;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NotificationController extends Controller
{

    public function notifications()
    {
        $settings = Setting::first();
        return view('admin.pages.notifications.index',compact('settings'));
    }

    public function notification_update(Request  $request)
    {
        $settings = Setting::first();
        $settings->update([
            'message_notification' => $request->message,
            'message_notification_date' => Carbon::now() ,
        ]);
        $users = User::where('is_active',User::ACTIVE)
            ->whereNotNull('email_verified_at')
            ->get();
        foreach ($users as $user){
            Mail::to($user->email)->send(new MessageBoard($user->user_name));
        }

        return redirect()->back()->with('success','Message Send successfully');
    }

}
