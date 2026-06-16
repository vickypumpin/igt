<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CreatorCampaignRequest extends Mailable
{
    use Queueable, SerializesModels;

    public  $trender_name;
    public  $brand_user_name;
    public  $company_name;
    public  $campaign_name;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($trender_name,$brand_user_name,$company_name,$campaign_name)
    {
        $this->trender_name = $trender_name;
        $this->brand_user_name = $brand_user_name;
        $this->company_name = $company_name;
        $this->campaign_name = $campaign_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Advertiser Campaign Request')
            ->markdown('emails.creator_campaign_request');
    }
}
