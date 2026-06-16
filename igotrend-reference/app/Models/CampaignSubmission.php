<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignSubmission extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    CONST REVIEW = '0';
    CONST APPROVED = '1';
    CONST REJECT = '2';

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class,'campaign_id');
    }

}
