<?php

namespace App\Traits;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;


trait smsLive247Trait
{
    public  function sendSMS($to_number, $message)
    {
        try {
            $setting  = Setting::first();
            $api_key = $setting->sms_live_247_api_key;


            $response = Http::withHeaders([
                'Authorization' => $api_key,
                'accept' => 'application/json',
                'content-type' => 'application/*+json',
            ])->post('https://api.smslive247.com/api/v4/sms', [
                'messageText' => $message,
                'mobileNumber' => $to_number,
            ]);

            if ($response->successful()){
                return true;
            }else{
                Log::info("message send api error");
                Log::info($response->body());
                Log::info("message send api error");
            }
        } catch (\Exception $e) {
            Log::info("message send error");
            Log::info($e->getMessage());
            Log::info("message send error");
            return false;
        }
    }
}
