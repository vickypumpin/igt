<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GemPayment extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function trender()
    {
        return $this->belongsTo(User::class,'trender_id');
    }
}
