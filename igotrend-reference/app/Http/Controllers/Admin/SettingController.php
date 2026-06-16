<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Traits\imageUploadTrait;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SettingController extends Controller
{
    use imageUploadTrait;

    public function site_setting()
    {
        $setting = Setting::first();
        return view('admin.setting',compact('setting'));
    }
    public function site_setting_update(Request $request)
    {
        $request->validate([
            'site_name' => 'required|max:20',
            'logo' => 'nullable|image',
            'favicon' => 'nullable|image',
            'site_description' => 'nullable|max:200',
            'contact_email' => 'nullable|email',
            'gem_price' => 'nullable|numeric',
        ]);
        $setting = Setting::first();
        $site_logo = $setting->site_logo;
        $site_favicon = $setting->site_favicon;

        if ($request->file('logo')){
            if ($setting->site_logo){
                if ( file_exists( public_path( 'storage/logo/' . $setting->site_logo) ) ) {
                    unlink( public_path( 'storage/logo/' . $setting->site_logo) );
                }
            }
            $site_logo = self::uploadFile($request,'logo','logo');
        }

        if ($request->file('favicon')){
            if ($setting->site_favicon){
                if ( file_exists( public_path( 'storage/favicon/' . $setting->site_favicon) ) ) {
                    unlink( public_path( 'storage/favicon/' . $setting->site_favicon) );
                }
            }
            $site_favicon = self::uploadFile($request,'favicon','favicon');
        }


        $setting->update([
            'site_name' => $request->site_name,
            'site_logo' => $site_logo,
            'site_favicon' => $site_favicon,
            'seo_tags' => $request->seo_tags,
            'site_description' => $request->site_description,
            'facebook_url' => $request->facebook_url,
            'instagram_url' => $request->instagram_url,
            'youtube_url' => $request->youtube_url,
            'gem_price' => $request->gem_price,
        ]);

        return redirect()->back()->with('success','setting updated successfully');

    }

    /**
     * Show the application dashboard.
     *
     * @return Application|Factory|View
     */
    public function email()
    {
        $setting = Setting::first();
        return view('admin.email_settings',compact('setting'));
    }

    public function emailUpdate(Request $request)
    {
        $setting = Setting::first();
        $data = $request->validate([
            'mail_mailer' => 'required',
            'mail_host' => 'required',
            'mail_port' => 'required',
            'mail_username' => 'required',
            'mail_password' => 'required',
            'mail_encryption' => 'required',
            'mail_from' => 'required',
        ]);
        $setting->update( $data );
        return redirect()->route('email_settings')->with( 'success', 'Email Settings Updated Successfully' );
    }

    public function api_config()
    {
        $setting = Setting::first();
        return view('admin.api_config',compact('setting'));
    }

    public function update_flutter_wave(Request $request)
    {
        $setting = Setting::first();
        $data =  $request->validate([
            'flutter_wave_public_key' => 'required',
            'flutter_wave_secret_key' => 'required',
            'flutter_wave_encryption_key' => 'required',
        ]);
        $setting->update( $data );
        return redirect()->route('api_config')->with( 'success', 'FlutterWave Settings Updated Successfully' );
    }

    public function update_twilio(Request $request)
    {
        $setting = Setting::first();
        $data =  $request->validate([
            'account_sid' => 'required',
            'auth_token' => 'required',
            'from_number' => 'required',
        ]);
        $setting->update( $data );
        return redirect()->route('api_config')->with( 'success', 'Twilio Settings Updated Successfully' );
    }

    public function update_chat_gpt(Request $request)
    {
        $setting = Setting::first();
        $data =  $request->validate([
            'chat_gpt_api_key' => 'required',
        ]);
        $setting->update( $data );
        return redirect()->route('api_config')->with( 'success', 'Chat gpt key Updated Successfully' );
    }

    public function update_sms_247(Request $request)
    {
        $setting = Setting::first();
        $data =  $request->validate([
            'sms_live_247_api_key' => 'required',
        ]);
        $setting->update( $data );
        return redirect()->route('api_config')->with( 'success', 'Sms 247 api key Updated Successfully' );
    }

    public function localization()
    {
        $setting = Setting::first();
        return view('admin.localization',compact('setting'));
    }

    public function localization_save(Request $request)
    {
        $setting = Setting::first();
        $setting->update([
            'gem_service_fee' => $request->gem_service_fee ,
            'creator_service_fee' => $request->creator_service_fee ,
            'brand_service_fee' => $request->brand_service_fee ,
            'registration_status' => $request->registration_status ?? 0 ,
            'login_status' => $request->login_status ?? 0 ,
            'sms_notify' => $request->sms_notify ?? 0 ,
        ]);
        return redirect()->back()->with( 'success', 'Localization updated successfully' );
    }

}
