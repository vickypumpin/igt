<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class MailConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $settings = Setting::first();
        if ($settings){
            $config = array(
                'driver'     => $settings->mail_mailer, // mail
                'host'       => $settings->mail_host, // smtp.gmail.com
                'port'       => $settings->mail_port, // 587
                'username'   => $settings->mail_username, // yourusername@gmail.com
                'password'   => $settings->mail_password, // yourgmailpassword
                'encryption' => $settings->mail_encryption, // tls
                'from'       => array('address' => $settings->mail_from, 'name' => $settings->site_name),
                'sendmail'   => '/usr/sbin/sendmail -bs',
                'pretend'    => false,
            );
            Config::set('mail', $config);
        }
    }
}
