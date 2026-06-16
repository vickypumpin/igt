<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubmissionRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $user_name;
    public $campaign_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user_name,$campaign_name)
    {
        $this->user_name = $user_name;
        $this->campaign_name = $campaign_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Submission Rejected')
            ->markdown('emails.submission_rejected');
    }
}
