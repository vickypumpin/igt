<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
        $this->middleware('guest:admin')->except('logout');
    }

    public function index()
    {
        return view('admin.auth.login');
    }

    public function login(Request $request)
    {
        $this->validator($request);
        if (Auth::guard('admin')->attempt($request->only('email','password'))) {
            Auth::guard('admin')->user()->update([
                'is_login' => Admin::LOGIN
            ]);
            return redirect()
                ->intended(route('adminDashboard'))
                ->with('status','You are Logged in as Admin!');
        }else {
            return $this->loginFailed();
        }
    }

    private function validator(Request $request){
        //validation rules.
        $rules = [
            'email'    => 'required|email|exists:admins|max:191',
            'password' => 'required|string|max:255',
        ];
        //custom validation error messages.
        $messages = [
            'email.exists' => 'These credentials do not match our records.',
        ];
        //validate the request.
        $request->validate($rules,$messages);
    }

    private function loginFailed(){
        return redirect()
            ->back()
            ->withInput()
            ->with('error','Login failed, please try again!');
    }


    public function logout()
    {
        Auth::guard('admin')->user()->update([
            'is_login' => Admin::LOGOUT
        ]);
        Auth::guard('admin')->logout();
        return redirect()
            ->route('adminLogin');
    }
}
