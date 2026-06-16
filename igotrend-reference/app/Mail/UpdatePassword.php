<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UpdatePassword extends Mailable
{
    use Queueable, SerializesModels;

    public $user_name;
    public $user_email;
    public $ip_address;
    public $user_pin;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user_name,$user_email,$ip_address,$user_pin)
    {
        $this->user_name = $user_name;
        $this->user_email = $user_email;
        $this->ip_address = $ip_address;
        $this->user_pin = $user_pin;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Password Change Successfull')
            ->markdown('emails.update_password');
    }
}
