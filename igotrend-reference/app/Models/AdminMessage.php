<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminMessage extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function admin_from()
    {
        return $this->belongsTo(Admin::class,'from_user');
    }

    public function admin_to()
    {
        return $this->belongsTo(Admin::class,'to_user');
    }

    public function user_from()
    {
        return $this->belongsTo(User::class,'from_user');
    }

    public function user_to()
    {
        return $this->belongsTo(User::class,'to_user');
    }
}
