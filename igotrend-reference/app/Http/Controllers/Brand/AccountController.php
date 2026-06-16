<?php

namespace App\Http\Controllers\Brand;

use App\Http\Controllers\Controller;
use App\Mail\UpdatePassword;
use App\Models\Admin;
use App\Models\CompanyType;
use App\Models\Country;
use App\Models\CreatorCategory;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    public function edit_account()
    {
        $company_types = CompanyType::all();
        $countries = Country::all();
        $states = State::where('country_id',auth()->user()->country_id)->get();
        return view('brands.pages.account.edit_account',compact('company_types','countries','states'));
    }
    public function account_update_info(Request  $request,User $user)
    {
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
        return view('brands.pages.account.edit_password');
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
            if (\Hash::check($request->password, $hashedPassword)) {
                return redirect()->back()->with('danger','new password can not be the old password');
            } else {
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
}
