<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $superAdminRole = Role::create( ['name' => 'SuperAdmin','guard_name' => 'admin'] );
        $superAdmin = new Admin();
        $superAdmin->name = 'Super Admin';
        $superAdmin->email = 'superadmin@igoTrend.com';
        $superAdmin->password = Hash::make( '12345678' );
        $superAdmin->save();
        $superAdmin->assignRole( 'SuperAdmin' );
        $superAdminRole->givePermissionTo( Permission::all() );

    }
}
