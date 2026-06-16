<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CreatorApprove extends Mailable
{
    use Queueable, SerializesModels;

    public $user_name;
    public $custom_url;
    public $account_pin;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user_name,$custom_url,$account_pin)
    {
        $this->user_name = $user_name;
        $this->custom_url = $custom_url;
        $this->account_pin = $account_pin;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Your Profile for IGotrend has been approved!')
            ->markdown('emails.creator_approve');
    }
}
