<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
        $this->middleware('guest:admin')->except('logout');
    }

    protected function authenticated(Request $request, $user){

        if ($user->is_locked == User::LOCKED){
            Auth::logout();
            return redirect('login')->with('danger','your Account is locked from admin,please contact support');
        }

        if($user->is_active == User::ACTIVE){

            $user->update([
               'is_login' => User::LOGIN
            ]);

            if ( $user->role == User::BRAND){
                return redirect()->route('brandDashboard') ;
            }elseif ($user->role == User::CREATOR ){
                return redirect()->route('creatorDashboard') ;
            }
        }else{
            Auth::logout();
            return redirect('login')->with('danger','Account is not activated,wait for admin approval');
        }
    }

    public function logout(Request $request)
    {
        \auth()->user()->update([
            'is_login' => User::LOGOUT
        ]);
        $this->guard()->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($response = $this->loggedOut($request)) {
            return $response;
        }

        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect('/');
    }

    public function showLoginForm()
    {
        $setting = Setting::first();
        return view('auth.login',compact('setting'));
    }

}
