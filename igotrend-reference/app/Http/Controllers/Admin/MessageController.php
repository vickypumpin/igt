<?php

namespace App\Http\Controllers\Admin;

use App\Events\BrandInfluencerMessage;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\AdminMessage;
use App\Models\Campaign;
use App\Models\CampaignInvite;
use App\Models\User;
use App\Models\UserMessage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $campaign_id = $request->campaign_id ?? null;
        $advertisers_ids = User::orderBy('id','desc')
            ->whereNotNull('email_verified_at')
            ->pluck('id');
        if ( $request->campaign_id){
            $advertisers_ids = Campaign::where('id',$request->campaign_id)
                ->pluck('user_id');
        }
        $advertisers = User::whereIn('id',$advertisers_ids)
            ->get();
        $campaigns = Campaign::where('status',Campaign::ACTIVE)
            ->orderBy('id', 'DESC')
            ->get();

        return view('admin.pages.message.index',compact(
            'campaigns',
            'campaign_id',
            'advertisers',
            'advertisers_ids'
        ));
    }
    public function chatIndex(User $receiver,Request $request)
    {
        $count_admin_un_read_message = AdminMessage::where('from_user',$receiver->id)
            ->where('to_user',auth()->guard('admin')->user()->id)
            ->where('is_read',0)
            ->count();


        if ($count_admin_un_read_message > 0){
            AdminMessage::where('from_user',$receiver->id)
                ->where('to_user',auth()->guard('admin')->user()->id)
                ->where('is_read',0)
                ->update([
                    'is_read' => 1
                ]);
        }
        $campaign_id = $request->campaign_id ?? null;
        $advertisers_ids = User::orderBy('id','desc')
            ->whereNotNull('email_verified_at')
            ->pluck('id');
        if ( $request->campaign_id){
            $advertisers_ids = Campaign::where('id',$request->campaign_id)
                ->pluck('user_id');
        }
        $advertisers = User::whereIn('id',$advertisers_ids)
            ->get();
        $campaigns = Campaign::where('status',Campaign::ACTIVE)
            ->orderBy('id', 'DESC')
            ->get();

        $messages = AdminMessage::where(function($query) use ($receiver, $request) {
            $query->where('from_user', auth()->guard('admin')->user()->id)->where('to_user', $receiver->id);
        })->orWhere(function ($query) use ($receiver, $request) {
            $query->where('from_user', $receiver->id)->where('to_user', auth()->guard('admin')->user()->id);
        })->orderBy('created_at', 'asc')
            ->get();

        foreach ($advertisers_ids as $key => $value) {
            if ($value == $receiver->id){
                unset($advertisers_ids[$key]);
            }
        }

        return view('admin.pages.message.userChat',compact('campaigns',
            'campaign_id',
            'advertisers',
            'receiver',
            'messages',
            'advertisers_ids',
        ));
    }
    public function send_msg(Request $request)
    {
        $message =  AdminMessage::create([
            'message' => $request->comment,
            'from_user' => $request->from_user,
            'to_user' => $request->to_user,
            'admin' => 'from_user',
        ]);
        $message_html = view('admin.pages.message.message-line',compact('message'))->render();
        $sender_img_path = get_admin_image($message->from_user);
        $date = \Carbon\Carbon::parse($message->created_at)->format('d-m-y h:i A');
        broadcast(new BrandInfluencerMessage($message->to_user,$sender_img_path,$message->message,$date));
        return response()->json([
            'status' => true,
            'message_html' => $message_html,
        ]);
    }

    public function get_unread_messages(Request $request)
    {
        $data  = [];
        foreach (explode(',',$request->advertiser_ids) as $advertiser){
            $count_un_read_message =   AdminMessage::where('from_user',$advertiser)
                ->where('to_user',auth()->guard('admin')->user()->id)
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
    public function get_all_unread_messages()
    {
        $advertisers_ids = User::orderBy('id','desc')
            ->whereNotNull('email_verified_at')
            ->pluck('id');

        $count_un_read_message =   AdminMessage::whereIn('from_user',$advertisers_ids)
            ->where('to_user',auth()->guard('admin')->user()->id)
            ->where('is_read',0)
            ->count();
        return response()->json([
            'status' => true,
            'count_message' => $count_un_read_message
        ]);
    }

    public function get_user_unread_messages()
    {
        $advertisers_ids = User::orderBy('id','desc')
            ->whereNotNull('email_verified_at')
            ->pluck('id');

        $un_read_message =   AdminMessage::whereIn('from_user',$advertisers_ids)
            ->where('to_user',auth()->guard('admin')->user()->id)
            ->where('is_read',0)
            ->get();

        $messages = null;
        foreach ($un_read_message as $message){
            $render_message =  view('admin.pages.message.header_message',compact('message'))->render();
            $messages .= $render_message;
        }

        return response()->json([
            'status' => true,
            'messages' => $messages
        ]);
    }

    public function chat_logs()
    {
        $users = User::orderBY('id','desc')
            ->whereNotNull('email_verified_at')
            ->where('is_active',User::ACTIVE)
            ->get();
        $from_users = AdminMessage::pluck('from_user','admin');
        $to_users = AdminMessage::pluck('to_user','admin');
        $from_users_array = collect();
        $to_users_array = collect();
        foreach ($from_users as $key => $value){
            if ($key == "from_user"){
                 $admin  = Admin::where('id',$value)->first();
                $from_users_array->push([
                    'id' => $admin->id,
                    'name' => ucwords($admin->name)
                ]);
            }else{
                $user  = User::where('id',$value)->first();
                $from_users_array->push([
                    'id' => $user->id,
                    'name' => ucwords($user->first_name.' '.$user->last_name)
                ]);
            }
        }
        foreach ($to_users as $key => $value){
            if ($key == "to_user"){
                $admin  = Admin::where('id',$value)->first();
                $to_users_array->push([
                    'id' => $admin->id,
                    'name' => ucwords($admin->name)
                ]);
            }else{
                $user  = User::where('id',$value)->first();
                $to_users_array->push([
                    'id' => $user->id,
                    'name' => ucwords($user->first_name.' '.$user->last_name)
                ]);
            }
        }
        return view('admin.pages.message.chat_logs',compact('users','to_users_array','from_users_array'));
    }

    public function get_user_messages(Request $request)
    {
        if($request->ajax()){
            $messages = UserMessage::with('from','to')
                ->orderBy('user_messages.id', 'DESC');

            if ($request->from){
                $messages->where('from_user',$request->from);
            }

            if ($request->to){
                $messages->where('to_user',$request->to);
            }

            return DataTables::of($messages)
                ->addColumn('from', function ($message){
                    return   ucwords($message->from->first_name).' '.ucwords($message->from->last_name);
                })
                ->addColumn('to', function ($message){
                    return   ucwords($message->to->first_name).' '.ucwords($message->to->last_name);
                })
                ->editColumn('message', function ($message){
                    return Str::limit($message->message,75);
                })
                ->make(true);
        }
    }

    public function get_admin_users_messages(Request $request)
    {
        if($request->ajax()){
            $messages = AdminMessage::orderBy('id', 'DESC');

            if ($request->from){
                $messages->where('from_user',$request->from);
            }

            if ($request->to){
                $messages->where('to_user',$request->to);
            }
            return DataTables::of($messages)
                ->addColumn('from', function ($message){
                    if ($message->admin == "from_user"){
                        $message->load('admin_from');
                        return   ucwords($message->admin_from->name);
                    }else{
                        $message->load('user_from');
                        return   ucwords($message->user_from->first_name).' '.ucwords($message->user_from->last_name);
                    }
                })
                ->addColumn('to', function ($message){
                    if ($message->admin == "to_user"){
                        $message->load('admin_to');
                        return   ucwords($message->admin_to->name);
                    }else{
                        $message->load('user_to');
                        return   ucwords($message->user_to->first_name).' '.ucwords($message->user_to->last_name);
                    }
                })
                ->editColumn('message', function ($message){
                    return Str::limit($message->message,75);
                })
                ->make(true);
        }
    }

    public function explore_chat(Request $request)
    {
        $from = (int)$request->from;
        $to = (int)$request->to;

        $messages = UserMessage::where(function($query) use ($from,$to, $request) {
            $query->where('from_user', $from)->where('to_user',$to);
        })->orWhere(function ($query) use ($to, $from, $request) {
            $query->where('from_user', $to)->where('to_user',$from);
        })->orderBy('created_at','asc')->get();


        return view('admin.pages.message.explore_chat',compact('messages','from'));
    }
}
