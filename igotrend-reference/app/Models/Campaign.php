<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Campaign extends Model implements HasMedia
{
    use HasFactory,InteractsWithMedia;

    protected $guarded = [];

    CONST PENDING = '0';
    CONST ACTIVE = '1';
    CONST DECLINE = '2';
    CONST COMPLETED = '3';

    CONST INFLUENCER_TYPE = "1";
    CONST CONTENT_CREATOR_TYPE = "2";

    CONST DISABLE = 1;
    CONST ENABLE = 0;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('campaign_cover_image');
        $this->addMediaCollection('campaign_media_files');
    }

    public function campaign_category()
    {
        return $this->belongsTo(ContentCategory::class,'campaign_category_id');
    }

    public function campaign_creator_category()
    {
        return $this->belongsTo(CreatorCategory::class,'creator_category_id');
    }

    public function campaign_users()
    {
        return $this->hasMany(CampaignInvite::class,'campaign_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public static function calculate_total_deliverables($campaign)
    {
        if ($campaign->campaign_duration == "day"){

            //    instagram
            $total_instagram_post = (int)$campaign->daily_instagram_post ;
            $total_instagram_story = (int)$campaign->daily_instagram_story_post ;
            $total_instagram_reel = (int)$campaign->daily_instagram_reel ;
            $total_instagram_live = (int)$campaign->daily_instagram_live ;
            //    facebook
            $total_facebook_post = (int)$campaign->daily_fb_post ;
            $total_facebook_story = (int)$campaign->daily_fb_story_post ;
            $total_facebook_reel = (int)$campaign->daily_fb_reel ;
            $total_facebook_live = (int)$campaign->daily_fb_live ;
            //    tiktok
            $total_tiktok_post = (int)$campaign->daily_tiktok_post ;
            $total_daily_tiktok_video_15_s = (int)$campaign->daily_tiktok_video_15_s ;
            $total_daily_tiktok_video_60_s = (int)$campaign->daily_tiktok_video_60_s ;
            $total_daily_tiktok_video_10_m = (int)$campaign->daily_tiktok_video_10_m ;
            //    youtube
            $total_youtube_post = (int)$campaign->daily_youtube_post ;
            $total_youtube_video = (int)$campaign->daily_youtube_video ;
            $total_youtube_short = (int)$campaign->daily_youtube_short ;
            $total_youtube_live = (int)$campaign->daily_youtube_live ;
            //    twitter
            $total_twitter_post = (int)$campaign->daily_twitter_post ;
            $total_twitter_poll = (int)$campaign->daily_twitter_poll ;
            $total_twitter_space = (int)$campaign->daily_twitter_space ;
            //    snapchat
            $total_snapchat_post = (int)$campaign->daily_snapchat_story ;
            $total_snapchat_video = (int)$campaign->daily_snapchat_video ;

            $sum_deliverables =  $total_instagram_post + $total_instagram_story + $total_instagram_reel +$total_instagram_live
                +   $total_facebook_post + $total_facebook_story  + $total_facebook_reel  + $total_facebook_live +
                +   $total_tiktok_post + $total_daily_tiktok_video_15_s  + $total_daily_tiktok_video_60_s  + $total_daily_tiktok_video_10_m  +
                +  $total_youtube_post + $total_youtube_video + $total_youtube_short + $total_youtube_live +
                + $total_twitter_post + $total_twitter_poll + $total_twitter_space +
                + $total_snapchat_post + $total_snapchat_video;

            return [
                'total_deliverables' => $sum_deliverables,
            ];
        } elseif ($campaign->campaign_duration == "weekly"){

            //    instagram
            $total_instagram_post = (int)$campaign->weekly_instagram_post ;
            $total_instagram_story = (int)$campaign->weekly_instagram_story_post ;
            $total_instagram_reel = (int)$campaign->weekly_instagram_reel ;
            $total_instagram_story = (int)$campaign->weekly_instagram_live ;
            //    facebook
            $total_facebook_post = (int)$campaign->weekly_fb_post ;
            $total_facebook_story = (int)$campaign->weekly_fb_story_post ;
            $total_facebook_reel = (int)$campaign->weekly_fb_reel ;
            $total_facebook_live = (int)$campaign->weekly_fb_live ;
            //    tiktok
            $total_tiktok_post = (int)$campaign->weekly_tiktok_post ;
            $total_tiktok_week_video_15_seconds = (int)$campaign->weekly_tiktok_video_15_s ;
            $total_tiktok_week_video_60_seconds = (int)$campaign->weekly_tiktok_video_60_s ;
            $total_tiktok_week_video_10_minutes = (int)$campaign->weekly_tiktok_video_10_m ;
            //    youtube
            $total_youtube_post = (int)$campaign->weekly_youtube_post ;
            $total_youtube_week_video = (int)$campaign->weekly_youtube_video ;
            $total_youtube_week_live = (int)$campaign->weekly_youtube_short ;
            $total_youtube_week_live = (int)$campaign->weekly_youtube_live ;
            //    twitter
            $total_twitter_post = (int)$campaign->weekly_twitter_post ;
            $total_twitter_week_poll = (int)$campaign->weekly_twitter_poll ;
            $total_twitter_week_space = (int)$campaign->weekly_twitter_space ;
            //    snapchat
            $total_snapchat_post = (int)$campaign->weekly_snapchat_story ;
            $total_snapchat_week_video = (int)$campaign->weekly_snapchat_video ;

            $sum_deliverables =  $total_instagram_post +  $total_instagram_story +$total_instagram_reel + $total_instagram_story +
                +  $total_facebook_post + $total_facebook_story +$total_facebook_reel +$total_facebook_live +
                +  $total_tiktok_post +  $total_tiktok_week_video_15_seconds + $total_tiktok_week_video_60_seconds +$total_tiktok_week_video_10_minutes
                +  $total_youtube_post + $total_youtube_week_video + $total_youtube_week_live +$total_youtube_week_live
                +  $total_twitter_post + $total_twitter_week_poll + $total_twitter_week_space
                +  $total_snapchat_post +$total_snapchat_week_video;

            return [
                'total_deliverables' => $sum_deliverables,
            ];

        } else {
            return [
                'total_deliverables' => 0,
            ];
        }
    }
    public static function calculate_estimated_price($campaign)
    {
        $campaign_invites_users = $campaign->campaign_users->pluck('user_id')->toArray();
        if (count($campaign_invites_users) == 0){
            return 0;
        }else{
            $total_budget = 0;
            foreach ($campaign_invites_users as $user_id){
                $user = User::where('id',$user_id)->first();
                if ($user){
                    if ($campaign->campaign_duration == "day"){
                        //  daily instagram prices
                        $instagram_post_price  = $user->instagram_day_post_price;
                        $instagram_story_price = $user->instagram_day_story_price;
                        $instagram_day_reel_price = $user->instagram_day_reel_price;
                        $instagram_day_live_price = $user->instagram_day_live_price;
                        //  daily facebook prices
                        $fb_post_price = $user->fb_day_post_price;
                        $fb_story_price = $user->fb_day_story_price;
                        $fb_day_reel_price = $user->fb_day_reel_price;
                        $fb_day_live_price = $user->fb_day_live_price;
                        //  daily tiktok prices
                        $tiktok_post_price = $user->tiktok_day_post_price;
                        $tiktok_day_video_15_seconds = $user->tiktok_day_video_15_seconds;
                        $tiktok_day_video_60_seconds = $user->tiktok_day_video_60_seconds;
                        $tiktok_day_video_10_minutes = $user->tiktok_day_video_10_minutes;
                        //  daily youtube prices
                        $youtube_post_price = $user->youtube_day_post_price;
                        $youtube_day_video_price = $user->youtube_day_video_price;
                        $youtube_day_short_price = $user->youtube_day_short_price;
                        $youtube_day_live_price = $user->youtube_day_live_price;
                        //  daily twitter prices
                        $twitter_post_price = $user->twitter_day_post_price;
                        $twitter_day_poll_price = $user->twitter_day_poll_price;
                        $twitter_day_space_price = $user->twitter_day_space_price;
                        //  daily snapchat prices
                        $snapchat_story_price = $user->snapchat_day_story_price;
                        $snapchat_day_video_price = $user->snapchat_day_video_price;


                        //    instagram
                        $total_instagram_post_price = (int)$campaign->daily_instagram_post * $instagram_post_price;
                        $total_instagram_story_price = (int)$campaign->daily_instagram_story_post * $instagram_story_price;
                        $total_instagram_reel_price = (int)$campaign->daily_instagram_reel * $instagram_day_reel_price;
                        $total_instagram_live_price = (int)$campaign->daily_instagram_live * $instagram_day_live_price;
                        //    facebook
                        $total_facebook_post_price = (int)$campaign->daily_fb_post * $fb_post_price;
                        $total_facebook_story_price = (int)$campaign->daily_fb_story_post * $fb_story_price;
                        $total_facebook_reel_price = (int)$campaign->daily_fb_reel * $fb_day_reel_price;
                        $total_facebook_live_price = (int)$campaign->daily_fb_live * $fb_day_live_price;
                        //    tiktok
                        $total_tiktok_post_price = (int)$campaign->daily_tiktok_post * $tiktok_post_price;
                        $total_daily_tiktok_video_15_s = (int)$campaign->daily_tiktok_video_15_s * $tiktok_day_video_15_seconds;
                        $total_daily_tiktok_video_60_s = (int)$campaign->daily_tiktok_video_60_s * $tiktok_day_video_60_seconds;
                        $total_daily_tiktok_video_10_m = (int)$campaign->daily_tiktok_video_10_m * $tiktok_day_video_10_minutes;
                        //    youtube
                        $total_youtube_post_price = (int)$campaign->daily_youtube_post * $youtube_post_price;
                        $total_youtube_video_price = (int)$campaign->daily_youtube_video * $youtube_day_video_price;
                        $total_youtube_short_price = (int)$campaign->daily_youtube_short * $youtube_day_short_price;
                        $total_youtube_live_price = (int)$campaign->daily_youtube_live * $youtube_day_live_price;
                        //    twitter
                        $total_twitter_post_price = (int)$campaign->daily_twitter_post * $twitter_post_price;
                        $total_twitter_poll_price = (int)$campaign->daily_twitter_poll * $twitter_day_poll_price;
                        $total_twitter_space_price = (int)$campaign->daily_twitter_space * $twitter_day_space_price;
                        //    snapchat
                        $total_snapchat_post_price = (int)$campaign->daily_snapchat_story * $snapchat_story_price;
                        $total_snapchat_video_price = (int)$campaign->daily_snapchat_video * $snapchat_day_video_price;

                        $sum_price =  $total_instagram_post_price + $total_instagram_story_price + $total_instagram_reel_price +$total_instagram_live_price
                            +   $total_facebook_post_price + $total_facebook_story_price  + $total_facebook_reel_price  + $total_facebook_live_price +
                            +   $total_tiktok_post_price + $total_daily_tiktok_video_15_s  + $total_daily_tiktok_video_60_s  + $total_daily_tiktok_video_10_m  +
                            +  $total_youtube_post_price + $total_youtube_video_price + $total_youtube_short_price + $total_youtube_live_price +
                            + $total_twitter_post_price + $total_twitter_poll_price + $total_twitter_space_price +
                            + $total_snapchat_post_price + $total_snapchat_video_price;

                        $total_price =   $sum_price * $campaign->no_of_day;
                        if ($campaign->type == Campaign::CONTENT_CREATOR_TYPE){
                            if (!is_null($user->creator_category) && $user->content_creator_rate){
                                  $total_budget += $total_price + $user->content_creator_rate;
                            }else{
                                  $total_budget += $total_price;
                            }
                        }else{
                              $total_budget += $total_price;
                        }
                    }
                    elseif ($campaign->campaign_duration == "weekly"){

                        //   weekly instagram price
                        $instagram_post_price  = $user->instagram_week_post_price;
                        $instagram_story_price = $user->instagram_week_story_price;
                        $instagram_week_reel_price = $user->instagram_week_reel_price;
                        $instagram_week_live_price = $user->instagram_week_live_price;
                        //   weekly facebook price
                        $fb_post_price = $user->fb_week_post_price;
                        $fb_story_price = $user->fb_week_story_price;
                        $fb_week_reel_price = $user->fb_week_reel_price;
                        $fb_week_live_price= $user->fb_week_live_price;
                        //   weekly tiktok price
                        $tiktok_post_price = $user->tiktok_week_post_price;
                        $tiktok_week_video_15_seconds= $user->tiktok_week_video_15_seconds;
                        $tiktok_week_video_60_seconds = $user->tiktok_week_video_60_seconds;
                        $tiktok_week_video_10_minutes = $user->tiktok_week_video_10_minutes;
                        //   weekly youtube price
                        $youtube_post_price = $user->youtube_week_post_price;
                        $youtube_week_video_price = $user->youtube_week_video_price;
                        $youtube_week_short_price = $user->youtube_week_short_price;
                        $youtube_week_live_price = $user->youtube_week_live_price;
                        //   weekly twitter price
                        $twitter_post_price = $user->twitter_week_post_price;
                        $twitter_week_poll_price = $user->twitter_week_poll_price;
                        $twitter_week_space_price = $user->twitter_week_space_price;
                        //   weekly snapchat price
                        $snapchat_story_price = $user->snapchat_week_story_price;
                        $snapchat_week_video_price = $user->snapchat_week_video_price;

                        //    instagram
                        $total_instagram_post_price = (int)$campaign->weekly_instagram_post * $instagram_post_price;
                        $total_instagram_story_price = (int)$campaign->weekly_instagram_story_post * $instagram_story_price;
                        $total_instagram_reel_price = (int)$campaign->weekly_instagram_reel * $instagram_week_reel_price;
                        $total_instagram_story_price = (int)$campaign->weekly_instagram_live * $instagram_week_live_price;
                        //    facebook
                        $total_facebook_post_price = (int)$campaign->weekly_fb_post * $fb_post_price;
                        $total_facebook_story_price = (int)$campaign->weekly_fb_story_post * $fb_story_price;
                        $total_facebook_reel_price = (int)$campaign->weekly_fb_reel * $fb_week_reel_price;
                        $total_facebook_live_price = (int)$campaign->weekly_fb_live * $fb_week_live_price;
                        //    tiktok
                        $total_tiktok_post_price = (int)$campaign->weekly_tiktok_post * $tiktok_post_price;
                        $total_tiktok_week_video_15_seconds = (int)$campaign->weekly_tiktok_video_15_s * $tiktok_week_video_15_seconds;
                        $total_tiktok_week_video_60_seconds = (int)$campaign->weekly_tiktok_video_60_s * $tiktok_week_video_60_seconds;
                        $total_tiktok_week_video_10_minutes = (int)$campaign->weekly_tiktok_video_10_m * $tiktok_week_video_10_minutes;
                        //    youtube
                        $total_youtube_post_price = (int)$campaign->weekly_youtube_post * $youtube_post_price;
                        $total_youtube_week_video_price = (int)$campaign->weekly_youtube_video * $youtube_week_video_price;
                        $total_youtube_week_live_price = (int)$campaign->weekly_youtube_short * $youtube_week_live_price;
                        $total_youtube_week_live_price = (int)$campaign->weekly_youtube_live * $youtube_week_live_price;
                        //    twitter
                        $total_twitter_post_price = (int)$campaign->weekly_twitter_post * $twitter_post_price;
                        $total_twitter_week_poll_price = (int)$campaign->weekly_twitter_poll * $twitter_week_poll_price;
                        $total_twitter_week_space_price = (int)$campaign->weekly_twitter_space * $twitter_week_space_price;
                        //    snapchat
                        $total_snapchat_post_price = (int)$campaign->weekly_snapchat_story * $snapchat_story_price;
                        $total_snapchat_week_video_price = (int)$campaign->weekly_snapchat_video * $snapchat_week_video_price;

                        $sum_price =  $total_instagram_post_price +  $total_instagram_story_price +$total_instagram_reel_price + $total_instagram_story_price +
                            +  $total_facebook_post_price + $total_facebook_story_price +$total_facebook_reel_price +$total_facebook_live_price +
                            +  $total_tiktok_post_price +  $total_tiktok_week_video_15_seconds + $total_tiktok_week_video_60_seconds +$total_tiktok_week_video_10_minutes
                            +  $total_youtube_post_price + $total_youtube_week_video_price + $total_youtube_week_live_price +$total_youtube_week_live_price
                            +  $total_twitter_post_price + $total_twitter_week_poll_price + $total_twitter_week_space_price
                            +  $total_snapchat_post_price +$total_snapchat_week_video_price;

                        $total_price =   $sum_price * $campaign->no_of_week;
                        if ($campaign->type == Campaign::CONTENT_CREATOR_TYPE){
                            if (!is_null($user->creator_category) && $user->content_creator_rate){
                                  $total_budget += $total_price + $user->content_creator_rate ;
                            }else{
                                  $total_budget += $total_price;
                            }
                        }else{
                              $total_budget += $total_price;
                        }
                    }
                }
            }
            return $total_budget ;
        }
    }
    public static function calculate_duration($campaign)
    {
        if ($campaign->campaign_duration == "day"){
            return (int)$campaign->no_of_day.' Day(s)';
        } elseif ($campaign->campaign_duration == "weekly"){
            return (int)$campaign->no_of_week.' Week(s)';
        } else {
            return 'N/A';
        }
    }
    public function get_trender_payout($campaign,$user){
        if ($user){
            if ($campaign->campaign_duration == "day"){
                //  daily instagram prices
                $instagram_post_price  = $user->instagram_day_post_price;
                $instagram_story_price = $user->instagram_day_story_price;
                $instagram_day_reel_price = $user->instagram_day_reel_price;
                $instagram_day_live_price = $user->instagram_day_live_price;
                //  daily facebook prices
                $fb_post_price = $user->fb_day_post_price;
                $fb_story_price = $user->fb_day_story_price;
                $fb_day_reel_price = $user->fb_day_reel_price;
                $fb_day_live_price = $user->fb_day_live_price;
                //  daily tiktok prices
                $tiktok_post_price = $user->tiktok_day_post_price;
                $tiktok_day_video_15_seconds = $user->tiktok_day_video_15_seconds;
                $tiktok_day_video_60_seconds = $user->tiktok_day_video_60_seconds;
                $tiktok_day_video_10_minutes = $user->tiktok_day_video_10_minutes;
                //  daily youtube prices
                $youtube_post_price = $user->youtube_day_post_price;
                $youtube_day_video_price = $user->youtube_day_video_price;
                $youtube_day_short_price = $user->youtube_day_short_price;
                $youtube_day_live_price = $user->youtube_day_live_price;
                //  daily twitter prices
                $twitter_post_price = $user->twitter_day_post_price;
                $twitter_day_poll_price = $user->twitter_day_poll_price;
                $twitter_day_space_price = $user->twitter_day_space_price;
                //  daily snapchat prices
                $snapchat_story_price = $user->snapchat_day_story_price;
                $snapchat_day_video_price = $user->snapchat_day_video_price;

                //    instagram
                $total_instagram_post_price = (int)$campaign->daily_instagram_post * $instagram_post_price;
                $total_instagram_story_price = (int)$campaign->daily_instagram_story_post * $instagram_story_price;
                $total_instagram_reel_price = (int)$campaign->daily_instagram_reel * $instagram_day_reel_price;
                $total_instagram_live_price = (int)$campaign->daily_instagram_live * $instagram_day_live_price;
                //    facebook
                $total_facebook_post_price = (int)$campaign->daily_fb_post * $fb_post_price;
                $total_facebook_story_price = (int)$campaign->daily_fb_story_post * $fb_story_price;
                $total_facebook_reel_price = (int)$campaign->daily_fb_reel * $fb_day_reel_price;
                $total_facebook_live_price = (int)$campaign->daily_fb_live * $fb_day_live_price;
                //    tiktok
                $total_tiktok_post_price = (int)$campaign->daily_tiktok_post * $tiktok_post_price;
                $total_daily_tiktok_video_15_s = (int)$campaign->daily_tiktok_video_15_s * $tiktok_day_video_15_seconds;
                $total_daily_tiktok_video_60_s = (int)$campaign->daily_tiktok_video_60_s * $tiktok_day_video_60_seconds;
                $total_daily_tiktok_video_10_m = (int)$campaign->daily_tiktok_video_10_m * $tiktok_day_video_10_minutes;
                //    youtube
                $total_youtube_post_price = (int)$campaign->daily_youtube_post * $youtube_post_price;
                $total_youtube_video_price = (int)$campaign->daily_youtube_video * $youtube_day_video_price;
                $total_youtube_short_price = (int)$campaign->daily_youtube_short * $youtube_day_short_price;
                $total_youtube_live_price = (int)$campaign->daily_youtube_live * $youtube_day_live_price;
                //    twitter
                $total_twitter_post_price = (int)$campaign->daily_twitter_post * $twitter_post_price;
                $total_twitter_poll_price = (int)$campaign->daily_twitter_poll * $twitter_day_poll_price;
                $total_twitter_space_price = (int)$campaign->daily_twitter_space * $twitter_day_space_price;
                //    snapchat
                $total_snapchat_post_price = (int)$campaign->daily_snapchat_story * $snapchat_story_price;
                $total_snapchat_video_price = (int)$campaign->daily_snapchat_video * $snapchat_day_video_price;

                $sum_price =  $total_instagram_post_price + $total_instagram_story_price + $total_instagram_reel_price +$total_instagram_live_price
                    +   $total_facebook_post_price + $total_facebook_story_price  + $total_facebook_reel_price  + $total_facebook_live_price +
                    +   $total_tiktok_post_price + $total_daily_tiktok_video_15_s  + $total_daily_tiktok_video_60_s  + $total_daily_tiktok_video_10_m  +
                    +  $total_youtube_post_price + $total_youtube_video_price + $total_youtube_short_price + $total_youtube_live_price +
                    + $total_twitter_post_price + $total_twitter_poll_price + $total_twitter_space_price +
                    + $total_snapchat_post_price + $total_snapchat_video_price;

                if ($campaign->type == Campaign::CONTENT_CREATOR_TYPE){
                    if (!is_null($user->creator_category) && $user->content_creator_rate){
                        return  $sum_price * $campaign->no_of_day + $user->content_creator_rate;
                    }else{
                        return   $sum_price * $campaign->no_of_day;
                    }
                }else{
                    return   $sum_price * $campaign->no_of_day;
                }
            }
            elseif ($campaign->campaign_duration == "weekly"){

                //   weekly instagram price
                $instagram_post_price  = $user->instagram_week_post_price;
                $instagram_story_price = $user->instagram_week_story_price;
                $instagram_week_reel_price = $user->instagram_week_reel_price;
                $instagram_week_live_price = $user->instagram_week_live_price;
                //   weekly facebook price
                $fb_post_price = $user->fb_week_post_price;
                $fb_story_price = $user->fb_week_story_price;
                $fb_week_reel_price = $user->fb_week_reel_price;
                $fb_week_live_price= $user->fb_week_live_price;
                //   weekly tiktok price
                $tiktok_post_price = $user->tiktok_week_post_price;
                $tiktok_week_video_15_seconds= $user->tiktok_week_video_15_seconds;
                $tiktok_week_video_60_seconds = $user->tiktok_week_video_60_seconds;
                $tiktok_week_video_10_minutes = $user->tiktok_week_video_10_minutes;
                //   weekly youtube price
                $youtube_post_price = $user->youtube_week_post_price;
                $youtube_week_video_price = $user->youtube_week_video_price;
                $youtube_week_short_price = $user->youtube_week_short_price;
                $youtube_week_live_price = $user->youtube_week_live_price;
                //   weekly twitter price
                $twitter_post_price = $user->twitter_week_post_price;
                $twitter_week_poll_price = $user->twitter_week_poll_price;
                $twitter_week_space_price = $user->twitter_week_space_price;
                //   weekly snapchat price
                $snapchat_story_price = $user->snapchat_week_story_price;
                $snapchat_week_video_price = $user->snapchat_week_video_price;

                //    instagram
                $total_instagram_post_price = (int)$campaign->weekly_instagram_post * $instagram_post_price;
                $total_instagram_story_price = (int)$campaign->weekly_instagram_story_post * $instagram_story_price;
                $total_instagram_reel_price = (int)$campaign->weekly_instagram_reel * $instagram_week_reel_price;
                $total_instagram_story_price = (int)$campaign->weekly_instagram_live * $instagram_week_live_price;
                //    facebook
                $total_facebook_post_price = (int)$campaign->weekly_fb_post * $fb_post_price;
                $total_facebook_story_price = (int)$campaign->weekly_fb_story_post * $fb_story_price;
                $total_facebook_reel_price = (int)$campaign->weekly_fb_reel * $fb_week_reel_price;
                $total_facebook_live_price = (int)$campaign->weekly_fb_live * $fb_week_live_price;
                //    tiktok
                $total_tiktok_post_price = (int)$campaign->weekly_tiktok_post * $tiktok_post_price;
                $total_tiktok_week_video_15_seconds = (int)$campaign->weekly_tiktok_video_15_s * $tiktok_week_video_15_seconds;
                $total_tiktok_week_video_60_seconds = (int)$campaign->weekly_tiktok_video_60_s * $tiktok_week_video_60_seconds;
                $total_tiktok_week_video_10_minutes = (int)$campaign->weekly_tiktok_video_10_m * $tiktok_week_video_10_minutes;
                //    youtube
                $total_youtube_post_price = (int)$campaign->weekly_youtube_post * $youtube_post_price;
                $total_youtube_week_video_price = (int)$campaign->weekly_youtube_video * $youtube_week_video_price;
                $total_youtube_week_live_price = (int)$campaign->weekly_youtube_short * $youtube_week_live_price;
                $total_youtube_week_live_price = (int)$campaign->weekly_youtube_live * $youtube_week_live_price;
                //    twitter
                $total_twitter_post_price = (int)$campaign->weekly_twitter_post * $twitter_post_price;
                $total_twitter_week_poll_price = (int)$campaign->weekly_twitter_poll * $twitter_week_poll_price;
                $total_twitter_week_space_price = (int)$campaign->weekly_twitter_space * $twitter_week_space_price;
                //    snapchat
                $total_snapchat_post_price = (int)$campaign->weekly_snapchat_story * $snapchat_story_price;
                $total_snapchat_week_video_price = (int)$campaign->weekly_snapchat_video * $snapchat_week_video_price;

                $sum_price =  $total_instagram_post_price +  $total_instagram_story_price +$total_instagram_reel_price + $total_instagram_story_price +
                    +  $total_facebook_post_price + $total_facebook_story_price +$total_facebook_reel_price +$total_facebook_live_price +
                    +  $total_tiktok_post_price +  $total_tiktok_week_video_15_seconds + $total_tiktok_week_video_60_seconds +$total_tiktok_week_video_10_minutes
                    +  $total_youtube_post_price + $total_youtube_week_video_price + $total_youtube_week_live_price +$total_youtube_week_live_price
                    +  $total_twitter_post_price + $total_twitter_week_poll_price + $total_twitter_week_space_price
                    +  $total_snapchat_post_price +$total_snapchat_week_video_price;

                if ($campaign->type == Campaign::CONTENT_CREATOR_TYPE){
                    if (!is_null($user->creator_category) && $user->content_creator_rate){
                        return  $sum_price * $campaign->no_of_week + $user->content_creator_rate;
                    }else{
                        return   $sum_price * $campaign->no_of_week;
                    }
                }else{
                    return   $sum_price * $campaign->no_of_week;
                }
            }
        } else{
            return 0;
        }
    }
}
