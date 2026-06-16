<?php

namespace Database\Seeders;

use App\Models\BankName;
use Illuminate\Database\Seeder;
use KingFlamez\Rave\Facades\Rave as Flutterwave;

class BankNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $banks = Flutterwave::banks()->nigeria();

        foreach ($banks['data'] as $bank){
            BankName::create([
                'name' =>  $bank['name'],
                'code' => $bank['code']
            ]);
        }
    }
}
