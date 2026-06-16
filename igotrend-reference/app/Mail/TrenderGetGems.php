<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TrenderGetGems extends Mailable
{
    use Queueable, SerializesModels;


    public $user_name ;
    public $sender_name ;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user_name,$sender_name)
    {
        $this->user_name = $user_name;
        $this->sender_name = $sender_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('GEMS Notification from '.$this->sender_name)
            ->markdown('emails.trender_get_gems');
    }
}
