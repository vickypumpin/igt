<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class User extends Authenticatable implements HasMedia,MustVerifyEmail
{
    use HasFactory, Notifiable,InteractsWithMedia,SoftDeletes;

    CONST BRAND = "1";
    CONST CREATOR = "2";

    CONST ACTIVE = "1";
    CONST IN_ACTIVE = "0";

    CONST LOCKED = "1";
    CONST UN_LOCKED = "0";

    CONST PAYMENT_INFO_LOCKED = "1";
    CONST PAYMENT_INFO_UN_LOCKED = "0";

    CONST ACCOUNT_INFO_LOCKED = "1";
    CONST ACCOUNT_INFO_UN_LOCKED = "0";

    CONST MALE = "1";
    CONST FE_MALE = "2";

    CONST LOGIN = 1;
    CONST LOGOUT = 0;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
     protected $guarded = [];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = [
        'content_category_name',
        'creator_category_name',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('user-profile-image');
    }

    public function country()
    {
       return $this->belongsTo(Country::class,'country_id');
    }

    public function state()
    {
       return $this->belongsTo(State::class,'state_id');
    }
    public function companyType()
    {
       return $this->belongsTo(CompanyType::class,'company_type');
    }

    public function getContentCategoryNameAttribute() {
        if (is_null($this->content_category)){
            return null;
        }else{
            $items = ContentCategory::whereIn( 'id', explode( ',', $this->content_category))->get();
            return $items->pluck( 'name' );
        }
    }

    public function getCreatorCategoryNameAttribute() {
        if (is_null($this->creator_category)){
            return null;
        }else{
            $items = CreatorCategory::whereIn( 'id', explode( ',', $this->creator_category))->get();
            return $items->pluck( 'name' );
        }
    }

    public static function get_user_level($user)
    {
        if ($user->badge == "nano"){
            return 1;
        }elseif ($user->badge == "micro"){
            return 2;
        }elseif ($user->badge == "mid_tier"){
            return 3;
        }elseif ($user->badge == "macro"){
            return 4;
        }elseif ($user->badge == "mega"){
            return 5;
        }elseif ($user->badge == "elite"){
            return 6;
        }else{
            return '';
        }
    }
}
