<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GuestGemSender extends Mailable
{
    use Queueable, SerializesModels;

    public $to_user_name ;
    public $sender_name ;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($to_user_name,$sender_name)
    {
        $this->to_user_name = $to_user_name;
        $this->sender_name = $sender_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Your GEMS Has Been Received')
            ->markdown('emails.guest_gem_sender');
    }
}
