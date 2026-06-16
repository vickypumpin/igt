<?php

namespace App\Providers;

use App\Models\Campaign;
use App\Models\GemPayoutRequest;
use App\Models\Payment;
use App\Models\PayoutRequest;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserAccountInfoRequest;
use App\Models\UserPaymentInfoRequest;
use App\Models\UserReward;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $settings = Setting::first();
        $verify_requests_count = UserPaymentInfoRequest::where('is_approved',0)->count();
        $reward_requests_count = UserReward::where('type','air_time')
            ->where('status',0)->count();
        $user_info_requests_count = UserAccountInfoRequest::where('is_approved',0)->count();
        $payout_requests_count = PayoutRequest::where('status',0)->count();
        $gem_payout_requests_count = GemPayoutRequest::where('status',0)->count();
        $total_request_counts = $verify_requests_count + $reward_requests_count + $user_info_requests_count + $payout_requests_count + $gem_payout_requests_count ;
        $trender_payout_pending_payments_count = Payment::where('payment_status','=',0)
            ->where('payment_type','=','trender_payout_payment')
            ->count() ;

        $trender_payout_gem_pending_payments_count = Payment::where('payment_status','=',0)
            ->where('payment_type','=','trender_payout_gem_payment')
            ->count() ;
        $total_payment_pending_approve_count = $trender_payout_pending_payments_count + $trender_payout_gem_pending_payments_count;

        $pending_campaign_count = Campaign::where('status',Campaign::PENDING)->count();
        $pending_users_count = User::where('is_active',User::IN_ACTIVE)->count();


        view()->share('settings', $settings);
        view()->share('total_request_counts', $total_request_counts);
        view()->share('total_payment_pending_approve_count', $total_payment_pending_approve_count);
        view()->share('pending_campaign_count', $pending_campaign_count);
        view()->share('pending_users_count', $pending_users_count);

        if ($settings->flutter_wave_public_key && $settings->flutter_wave_secret_key && $settings->flutter_wave_encryption_key){
            $public_key = getenv('FLW_PUBLIC_KEY');
            $secret_key = getenv('FLW_SECRET_KEY');
            $secret_hash= getenv('FLW_SECRET_HASH');


            if ($public_key === ""){
              $this->setEnv("FLW_PUBLIC_KEY",$settings->flutter_wave_public_key);
            }
            if ($secret_key === ""){
                $this->setEnv("FLW_SECRET_KEY",$settings->flutter_wave_secret_key);
            }
            if ($secret_hash === ""){
                $this->setEnv("FLW_SECRET_HASH",$settings->flutter_wave_encryption_key);
            }
        }
    }


    public function setEnv($key, $value)
    {
        $path = app()->environmentFilePath();

        $escaped = preg_quote('='.env($key), '/');

        file_put_contents($path, preg_replace(
            "/^{$key}{$escaped}/m",
            "{$key}={$value}",
            file_get_contents($path)
        ));
    }

}
