<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $guarded = [];

    CONST READ = 1;
    CONST UN_READ = 0;


    public static function create_record($user_id,$type,$message){
       self::create([
          'user_id' => $user_id,
          'type' => $type,
          'message' => $message,
          'is_read' => Notification::UN_READ,
       ]);
    }
}
