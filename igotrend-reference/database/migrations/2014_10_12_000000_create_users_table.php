<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('user_name');
            $table->string('phone');
            $table->string('country_id');
            $table->string('state_id')->nullable();
            $table->string('role')->comment('1- Brands / Advertiser,2- Creator / Influencer');
            $table->string('gender');
            $table->string('content_category')->nullable();
            $table->string('creator_category')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('company_name')->nullable();
            $table->string('company_size')->nullable();
            $table->string('company_type')->nullable();
            $table->string('facebook_profile')->nullable();
            $table->string('instagram_profile')->nullable();
            $table->string('twitter_profile')->nullable();
            $table->string('youtube_profile')->nullable();
            $table->string('tiktok_profile')->nullable();
            $table->string('snapchat_profile')->nullable();
            $table->date('dob')->nullable();
            $table->bigInteger('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->boolean('is_active')->default(0)->comment('0= in-active,1=active');
            $table->boolean('is_locked')->default(0)->comment('0= un-locked,1=locked');
            $table->boolean('is_payment_info_locked')->default(0)->comment('0= un-locked,1=locked');
            $table->bigInteger('gems')->default(0);
            $table->float('balance')->default(0);

            $table->unsignedInteger('instagram_day_post_price')->nullable();
            $table->unsignedInteger('instagram_week_post_price')->nullable();
            $table->unsignedInteger('instagram_day_story_price')->nullable();
            $table->unsignedInteger('instagram_week_story_price')->nullable();
            $table->unsignedInteger('instagram_day_reel_price')->nullable();
            $table->unsignedInteger('instagram_week_reel_price')->nullable();

            $table->unsignedInteger('fb_day_post_price')->nullable();
            $table->unsignedInteger('fb_week_post_price')->nullable();
            $table->unsignedInteger('fb_day_story_price')->nullable();
            $table->unsignedInteger('fb_week_story_price')->nullable();
            $table->unsignedInteger('fb_day_reel_price')->nullable();
            $table->unsignedInteger('fb_week_reel_price')->nullable();

            $table->unsignedInteger('tiktok_day_post_price')->nullable();
            $table->unsignedInteger('tiktok_week_post_price')->nullable();

            $table->unsignedInteger('youtube_day_post_price')->nullable();
            $table->unsignedInteger('youtube_week_post_price')->nullable();

            $table->unsignedInteger('twitter_day_post_price')->nullable();
            $table->unsignedInteger('twitter_week_post_price')->nullable();
            $table->unsignedInteger('twitter_day_fleet_price')->nullable();
            $table->unsignedInteger('twitter_week_fleet_price')->nullable();

            $table->unsignedInteger('snapchat_day_story_price')->nullable();
            $table->unsignedInteger('snapchat_week_story_price')->nullable();

            $table->string('facebook_followers')->nullable();
            $table->string('facebook_post')->nullable();
            $table->string('facebook_story')->nullable();
            $table->string('facebook_friends')->nullable();
            $table->string('facebook_like_percentage')->nullable();
            $table->string('instagram_followers')->nullable();
            $table->string('instagram_post')->nullable();
            $table->string('instagram_story')->nullable();
            $table->string('instagram_friends')->nullable();
            $table->string('instagram_like_percentage')->nullable();
            $table->string('snapchat_followers')->nullable();
            $table->string('snapchat_post')->nullable();
            $table->string('snapchat_story')->nullable();
            $table->string('snapchat_friends')->nullable();
            $table->string('snapchat_like_percentage')->nullable();
            $table->string('twitter_followers')->nullable();
            $table->string('twitter_post')->nullable();
            $table->string('twitter_friends')->nullable();
            $table->string('twitter_like_percentage')->nullable();
            $table->string('youtube_followers')->nullable();
            $table->string('youtube_post')->nullable();
            $table->string('youtube_friends')->nullable();
            $table->string('youtube_like_percentage')->nullable();
            $table->string('tiktok_followers')->nullable();
            $table->string('tiktok_post')->nullable();
            $table->string('tiktok_friends')->nullable();
            $table->string('tiktok_like_percentage')->nullable();
            $table->string('badge')->nullable();
            $table->integer('pin');
            $table->boolean( 'is_login' )->default(0)->comment('0=logout,1=login');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
