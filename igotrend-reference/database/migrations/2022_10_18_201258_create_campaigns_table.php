<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCampaignsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('sponsor');
            $table->string('name');
            $table->longText('description');
            $table->longText('kpis');
            $table->string('age_range');
            $table->string('type');
            $table->string('mood')->nullable();
            $table->string('status')->comment('0-pending,1-Active,2-decline,3-completed')->default('0');
            $table->boolean('is_disable')->comment('0-enable,1-disable')->default('0');
            $table->string('campaign_duration')->comment('day,weekly');
            $table->unsignedBigInteger('campaign_category_id');
            $table->unsignedBigInteger('creator_category_id')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('no_of_trender');
            $table->string('no_of_day');
            $table->string('no_of_week');
            $table->string('daily_instagram_post');
            $table->string('daily_instagram_story_post');
            $table->string('daily_fb_post');
            $table->string('daily_fb_story_post');
            $table->string('daily_tiktok_post');
            $table->string('daily_youtube_post');
            $table->string('daily_twitter_post');
            $table->string('daily_twitter_fleet');
            $table->string('daily_snapchat_story');
            $table->string('weekly_instagram_post');
            $table->string('weekly_instagram_story_post');
            $table->string('weekly_fb_post');
            $table->string('weekly_fb_story_post');
            $table->string('weekly_tiktok_post');
            $table->string('weekly_youtube_post');
            $table->string('weekly_twitter_post');
            $table->string('weekly_twitter_fleet');
            $table->string('weekly_snapchat_story');
            $table->longText('brand_description')->nullable();
            $table->longText('post_caption_text')->nullable();
            $table->longText('handles_hash')->nullable();
            $table->longText('dos')->nullable();
            $table->longText('donts')->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('campaigns');
    }
}
