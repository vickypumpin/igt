<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\State;
use Illuminate\Database\Seeder;

class CountryStateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $string = file_get_contents(public_path().'/'.'countries-states.json');
        $countries_json = json_decode($string,true);
        foreach ($countries_json['countries'] as  $country){
            $country_rec =  Country::create([
                "name" => $country['country']
            ]);
            foreach ($country['states'] as $key => $state){
                State::create([
                    'name'  => $state,
                    'country_id'  => $country_rec->id
                ]);
            }
        }
    }
}
