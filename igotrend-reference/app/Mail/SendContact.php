<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendContact extends Mailable
{
    use Queueable, SerializesModels;

    public $user_name;
    public $company_email;
    public $company_phone;
    public $company_name;
    public $message;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user_name,$company_email,$company_phone,$company_name,$message)
    {
        $this->user_name = $user_name;
        $this->company_email= $company_email;
        $this->company_phone = $company_phone;
        $this->company_name = $company_name;
        $this->message= $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Igotrend Contact')
            ->markdown('emails.send_contact');
    }
}
