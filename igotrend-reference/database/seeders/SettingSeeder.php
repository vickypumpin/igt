<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Setting::create([
           'site_name' => 'IgoTrend',
           'mail_mailer' => 'smtp',
           'mail_host' => 'smtp.mailtrap.io',
           'mail_port' => '2525',
           'mail_username' => '72461fb69352ab',
           'mail_password' => 'a48e68402eb7f3',
           'mail_encryption' => 'tls',
           'mail_from' => 'noreply@igotrend.com',
           'facebook_url' => 'https://facebook.com/',
           'instagram_url' => 'https://www.instagram.com/',
           'youtube_url' => 'https://www.youtube.com/',
        ]);
    }
}
