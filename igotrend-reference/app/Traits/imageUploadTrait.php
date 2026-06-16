<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Support\Str;

trait imageUploadTrait
{

    public function uploadFile($request,$fileName,$folderName)
    {
        $image = $request->file($fileName);
        $name = $image->getClientOriginalName();
        $extension = $image->getClientOriginalExtension();
        $slug = uniqid() . '-' . Str::slug($name);
        $image_name = $slug . '-' . Carbon::now()->toDateString() .'.'.$extension;
        $image->storeAs('public/'.$folderName,$image_name);
        return $image_name;
    }

}
