<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\CompanyType;
use App\Models\ContentCategory;
use App\Models\Country;
use App\Models\CreatorCategory;
use App\Models\Setting;
use App\Models\State;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
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
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        $role = $data['role'];
        if ($role == "3"){
            $role = "2";
        }
        $user =  User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone' => $data['phone'],
            'country_id' => $data['country'],
            'state_id' => $data['state'],
            'role' => $role,
            'gender' => $data['gender'],
            'user_name' => Str::slug($data['user_name']),
            'password' => Hash::make($data['password']),
            'company_name' => $data['company_name'],
            'company_size' => $data['company_size'],
            'company_type' => $data['company_type'],
            'dob' => $data['dob'],
            'content_category' => isset($data['content_category']) ? implode(',',$data['content_category']) : null,
            'creator_category' => isset($data['creator_category']) ? $data['creator_category'] : null,
            'email' => $data['email'],
            'instagram_profile' => $data['instagram_profile'],
            'facebook_profile' => $data['facebook_profile'],
            'tiktok_profile' => $data['tiktok_profile'],
            'snapchat_profile' => $data['snapchat_profile'],
            'youtube_profile' => $data['youtube_profile'],
            'twitter_profile' => $data['twitter_profile'],
            'pin' => $this->generatePin(),
        ]);
        if ($user->role === User::BRAND){
            $user->update([
                'is_active' => User::ACTIVE
            ]);
        }
        if (isset($data['photo'])){
            $user->addMedia($data['photo'])->toMediaCollection('user-profile-image');
        }

        return  $user;
    }


    public function showRegistrationForm()
    {
        $countries = Country::all();
        $content_categories = ContentCategory::all();
        $creator_categories = CreatorCategory::all();
        $company_types = CompanyType::all();
        $setting = Setting::first();
        return view('auth.register',compact('countries','content_categories','company_types','creator_categories','setting'));
    }

    public function getStates(Request $request)
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

    public function validateStepOne(Request $request)
    {
        $validator = Validator::make( $request->all(), [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'required|unique:users,phone',
            'country' => 'required',
            'state' => 'required',
            'role' => 'required',
            'gender' => 'required',
            'user_name' => 'required|unique:users,user_name',
            'password' => 'required|min:8',
        ]);
        if ( $validator->fails() ) {
            return response()->json( [
                'error'    => true,
                'messages' => $validator->errors(),
            ] );
        }else{
            return response()->json( [
                'error'    => false,
            ] );
        }
    }

    public function validateStepTwo(Request $request)
    {
        if ($request->role == "1"){
            $validator = Validator::make( $request->all(), [
                'company_name' => 'required|string|max:100',
                'company_size' => 'required',
                'company_type' => 'required',
                'email' => 'required|email|unique:users,email',
            ]);
            if ( $validator->fails() ) {
                return response()->json( [
                    'error'    => true,
                    'messages' => $validator->errors(),
                ] );
            }else{
                return response()->json( [
                    'error'    => false,
                ] );
            }
        }else{
            $validator = Validator::make( $request->all(), [
                'dob' => 'required',
                'content_category' => 'required',
                'creator_category' => 'nullable',
                'email' => 'required|email|unique:users,email',
                'instagram_profile' => 'required|max:50',
                'facebook_profile' => 'nullable|max:50',
                'twitter_profile' => 'nullable|max:50',
                'tiktok_profile' => 'nullable|max:50',
                'snapchat_profile' => 'nullable|max:50',
                'youtube_profile' => 'nullable|max:50',
            ]);
            if ( $validator->fails() ) {
                return response()->json( [
                    'error'    => true,
                    'messages' => $validator->errors(),
                ] );
            }else{
                return response()->json( [
                    'error'    => false,
                ] );
            }
        }

    }

    function generatePin() {
        $number = rand(1231,7879);
        if (self::checkPin($number)) {
            return self::generatePin();
        }
        return $number;
    }

    function checkPin($number) {
        return User::where('pin',$number)->exists();
    }

    public function register(Request $request)
    {
        event(new Registered($user = $this->create($request->all())));

        $this->guard()->login($user);

        if ($response = $this->registered($request, $user)) {
            return $response;
        }

        return $request->wantsJson()
            ? new JsonResponse([], 201)
            : redirect($this->redirectPath());
    }

    protected function registered(Request $request, $user)
    {
        if ( $user->role == User::BRAND){
            return redirect()->route('brandDashboard') ;
        }elseif ($user->role == User::CREATOR ){
            return redirect()->route('creatorDashboard') ;
        }
    }
}
