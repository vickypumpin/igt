<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CreatorRejectCampaignInvite extends Mailable
{
    use Queueable, SerializesModels;

    public $influencer_user_name;
    public $brand_user_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($influencer_user_name,$brand_user_name)
    {
        $this->influencer_user_name = $influencer_user_name;
        $this->brand_user_name = $brand_user_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Campaign request rejected')
            ->markdown('emails.creator_reject_campaign_invite');
    }
}
