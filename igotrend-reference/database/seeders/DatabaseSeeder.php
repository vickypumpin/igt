<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // User::factory(10)->create();
        $this->call( SettingSeeder::class );
        $this->call( PermissionTableSeeder::class );
        $this->call( AdminTableSeeder::class );
        $this->call( CountryStateSeeder::class );
        $this->call( BrandSeeder::class );
        $this->call( FaqSeeder::class );
        $this->call( BankNameSeeder::class );
    }
}
