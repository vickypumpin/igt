<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMessage extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function from()
    {
        return $this->belongsTo(User::class,'from_user');
    }

    public function to()
    {
        return $this->belongsTo(User::class,'to_user');
    }
}
