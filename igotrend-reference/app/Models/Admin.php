<?php

namespace App\Models;

use App\Notifications\AdminResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

class Admin  extends Authenticatable implements HasMedia
{
    use HasFactory,HasRoles,InteractsWithMedia,Notifiable;

    CONST LOGIN = 1;
    CONST LOGOUT = 0;

    protected $guarded = [];

    protected $guard_name = 'admin';

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('admin-profile-image');
    }

    public function sendPasswordResetNotification($token){

        $this->notify(new AdminResetPasswordNotification($token));
    }
}
