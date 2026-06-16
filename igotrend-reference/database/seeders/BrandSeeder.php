<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
           'first_name' => 'Igotrend' ,
           'last_name' => 'Company',
           'phone' => '+1 (111) 419-6366',
           'country_id' => 132,
           'role' => 1,
           'gender' => 1,
           'user_name' => 'igotrend',
           'password' => Hash::make('123456'),
           'company_name' => 'Igotrend',
           'company_size' => '100+',
           'company_type' => 1,
           'email' => 'igotrend@gmail.com',
           'email_verified_at' => Carbon::now(),
            'pin' => $this->generatePin(),
        ]);
    }


    function generatePin() {
        $number = rand(1231,7879);
        if (self::checkPin($number)) {
            return self::generatePin();
        }
        return $number;
    }

    function checkPin($number) {
        return User::where('pin',$number)->exists();
    }
}
