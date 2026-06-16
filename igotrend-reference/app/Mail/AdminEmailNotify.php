<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminEmailNotify extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $message;
    public $from_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($subject,$message,$from_name)
    {
        $this->subject = $subject;
        $this->message = $message;
        $this->from_name = $from_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $from_email = getenv('MAIL_FROM_ADDRESS');
        return $this
            ->subject($this->subject)
            ->from($from_email,$this->from_name)
            ->markdown('emails.admin_email_notify');
    }
}
