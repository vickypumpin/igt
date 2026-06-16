<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\CampaignInvite;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::orderBy('id','desc')->get();
        return view('creators.pages.faq',compact('faqs'));
    }

    public function saveRates(Request $request)
    {
        $invite = CampaignInvite::where('user_id',auth()->user()->id)
            ->where(function ($q){
                $q->where('status', CampaignInvite::ACTIVE)
                    ->orWhere('status', CampaignInvite::PENDING);
            })->first();
        if ($invite){
            return redirect()->back()->with('danger','Update Error');
        }else{
            $user = auth()->user();
            $user->update([
                'instagram_day_post_price' => $request->instagram_day_post_price ?? $user->instagram_day_post_price,
                'instagram_week_post_price' => $request->instagram_week_post_price ?? $user->instagram_week_post_price,
                'instagram_day_story_price' => $request->instagram_day_story_price ?? $user->instagram_day_story_price,
                'instagram_week_story_price' => $request->instagram_week_story_price ?? $user->instagram_week_story_price,
                'instagram_day_reel_price' => $request->instagram_day_reel_price ?? $user->instagram_day_reel_price,
                'instagram_week_reel_price' => $request->instagram_week_reel_price ?? $user->instagram_week_reel_price,
                'instagram_day_live_price' => $request->instagram_day_live_price ?? $user->instagram_day_live_price,
                'instagram_week_live_price' => $request->instagram_week_live_price ?? $user->instagram_week_live_price,
                'fb_day_post_price' => $request->fb_day_post_price ?? $user->fb_day_post_price,
                'fb_week_post_price' => $request->fb_week_post_price ?? $user->fb_week_post_price,
                'fb_day_story_price' => $request->fb_day_story_price ?? $user->fb_day_story_price,
                'fb_week_story_price' => $request->fb_week_story_price ?? $user->fb_week_story_price,
                'fb_day_reel_price' => $request->fb_day_reel_price ?? $user->fb_day_reel_price,
                'fb_week_reel_price' => $request->fb_week_reel_price ?? $user->fb_week_reel_price,
                'fb_day_live_price' => $request->fb_day_live_price ?? $user->instagram_day_live_price,
                'fb_week_live_price' => $request->fb_week_live_price ?? $user->fb_week_live_price,
                'tiktok_day_post_price' => $request->tiktok_day_post_price ?? $user->tiktok_day_post_price,
                'tiktok_week_post_price' => $request->tiktok_week_post_price ?? $user->tiktok_week_post_price,
                'tiktok_day_video_15_seconds' => $request->tiktok_day_video_15_seconds ?? $user->tiktok_day_video_15_seconds,
                'tiktok_week_video_15_seconds' => $request->tiktok_week_video_15_seconds ?? $user->tiktok_week_video_15_seconds,
                'tiktok_day_video_60_seconds' => $request->tiktok_day_video_60_seconds ?? $user->tiktok_day_video_60_seconds,
                'tiktok_week_video_60_seconds' => $request->tiktok_week_video_60_seconds ?? $user->tiktok_week_video_60_seconds,
                'tiktok_day_video_10_minutes' => $request->tiktok_day_video_10_minutes ?? $user->tiktok_day_video_10_minutes,
                'tiktok_week_video_10_minutes' => $request->tiktok_week_video_10_minutes ?? $user->tiktok_week_video_10_minutes,
                'youtube_day_post_price' => $request->youtube_day_post_price ?? $user->youtube_day_post_price,
                'youtube_week_post_price' => $request->youtube_week_post_price ?? $user->youtube_week_post_price,
                'youtube_day_video_price' => $request->youtube_day_video_price ?? $user->youtube_day_video_price,
                'youtube_week_video_price' => $request->youtube_week_video_price ?? $user->youtube_week_video_price,
                'youtube_day_short_price' => $request->youtube_day_short_price ?? $user->youtube_day_short_price,
                'youtube_week_short_price' => $request->youtube_week_short_price ?? $user->youtube_week_short_price,
                'youtube_day_live_price' => $request->youtube_day_live_price ?? $user->youtube_day_live_price,
                'youtube_week_live_price' => $request->youtube_week_live_price ?? $user->youtube_week_live_price,
                'twitter_day_post_price' => $request->twitter_day_post_price ?? $user->twitter_day_post_price,
                'twitter_week_post_price' => $request->twitter_week_post_price ?? $user->twitter_week_post_price,
                'twitter_day_poll_price' => $request->twitter_day_poll_price ?? $user->twitter_day_poll_price,
                'twitter_week_poll_price' => $request->twitter_week_poll_price ?? $user->twitter_week_poll_price,
                'twitter_day_space_price' => $request->twitter_day_space_price ?? $user->twitter_day_space_price,
                'twitter_week_space_price' => $request->twitter_week_space_price ?? $user->twitter_week_space_price,
                'snapchat_day_story_price' => $request->snapchat_day_story_price ?? $user->snapchat_day_story_price,
                'snapchat_week_story_price' => $request->snapchat_week_story_price ?? $user->snapchat_week_story_price,
                'snapchat_day_video_price' => $request->snapchat_day_video_price ?? $user->snapchat_day_video_price,
                'snapchat_week_video_price' => $request->snapchat_week_video_price ?? $user->snapchat_week_video_price,
                'content_creator_rate' => $request->content_creator_rate ?? $user->content_creator_rate,
            ]);
            return redirect()->back()->with('success','Price updated successfully');
        }


    }
}
