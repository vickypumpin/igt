<?php

use App\Models\Admin;
use App\Models\User;
use Laravolt\Avatar\Avatar;

function active_class( $routes ): string
{
    $routesArray = explode( ',', $routes );
    if ( in_array( \Request::route()->getName(), $routesArray ) ) {
        return 'active';
    } else {
        return '';
    }

}

function open_class( $routes ): string
{
    $routesArray = explode( ',', $routes );
    if ( in_array( \Request::route()->getName(), $routesArray ) ) {
        return 'open';
    } else {
        return '';
    }
}

function show_class( $routes ): string
{
    $routesArray = explode( ',', $routes );
    if ( in_array( \Request::route()->getName(), $routesArray ) ) {
        return 'show';
    } else {
        return '';
    }
}


function get_admin_image($admin_id): string
{
    $admin = Admin::find($admin_id);
    $img_src = '';
    if ($admin){
        if(!$admin->getMedia('admin-profile-image')->isEmpty()){
            $img_src = asset($admin->getMedia('admin-profile-image')->first()->getUrl());
        }else{
            $img_src =( new Avatar() )->create( ucwords( $admin->name ) )->setBackground('#127CBF')->toBase64() ;
        }
    }
    return $img_src ;
}

function get_user_image($user_id): string
{
    $user = User::find($user_id);
    $img_src = '';
    if ($user){
        if(!$user->getMedia('user-profile-image')->isEmpty()){
            $img_src = asset($user->getMedia('user-profile-image')->first()->getUrl());
        }else{
            $name = $user->first_name .' '.$user->last_name;
            $img_src =( new Avatar() )->create( ucwords( $name  ) )->setBackground('#127CBF')->toBase64() ;
        }
    }
    return $img_src ;
}

function calculate_age($trender): string
{
    $dateOfBirth = $trender->dob;
    $today = date("Y-m-d");
    $diff = date_diff(date_create($dateOfBirth), date_create($today));
    return $diff->format('%y');
}

function get_name_first_letters($letters){
    $words = explode(" ", $letters);
    $acronym = "";
    foreach ($words as $w) {
        $acronym .= ucwords(mb_substr($w, 0, 1));
    }
    return $acronym;
}


