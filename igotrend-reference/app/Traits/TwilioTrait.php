<?php

namespace App\Traits;

use App\Models\Setting;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;


trait TwilioTrait
{
    public  function sendSMS($to_number, $message)
    {
        try {
            $setting  = Setting::first();
            $account_sid = $setting->account_sid;
            $auth_token = $setting->auth_token;
            $from = $setting->from_number;

            $obj = array(
                "body" => $message,
                "from" => $from,
            );

            $client = new Client($account_sid, $auth_token);

            $client->messages->create($to_number, $obj);
            return true;
        } catch (\Exception $e) {
            Log::info("message send error");
            Log::info($e->getMessage());
            Log::info("message send error");
            return false;
        }
    }
}
