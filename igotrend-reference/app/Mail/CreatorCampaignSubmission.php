<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CreatorCampaignSubmission extends Mailable
{
    use Queueable, SerializesModels;

    public $brand_user_name;
    public $trender_user_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($brand_user_name,$trender_user_name)
    {
        $this->brand_user_name = $brand_user_name;
        $this->trender_user_name = $trender_user_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Creator Campaign Submission')
            ->markdown('emails.creator_campaign_submission');
    }
}
