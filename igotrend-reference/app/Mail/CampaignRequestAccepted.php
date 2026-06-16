<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignRequestAccepted extends Mailable
{
    use Queueable, SerializesModels;

     Public  $influencer_user_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($influencer_user_name)
    {
       $this->influencer_user_name = $influencer_user_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Campaign Request Accepted')
            ->markdown('emails.campaign_request_accepted');
    }
}
