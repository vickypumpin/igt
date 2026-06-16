<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    public function edit_account()
    {
        return view('admin.pages.account.edit_account');
    }

    public function account_update_info(Request  $request,Admin $admin)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string','max:255', Rule::unique('admins', 'email')->ignore($admin->id)],
            'profile_image' => 'sometimes|image|mimes:jpeg,jpg,png',
            'phone_no' => 'sometimes|max:20',
        ]);

        $admin->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone_no' => $request->phone_no,
            'gender' => $request->gender,
        ]);

        if ($request->file('profile_image')){
            $media = $admin->getMedia('admin-profile-image');
            if (!$media->isEmpty()){
                $media->first()->delete();
                $admin->addMedia($request->file('profile_image'))
                    ->toMediaCollection('admin-profile-image');
            }else{
                $admin->addMedia($request->file('profile_image'))->toMediaCollection('admin-profile-image');
            }
        }
        return redirect()->back()->with('success','Account info added successfully');
    }

    public function edit_password()
    {
        return view('admin.pages.account.edit_password');
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
        $hashedPassword = auth()->guard('admin')->user()->password;

        if (\Hash::check($request->current_password,$hashedPassword)) {
            if (\Hash::check($request->password,$hashedPassword)) {
                return redirect()->back()->with('danger','new password can not be the old password');
            } else{
                $admin = Admin::find(auth()->guard('admin')->user()->id);
                $admin->update([
                    'password' => Hash::make( $request->password ),
                ]);
                return redirect()->back()->with('success','Password updated successfully');
            }
        } else{
            return redirect()->back()->with('danger','old password doesnt matched');
        }
    }
}
