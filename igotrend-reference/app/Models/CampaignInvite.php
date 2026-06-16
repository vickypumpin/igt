<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignInvite extends Model
{
    use HasFactory;

    CONST PENDING = '0';
    CONST ACTIVE = '1';
    CONST DECLINE = '2';
    CONST COMPLETED = '3';

    protected $guarded = [];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class,'campaign_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
