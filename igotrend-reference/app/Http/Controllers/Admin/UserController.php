<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CreatorApprove;
use App\Mail\CreatorRejection;
use App\Models\CompanyType;
use App\Models\ContentCategory;
use App\Models\Country;
use App\Models\CreatorCategory;
use App\Models\State;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $active_users = User::where('is_active',User::ACTIVE)->count();
        $pending_users = User::where('is_active',User::IN_ACTIVE)->count();
        $locked_users = User::where('is_locked',User::LOCKED)->count();
        return view('admin.pages.user.index',compact('active_users','pending_users','locked_users'));
    }

    public function brandUsers(Request  $request)
    {
        if($request->ajax()){
            $users = User::with('country','state','companyType')
                ->where('role',User::BRAND)
                ->orderBy('id', 'DESC');
            return DataTables::of($users)
                ->addColumn('actions', function ($user){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('change status')) {
                        if ($user->is_active == User::ACTIVE) {
                            $html .= '<a href="' . route("user-active", $user) . '" class="btn btn-success btn-sm" data-toggle="tooltip" data-placement="top" title="pending user">
                                <i class="fa fa-user-slash"></i>
                            </a>';
                        } else {
                            $html .= '<a href="' . route("user-active", $user) . '" class="btn btn-accent btn-sm" data-toggle="tooltip" data-placement="top" title="active user">
                                <i class="fa fa-user-check"></i>
                            </a>';
                        }
                    }
                    if (auth()->guard('admin')->user()->can('change locked status')) {
                        if ($user->is_locked == User::UN_LOCKED){
                            $html .= '<a href="'.route("user-lock",$user).'" class="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top" title="lock user">
                                <i class="fa fa-lock"></i>
                            </a>';
                        }else {
                            $html .= '<a href="'.route("user-lock",$user).'" class="btn btn-primary btn-sm" data-toggle="tooltip" data-placement="top" title="un lock user">
                                <i class="fa fa-lock-open"></i>
                            </a>';
                        }
                    }

                    if (auth()->guard('admin')->user()->can('edit user info')) {

                        $html .= '<a href="'.route("userAccountInfo",$user).'" class="btn btn-primary-purple btn-sm" data-toggle="tooltip" data-placement="top" title="edit user">
                                <i class="fa fa-edit"></i>
                            </a>';
                    }


                    if (auth()->guard('admin')->user()->can('delete user')) {

                        $html .= '<a href="'.route("user-delete",$user).'" class="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top" title="delete user">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }

                    return $html .'</div>';
                })
                ->addColumn('status', function ($user){
                    $html = '';
                    if ($user->is_active == User::ACTIVE){
                        $html .= '<span class="badge  badge-success">Active</span> &nbsp;';
                    }else{
                        $html .= '<span class="badge  badge-accent">Pending</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('locked_status', function ($user){
                    $html = '';
                    if ($user->is_locked == User::LOCKED){
                        $html .= '<span class="badge  badge-danger">Locked</span> &nbsp;';
                    }else{
                        $html .= '<span class="badge  badge-primary">Un-Locked</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('country_name', function ($user){
                    $html = '';
                    if ($user->country ){
                        $html .= $user->country->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('state_name', function ($user){
                    $html = '';
                    if ($user->state ){
                        $html .= $user->state->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('photo', function ($user){
                    return '<img width="32" height="32" class="rounded-circle mr-8pt" src="'.get_user_image($user->id).'" />';
                })
                ->addColumn('company_type_name', function ($user){
                    $html = '';
                    if ($user->companyType ){
                        $html .= $user->companyType->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->editColumn('created_at', function ($user){
                    return Carbon::parse($user->created_at)->toDateString();
                })
                ->editColumn('role', function ($user){
                    $html = '';
                    if ($user->role == User::BRAND ){
                        $html .= 'Brand';
                    }else{
                        $html .= 'Creator';
                    }
                    return $html;
                })
                ->editColumn('gender', function ($user){
                    $html = '';
                    if ($user->gender == User::MALE ){
                        $html .= 'Male';
                    }else{
                        $html .= 'FeMale';
                    }
                    return $html;
                })
                ->rawColumns(['actions','status','country_name','state_name','role','gender','company_type_name','photo','locked_status'])
                ->make(true);
        }
    }

    public function creatorUsers(Request  $request){
        if($request->ajax()){
            $users = User::with('country','state')->where('role',User::CREATOR)
                ->orderBy('id', 'DESC');
            return DataTables::of($users)
                ->addColumn('actions', function ($user){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('change status')) {
                        if ($user->is_active == User::ACTIVE) {
                            $html .= '<a href="' . route("user-active", $user) . '" class="btn btn-success btn-sm" data-toggle="tooltip" data-placement="top" title="pending user">
                                <i class="fa fa-user-slash"></i>
                            </a>';
                        } else {
                            $html .= '<a href="' . route("user-active", $user) . '" class="btn btn-accent btn-sm" data-toggle="tooltip" data-placement="top" title="active user">
                                <i class="fa fa-user-check"></i>
                            </a>';
                        }
                    }
                    if (auth()->guard('admin')->user()->can('change locked status')) {
                        if ($user->is_locked == User::UN_LOCKED){
                            $html .= '<a href="'.route("user-lock",$user).'" class="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top" title="lock user">
                                <i class="fa fa-lock"></i>
                            </a>';
                        }else {
                            $html .= '<a href="'.route("user-lock",$user).'" class="btn btn-primary btn-sm" data-toggle="tooltip" data-placement="top" title="un lock user">
                                <i class="fa fa-lock-open"></i>
                            </a>';
                        }
                    }

                    if (auth()->guard('admin')->user()->can('edit user info')) {

                        $html .= '<a href="'.route("userAccountInfo",$user).'" class="btn btn-primary-purple btn-sm" data-toggle="tooltip" data-placement="top" title="edit user">
                                <i class="fa fa-edit"></i>
                            </a>';
                    }


                    if (auth()->guard('admin')->user()->can('delete user')) {

                        $html .= '<a href="'.route("user-delete",$user).'" class="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top" title="delete user">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }
                    $html .= '<a href="#" class="btn btn-secondary btn-sm user_update_info" data-url="'.route('userInfoForm',$user).'" data-toggle="tooltip" data-placement="top" title="update user info">
                                <i class="fa fa-address-card"></i>
                            </a>';
                    return $html .'</div>';
                })
                ->addColumn('content_categories_name', function ($user){
                    $categories = ContentCategory::whereIn('id',explode(',',$user->content_category))->pluck('name')->toArray();
                    return implode(',',$categories);
                })
                ->addColumn('creator_categories_name', function ($user){
                    $categories = CreatorCategory::whereIn('id',explode(',',$user->creator_category))->pluck('name')->toArray();
                    return implode(',',$categories);
                })
                ->addColumn('status', function ($user){
                    $html = '';
                    if ($user->is_active == User::ACTIVE){
                        $html .= '<span class="badge  badge-success">Active</span> &nbsp;';
                    }else{
                        $html .= '<span class="badge  badge-accent">Pending</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('locked_status', function ($user){
                    $html = '';
                    if ($user->is_locked == User::LOCKED){
                        $html .= '<span class="badge  badge-danger">Locked</span> &nbsp;';
                    }else{
                        $html .= '<span class="badge  badge-primary">Un-Locked</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('country_name', function ($user){
                    $html = '';
                    if ($user->country ){
                        $html .= $user->country->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('state_name', function ($user){
                    $html = '';
                    if ($user->state ){
                        $html .= $user->state->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('photo', function ($user){
                    return '<img width="32" height="32" class="rounded-circle mr-8pt" src="'.get_user_image($user->id).'" />';
                })
                ->editColumn('created_at', function ($user){
                    return Carbon::parse($user->created_at)->toDateString();
                })
                ->editColumn('role', function ($user){
                    $html = '';
                    if ($user->role == User::BRAND ){
                        $html .= 'Brand';
                    }else{
                        if (is_null($user->creator_category)){
                            $html .= 'Influencer';
                        }else{
                            $html .= 'Creator';
                        }
                    }
                    return $html;
                })
                ->editColumn('gender', function ($user){
                    $html = '';
                    if ($user->gender == User::MALE ){
                        $html .= 'Male';
                    }else{
                        $html .= 'FeMale';
                    }
                    return $html;
                })
                ->editColumn('facebook_profile', function ($user){
                    $html = '';
                    if ($user->facebook_profile){
                        $html .= '<a href="#" class="facebook_profile" data-update-url="'.route('facebookInfo',$user).'" data-url="'.route('userSocialInfo',$user).'">'.$user->facebook_profile.'</a>';
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span>';
                    }
                    return $html;
                })
                ->editColumn('instagram_profile', function ($user){
                    return  '<a href="#" class="instagram_profile" data-update-url="'.route('instagramInfo',$user).'" data-url="'.route('userSocialInfo',$user).'">'.$user->instagram_profile.'</a>';
                })
                ->editColumn('snapchat_profile', function ($user){
                    $html = '';
                    if ($user->snapchat_profile){
                        $html .= '<a href="#" class="snapchat_profile" data-update-url="'.route('snapchatInfo',$user).'" data-url="'.route('userSocialInfo',$user).'">'.$user->snapchat_profile.'</a>';
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span>';
                    }
                    return $html;
                })
                ->editColumn('twitter_profile', function ($user){
                    $html = '';
                    if ($user->facebook_profile){
                        $html .= '<a href="#" class="twitter_profile"  data-update-url="'.route('twitterInfo',$user).'" data-url="'.route('userSocialInfo',$user).'">'.$user->twitter_profile.'</a>';
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span>';
                    }
                    return $html;
                })
                ->editColumn('youtube_profile', function ($user){
                    $html = '';
                    if ($user->youtube_profile){
                        $html .= '<a href="#" class="youtube_profile" data-update-url="'.route('youtubeInfo',$user).'" data-url="'.route('userSocialInfo',$user).'" >'.$user->youtube_profile.'</a>';
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span>';
                    }
                    return $html;
                })
                ->editColumn('tiktok_profile', function ($user){
                    $html = '';
                    if ($user->tiktok_profile){
                        $html .= '<a href="#" class="tiktok_profile" data-update-url="'.route('tiktokInfo',$user).'" data-url="'.route('userSocialInfo',$user).'" >'.$user->tiktok_profile.'</a>';
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span>';
                    }
                    return $html;
                })
                ->rawColumns(['actions','status','country_name','state_name','role','gender','photo','tiktok_profile','youtube_profile','twitter_profile','facebook_profile','instagram_profile','snapchat_profile','locked_status'])
                ->make(true);
        }
    }

    public function trashedUsers(Request  $request)
    {
        if($request->ajax()){
            $users = User::onlyTrashed()
                ->orderBy('id', 'DESC');

            return DataTables::of($users)
                ->addColumn('actions', function ($user){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('restore user')){
                        $html .= '<a href="'.route("user-restore",$user->id).'" class="btn btn-primary btn-sm" data-toggle="tooltip" data-placement="top" title="restore user">
                                <i class="fa fa-trash-restore"></i>
                            </a>';

                    }
                    return $html .'</div>';
                })
                ->addColumn('status', function ($user){
                    $html = '';
                    if ($user->is_active == User::ACTIVE){
                        $html .= '<span class="badge  badge-success">Active</span> &nbsp;';
                    }else{
                        $html .= '<span class="badge  badge-accent">Pending</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('locked_status', function ($user){
                    $html = '';
                    if ($user->is_locked == User::LOCKED){
                        $html .= '<span class="badge  badge-danger">Locked</span> &nbsp;';
                    }else{
                        $html .= '<span class="badge  badge-primary">Un-Locked</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('country_name', function ($user){
                    $html = '';
                    if ($user->country ){
                        $html .= $user->country->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->addColumn('state_name', function ($user){
                    $html = '';
                    if ($user->state ){
                        $html .= $user->state->name;
                    }else{
                        $html .= '<span class="badge  badge-primary">none</span> &nbsp;';
                    }
                    return $html;
                })
                ->editColumn('role', function ($user){
                    $html = '';
                    if ($user->role == User::BRAND ){
                        $html .= 'Brand';
                    }else{
                        $html .= 'Creator';
                    }
                    return $html;
                })
                ->rawColumns(['actions','status','country_name','state_name','role'])
                ->make(true);
        }
    }

    public function changeActiveStatus(User  $user)
    {
        if ($user->is_active == User::IN_ACTIVE){
            if ($user->role == User::CREATOR){
                $custom_url = route('summary',$user);
                Mail::to($user->email)->send(new CreatorApprove($user->user_name,$custom_url,$user->pin));
            }
            $user->update([
                'is_active' => User::ACTIVE
            ]);
            $message = 'User Active Successfully';
        }else{
            if ($user->role == User::CREATOR){
                Mail::to($user->email)->send(new CreatorRejection($user->user_name));
            }
            $user->update([
                'is_active' => User::IN_ACTIVE
            ]);
            $message = 'User In Active Successfully';
        }
        return redirect()->back()->with('success',$message);
    }

    public function changeLockedStatus(User  $user)
    {
        if ($user->is_locked == User::UN_LOCKED){
            $user->update([
                'is_locked' => User::LOCKED
            ]);
            $message = 'User Locked Successfully';
        }else{
            $user->update([
                'is_locked' => User::UN_LOCKED
            ]);
            $message = 'User Un Locked Successfully';
        }
        return redirect()->back()->with('success',$message);
    }

    public function userDelete(User  $user)
    {
        User::destroy($user->id);
        return redirect()->back()->with('success','User Deleted Successfully');
    }

    public function userRestore($user)
    {
        User::withTrashed()->find($user)->restore();
        return redirect()->back()->with('success','User Restore Successfully');
    }

    public function userAccountInfo(User $user)
    {
        if ($user->role == User::BRAND){
            $company_types = CompanyType::all();
            $countries = Country::all();
            $states = State::where('country_id',$user->country_id)->get();
            return view('admin.pages.user.brand_user_info',compact('company_types','countries','states','user'));
        }else{
            $countries = Country::all();
            $states = State::where('country_id',$user->country_id)->get();
            return view('admin.pages.user.creator_user_info',compact('countries','states','user'));
        }

    }

    public function userSocialProfile(User $user)
    {
        $content_categories = ContentCategory::all();
        $creator_categories = CreatorCategory::all();
        return view('admin.pages.user.creator_user_social',compact('content_categories','creator_categories','user'));
    }

    public function userSocialProfileUpdate(Request $request,User $user)
    {
        $request->validate([
            'content_category' => 'required',
            'instagram_profile' => 'required|max:50',
            'facebook_profile' => 'nullable|max:50',
            'twitter_profile' => 'nullable|max:50',
            'tiktok_profile' => 'nullable|max:50',
            'snapchat_profile' => 'nullable|max:50',
            'youtube_profile' => 'nullable|max:50',
            'user_name' => ['required', 'string', Rule::unique('users', 'user_name')->ignore($user->id)],
        ]);

        $user->update([
            'content_category' => isset($request->content_category) ? implode(',',$request->content_category) : null,
            'creator_category' => isset($request->creator_category) ? implode(',',$request->creator_category) : null,
            'user_name' => $request->user_name,
            'instagram_profile' => $request->instagram_profile,
            'facebook_profile' => $request->facebook_profile,
            'tiktok_profile' => $request->tiktok_profile,
            'snapchat_profile' =>$request->snapchat_profile,
            'youtube_profile' => $request->youtube_profile,
            'twitter_profile' => $request->twitter_profile,
        ]);
        return redirect()->back()->with('success','Social Profile updated successfully');
    }

    public function userAccountPassword(User $user)
    {
        if ($user->role == User::BRAND){
            return view('admin.pages.user.brand_password',compact('user'));
        }else{
            return view('admin.pages.user.creator_password',compact('user'));
        }

    }

    public function userUpdatePassword(Request $request,User $user)
    {
        $rules = array(
            'password' => 'required|string|confirmed',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }
        $user->update([
            'password' => Hash::make( $request->password ),
        ]);
        return redirect()->back()->with('success','Password updated successfully');
    }

    public function userPasswordUpdate(Request  $request,User $user)
    {
        $rules = array(
            'password' => 'required|string|confirmed',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }else{
            $user->update([
                'password' => Hash::make( $request->password ),
            ]);
            return redirect()->back()->with('success','Password updated successfully');
        }
    }

    public function userUpdateInfo(Request  $request,User $user)
    {
        if ($user->role == User::BRAND){
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'company_name' => 'required|string|max:100',
                'email' => ['required', 'string','email','max:50', Rule::unique('users', 'email')->ignore($user->id)],
                'phone' => ['required', 'string','max:30', Rule::unique('users', 'phone')->ignore($user->id)],
                'gender' => 'required',
                'company_size' => 'required',
                'company_type' => 'required',
                'country' => 'required',
                'state' => 'required',
                'profile_image' => 'sometimes|image|mimes:jpeg,jpg,png',
            ]);
            $user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'company_name' => $request->company_name,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'company_size' => $request->company_size,
                'company_type' => $request->company_type,
                'country_id' => $request->country,
                'state_id' => $request->state,
            ]);
        }else{
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => ['required', 'string','max:30', Rule::unique('users', 'email')->ignore($user->id)],
                'phone' => ['required', 'string','max:30', Rule::unique('users', 'phone')->ignore($user->id)],
                'gender' => 'required',
                'dob' => 'required',
                'country' => 'required',
                'state' => 'required',
                'profile_image' => 'sometimes|image|mimes:jpeg,jpg,png',
            ]);

            $user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'dob' => $request->dob,
                'country_id' => $request->country,
                'state_id' => $request->state,
            ]);

        }


        if ($request->file('profile_image')){
            $media = $user->getMedia('user-profile-image');
            if (!$media->isEmpty()){
                $media->first()->delete();
                $user->addMedia($request->file('profile_image'))
                    ->toMediaCollection('user-profile-image');
            }else{
                $user->addMedia($request->file('profile_image'))->toMediaCollection('user-profile-image');
            }
        }
        return redirect()->back()->with('success','Brand info added successfully');
    }

    public function userInfoForm(User $user)
    {
        $body = view('admin.pages.user.update_user_info',compact('user'))->render();
        return response()->json([
            'body' => $body
        ]);
    }

    public function userInfo(Request $request,User $user)
    {
        $user->update([
            'badge' => $request->badge
        ]);
        return redirect()->back()->with('success','User info updated successfully');
    }

    public function userSocialInfo(User $user)
    {
        return response()->json([
            'user' => $user
        ]);
    }

    public function facebookInfo(Request $request,User $user)
    {
        $user->update([
            'facebook_followers' => $request->facebook_followers,
            'facebook_post' => $request->facebook_post,
            'facebook_story' => $request->facebook_story,
            'facebook_friends' => $request->facebook_friends,
            'facebook_like_percentage' => $request->facebook_like_percentage,
        ]);
        return redirect()->back()->with('success','User facebook info updated successfully');
    }

    public function instagramInfo(Request $request,User $user)
    {
        $user->update([
            'instagram_followers' => $request->instagram_followers,
            'instagram_post' => $request->instagram_post,
            'instagram_story' => $request->instagram_story,
            'instagram_friends' => $request->instagram_friends,
            'instagram_like_percentage' => $request->instagram_like_percentage,
        ]);
        return redirect()->back()->with('success','User instagram info updated successfully');
    }

    public function snapchatInfo(Request $request,User $user)
    {
        $user->update([
            'snapchat_followers' => $request->snapchat_followers,
            'snapchat_post' => $request->snapchat_post,
            'snapchat_story' => $request->snapchat_story,
            'snapchat_friends' => $request->snapchat_friends,
            'snapchat_like_percentage' => $request->snapchat_like_percentage,
        ]);
        return redirect()->back()->with('success','User snapchat info updated successfully');
    }

    public function twitterInfo(Request $request,User $user)
    {
        $user->update([
            'twitter_followers' => $request->twitter_followers,
            'twitter_post' => $request->twitter_post,
            'twitter_friends' => $request->twitter_friends,
            'twitter_like_percentage' => $request->twitter_like_percentage,
        ]);
        return redirect()->back()->with('success','User twitter info updated successfully');
    }

    public function youtubeInfo(Request $request,User $user)
    {
        $user->update([
            'youtube_followers' => $request->youtube_followers,
            'youtube_post' => $request->youtube_post,
            'youtube_friends' => $request->youtube_friends,
            'youtube_like_percentage' => $request->youtube_like_percentage,
        ]);
        return redirect()->back()->with('success','User youtube info updated successfully');
    }

    public function tiktokInfo(Request $request,User $user)
    {
        $user->update([
            'tiktok_followers' => $request->tiktok_followers,
            'tiktok_post' => $request->tiktok_post,
            'tiktok_friends' => $request->tiktok_friends,
            'tiktok_like_percentage' => $request->tiktok_like_percentage,
        ]);
        return redirect()->back()->with('success','User tiktok info updated successfully');
    }
}
