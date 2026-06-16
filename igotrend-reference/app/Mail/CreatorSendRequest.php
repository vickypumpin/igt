<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CreatorSendRequest extends Mailable
{
    use Queueable, SerializesModels;

    public $creator_name;
    public $brand_name;
    public $campaign_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($creator_name,$brand_name,$campaign_name)
    {
        $this->creator_name = $creator_name;
        $this->brand_name = $brand_name;
        $this->campaign_name = $campaign_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Creator Campaign Request')
            ->markdown('emails.creator_send_request');
    }
}
