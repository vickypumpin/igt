<?php

namespace App\Http\Controllers\Brand;

use App\Events\BrandInfluencerMessage;
use App\Events\UserAdminMessage;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\AdminMessage;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\Notification;
use App\Models\User;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $campaign_id = $request->campaign_id ?? null;
        $campaigns = Campaign::where('user_id',auth()->user()->id)
            ->where('status',Campaign::ACTIVE)
            ->orderBy('id', 'DESC');

        $campaigns_ids =  $campaigns->pluck('id');
        $advertisers_ids = CampaignInvite::whereIn('campaign_id',$campaigns_ids)
            ->pluck('user_id');

        if ($request->campaign_id){
            $advertisers_ids = CampaignInvite::where('campaign_id',$request->campaign_id)
                ->pluck('user_id');
        }
        $campaigns =  $campaigns->get();
        $advertisers = User::whereIn('id',$advertisers_ids)
            ->get();
        $admins = Admin::all();
        $admin_ids = $admins->pluck('id');

        return view('brands.pages.message.index',compact('campaigns',
            'campaign_id',
            'advertisers',
            'admins',
            'advertisers_ids',
            'admin_ids',
        ));
    }
    public function chatIndex(User $receiver,Request $request)
    {
        $count_un_read_message = UserMessage::where('from_user',$receiver->id)
            ->where('to_user',auth()->user()->id)
            ->where('is_read',0)
            ->count();

        if ($count_un_read_message > 0){
            UserMessage::where('from_user',$receiver->id)
                ->where('to_user',auth()->user()->id)
                ->where('is_read',0)
                ->update([
                    'is_read' => 1
                ]);
        }
        $campaign_id = $request->campaign_id ?? null;
        $campaigns = Campaign::where('user_id',auth()->user()->id)
            ->where('status',Campaign::ACTIVE)
            ->orderBy('id', 'DESC');

        $campaigns_ids =  $campaigns->pluck('id');
        $advertisers_ids = CampaignInvite::whereIn('campaign_id',$campaigns_ids)
            ->pluck('user_id');

        if ($request->campaign_id){
            $advertisers_ids = CampaignInvite::where('campaign_id',$request->campaign_id)
                ->pluck('user_id');
        }
        $campaigns =  $campaigns->get();
        $advertisers = User::whereIn('id',$advertisers_ids)
            ->get();

        $messages = UserMessage::where(function($query) use ($receiver, $request) {
            $query->where('from_user', Auth::user()->id)->where('to_user', $receiver->id);
        })->orWhere(function ($query) use ($receiver, $request) {
            $query->where('from_user', $receiver->id)->where('to_user', Auth::user()->id);
        })->orderBy('created_at', 'asc')
            ->get();
        $admins = Admin::all();
        $admin_ids = $admins->pluck('id');


        foreach ($advertisers_ids as $key => $value) {
            if ($value == $receiver->id){
                unset($advertisers_ids[$key]);
            }
        }


        return view('brands.pages.message.userChat',compact('campaigns',
            'campaign_id',
            'advertisers',
            'receiver',
            'messages',
            'admins',
            'advertisers_ids',
            'admin_ids',
        ));
    }
    public function send_msg(Request $request)
    {
        $message =   UserMessage::create([
            'message' => $request->comment,
            'from_user' => $request->from_user,
            'to_user' => $request->to_user,
        ]);
        $message_html = view('brands.pages.message.message-line',compact('message'))->render();
        $receiver_img_path = get_user_image($message->to_user);
        $date = \Carbon\Carbon::parse($message->created_at)->format('H:i A') .'|'. $message->created_at->format('d M');
        broadcast(new BrandInfluencerMessage($message->to_user,$receiver_img_path,$message->message,$date));
        return response()->json([
            'status' => true,
            'message_html' => $message_html,
        ]);
    }
    public function admin_chat(Admin $receiver,Request $request)
    {
        $count_admin_un_read_message = AdminMessage::where('from_user',$receiver->id)
            ->where('to_user',auth()->user()->id)
            ->where('is_read',0)
            ->count();

        if ($count_admin_un_read_message > 0){
            AdminMessage::where('from_user',$receiver->id)
                ->where('to_user',auth()->user()->id)
                ->where('is_read',0)
                ->update([
                    'is_read' => 1
                ]);
        }

        $campaign_id = $request->campaign_id ?? null;
        $campaigns = Campaign::where('user_id',auth()->user()->id)
            ->where('status',Campaign::ACTIVE)
            ->orderBy('id', 'DESC');

        $campaigns_ids =  $campaigns->pluck('id');
        $advertisers_ids = CampaignInvite::whereIn('campaign_id',$campaigns_ids)
            ->pluck('user_id');

        if ($request->campaign_id){
            $advertisers_ids = CampaignInvite::where('campaign_id',$request->campaign_id)
                ->pluck('user_id');
        }
        $campaigns =  $campaigns->get();
        $advertisers = User::whereIn('id',$advertisers_ids)
            ->get();

        $messages = AdminMessage::where(function($query) use ($receiver, $request) {
            $query->where('from_user', Auth::user()->id)->where('to_user', $receiver->id);
        })->orWhere(function ($query) use ($receiver, $request) {
            $query->where('from_user', $receiver->id)->where('to_user', Auth::user()->id);
        })->orderBy('created_at', 'asc')
            ->get();
        $admins = Admin::all();
        $admin_ids = $admins->pluck('id');


        foreach ($admin_ids as $key => $value) {
            if ($value == $receiver->id){
                unset($admin_ids[$key]);
            }
        }


        return view('brands.pages.message.adminChat',compact('campaigns',
            'campaign_id',
            'advertisers',
            'receiver',
            'messages',
            'admins',
            'advertisers_ids',
            'admin_ids',
        ));
    }
    public function admin_send_msg(Request $request)
    {
        $message =   AdminMessage::create([
            'message' => $request->comment,
            'from_user' => $request->from_user,
            'to_user' => $request->to_user,
            'admin' => 'to_user',
        ]);
        $message_html = view('brands.pages.message.message-line',compact('message'))->render();
        $sender_img_path = get_user_image($message->from_user);
        $date = \Carbon\Carbon::parse($message->created_at)->format('d-m-y h:i A');
        broadcast(new UserAdminMessage($message->to_user,$sender_img_path,$message->message,$date));
        return response()->json([
            'status' => true,
            'message_html' => $message_html,
        ]);
    }
    public function get_unread_messages(Request $request)
    {
        $data  = [];
        foreach (explode(',',$request->advertiser_ids) as $advertiser){
            $count_un_read_message =   UserMessage::where('from_user',$advertiser)
                ->where('to_user',auth()->user()->id)
                ->where('is_read',0)
                ->count();
            if ($count_un_read_message > 0){
                $message = [
                    'advertiser_id' => $advertiser,
                    'count_message' => $count_un_read_message ,
                    'is_remove' => false ,
                ];
                array_push($data,$message);
            }else{
                $message = [
                    'advertiser_id' => $advertiser,
                    'count_message' => $count_un_read_message ,
                    'is_remove' => true ,
                ];
                array_push($data,$message);
            }
        }
        if (count($data) > 0){
            return response()->json([
                'status' => true,
                'response_data' => $data,
            ]);
        }else{
            return response()->json([
                'status' => false,
            ]);
        }
    }
    public function get_admin_unread_messages(Request $request)
    {
        $data  = [];
        foreach (explode(',',$request->admin_ids) as $admin){
            $count_un_read_message =   AdminMessage::where('from_user',$admin)
                ->where('to_user',\auth()->user()->id)
                ->where('is_read',0)
                ->count();
            if ($count_un_read_message > 0){
                $message = [
                    'admin_id' => $admin,
                    'count_message' => $count_un_read_message ,
                    'is_remove' => false ,
                ];
                array_push($data,$message);
            }else{
                $message = [
                    'admin_id' => $admin,
                    'count_message' => $count_un_read_message ,
                    'is_remove' => true ,
                ];
                array_push($data,$message);
            }
        }
        if (count($data) > 0){
            return response()->json([
                'status' => true,
                'response_data' => $data,
            ]);
        }else{
            return response()->json([
                'status' => false,
            ]);
        }
    }
    public function get_all_unread_messages()
    {
        $campaigns = Campaign::where('user_id',auth()->user()->id)
            ->where('status',Campaign::ACTIVE)
            ->orderBy('id', 'DESC');

        $campaigns_ids =  $campaigns->pluck('id');
        $advertisers_ids = CampaignInvite::whereIn('campaign_id',$campaigns_ids)
            ->pluck('user_id');
        $count_un_read_message =   UserMessage::whereIn('from_user',$advertisers_ids)
            ->where('to_user',auth()->user()->id)
            ->where('is_read',0)
            ->count();

        $admins_id = Admin::pluck('id') ;

        $admin_un_read_message =   AdminMessage::whereIn('from_user',$admins_id)
            ->where('to_user',auth()->user()->id)
            ->where('is_read',0)
            ->count();

        $total_count = $count_un_read_message + $admin_un_read_message;

        $notifications = Notification::where('user_id',\auth()->user()->id)
            ->where('is_read',Notification::UN_READ)
            ->count();

        return response()->json([
            'status' => true,
            'count_message' => $total_count,
            'count_notifications' => $notifications,
        ]);
    }

    public function get_user_unread_messages()
    {
        $campaigns = Campaign::where('user_id',auth()->user()->id)
            ->where('status',Campaign::ACTIVE)
            ->orderBy('id', 'DESC');

        $campaigns_ids =  $campaigns->pluck('id');
        $advertisers_ids = CampaignInvite::whereIn('campaign_id',$campaigns_ids)
            ->pluck('user_id');
        $un_read_message =   UserMessage::whereIn('from_user',$advertisers_ids)
            ->where('to_user',auth()->user()->id)
            ->where('is_read',0)
            ->get();

        $admins_id = Admin::pluck('id') ;

        $admin_un_read_message =   AdminMessage::has('admin_from')
            ->whereIn('from_user',$admins_id)
            ->where('to_user',auth()->user()->id)
            ->where('is_read',0)
            ->get();

        $messages = null;
        foreach ($un_read_message as $message){
            $is_admin = false;
            $render_message =  view('brands.pages.message.header_message',compact('message','is_admin'))->render();
            $messages .= $render_message;
        }

        foreach ($admin_un_read_message as $admin_message){
            $is_admin = true;
            $render_message =  view('brands.pages.message.header_message',compact('admin_message','is_admin'))->render();
            $messages .= $render_message;
        }

        return response()->json([
            'status' => true,
            'messages' => $messages
        ]);
    }
    public function user_unread_notifications()
    {
        $notifications = Notification::where('user_id',auth()->user()->id)
            ->where('is_read',Notification::UN_READ)
            ->orderBy('id', 'DESC')
            ->get();

        $html = '';
        foreach ($notifications as $notification ) {
            $message = str_replace('%CREATE_TIME%',$notification->created_at->diffForHumans(),$notification->message);
            $html .= $message;
        }

        return response()->json([
            'status' => true,
            'notifications' => $notifications->count(),
            'notifications_html' => $html
        ]);
    }
    public function read_all_notifications()
    {
        Notification::where('user_id',auth()->user()->id)
            ->where('is_read',Notification::UN_READ)
            ->update([
               'is_read' => Notification::READ
            ]);

        return response()->json([
            'status' => true,
        ]);
    }
}
