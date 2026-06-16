<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Mail\UpdatePassword;
use App\Models\BankName;
use App\Models\ContentCategory;
use App\Models\Country;
use App\Models\CreatorCategory;
use App\Models\State;
use App\Models\User;
use App\Models\UserAccountInfoRequest;
use App\Models\UserPaymentInfoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use KingFlamez\Rave\Facades\Rave as Flutterwave;

class AccountController extends Controller
{
    public function edit_account()
    {
        $countries = Country::all();
        $states = State::where('country_id',auth()->user()->country_id)->get();
        return view('creators.pages.account.edit_account',compact('countries','states'));
    }
    public function account_update_info(Request  $request,User $user)
    {
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
        return redirect()->back()->with('success','Account info added successfully');
    }
    public function edit_password()
    {
        return view('creators.pages.account.edit_password');
    }
    public function account_update_password(Request  $request)
    {
        $rules = array(
            'current_password' => 'required',
            'password' => 'required|string|confirmed',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }
        $hashedPassword = auth()->user()->password;
        if (\Hash::check($request->current_password , $hashedPassword)) {
            if (\Hash::check($request->password , $hashedPassword)) {
                return redirect()->back()->with('danger','new password can not be the old password');
            } else{
                $user= User::find(auth()->user()->id);
                $user->update([
                    'password' => Hash::make( $request->password ),
                ]);
                $ip_address = $request->ip();
                try {
                    Mail::to($user->email)->send(new UpdatePassword(auth()->user()->user_name,auth()->user()->email,$ip_address,auth()->user()->pin));
                }catch (\Exception $e){

                }
                return redirect()->back()->with('success','Password updated successfully');
            }
        } else{
            return redirect()->back()->with('danger','old password doesnt matched');
        }
    }
    public function getCountriesStates(Request  $request)
    {
        $states = State::where('country_id',$request->country)
            ->select('id','name')
            ->get();

        if (!is_null($states)) {
            return response()->json([
                'status' => 'true',
                'states' => $states
            ]);
        } else {
            return response()->json([
                'status' => 'false',
                'error' => 'No states found.'
            ]);
        }
    }
    public function edit_social_profile()
    {
        $content_categories = ContentCategory::all();
        $creator_categories = CreatorCategory::all();
        return view('creators.pages.account.edit_social_profile',compact('content_categories','creator_categories'));
    }
    public function update_social_profile(Request  $request){
        $user= User::find(auth()->user()->id);
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
//            'user_name' => $request->user_name,
//            'instagram_profile' => $request->instagram_profile,
//            'facebook_profile' => $request->facebook_profile,
//            'tiktok_profile' => $request->tiktok_profile,
//            'snapchat_profile' =>$request->snapchat_profile,
//            'youtube_profile' => $request->youtube_profile,
//            'twitter_profile' => $request->twitter_profile
        ]);


        UserAccountInfoRequest::create([
            'user_id' => Auth::user()->id ,
            'user_name' => $request->user_name,
            'instagram_profile' => $request->instagram_profile,
            'facebook_profile' => $request->facebook_profile,
            'tiktok_profile' => $request->tiktok_profile,
            'snapchat_profile' =>$request->snapchat_profile,
            'youtube_profile' => $request->youtube_profile,
            'twitter_profile' => $request->twitter_profile
        ]);

        $user->update([
            'is_account_info_locked' => User::ACCOUNT_INFO_LOCKED,
        ]);
        return redirect()->back()->with('warning','Please Wait for Admin Approval');
    }

    public function billing()
    {
        $banks = BankName::all();

        return view('creators.pages.account.billing',compact('banks'));
    }

    public function update_payment_information(Request $request)
    {

        $user = Auth::user();
        $bank = BankName::where('code',$request->bank_name)->first();

        UserPaymentInfoRequest::create([
            'user_id' => Auth::user()->id ,
            'bank_id' => $bank->id ,
            'account_number' => $request->account_number ,
        ]);

        $user->update([
            'is_payment_info_locked' => User::PAYMENT_INFO_LOCKED,
        ]);

        return redirect()->back()->with('warning','Please Wait for Admin Approval');
    }

    public function rate_info()
    {
        return view('creators.pages.account.rate_info');
    }
}
