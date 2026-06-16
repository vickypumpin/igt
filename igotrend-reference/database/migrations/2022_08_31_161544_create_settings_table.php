<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string( 'site_name');
            $table->string( 'site_logo')->nullable();
            $table->string( 'site_favicon')->nullable();
            $table->string( 'mail_mailer')->nullable();
            $table->string( 'mail_host')->nullable();
            $table->string( 'mail_port')->nullable();
            $table->string( 'mail_username')->nullable();
            $table->string( 'mail_password')->nullable();
            $table->string( 'mail_encryption')->nullable();
            $table->string( 'mail_from')->nullable();
            $table->string( 'seo_tags')->nullable();
            $table->string( 'site_description')->nullable();
            $table->string( 'facebook_url')->nullable();
            $table->string( 'instagram_url')->nullable();
            $table->string( 'youtube_url')->nullable();
            $table->string( 'flutter_wave_public_key')->nullable();
            $table->string( 'flutter_wave_secret_key')->nullable();
            $table->string( 'flutter_wave_encryption_key')->nullable();
            $table->longText( 'message_notification')->nullable();
            $table->date( 'message_notification_date')->nullable();
            $table->integer( 'gem_price')->default(1);
            $table->integer( 'gem_service_fee')->default(2);
            $table->integer( 'creator_service_fee')->default(2);
            $table->integer( 'brand_service_fee')->default(2);
            $table->boolean( 'registration_status')->default(1);
            $table->boolean( 'login_status')->default(1);
            $table->boolean( 'sms_notify')->default(1);
            $table->string('account_sid')->nullable();
            $table->string('auth_token')->nullable();
            $table->string('from_number')->nullable();
            $table->string('chat_gpt_api_key')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
