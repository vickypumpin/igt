<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;



class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /// Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        // role
        Permission::create(['name' => 'create role','guard_name' => 'admin']);
        Permission::create(['name' => 'view role','guard_name' => 'admin']);
        Permission::create(['name' => 'delete role','guard_name' => 'admin']);
        Permission::create(['name' => 'update role','guard_name' => 'admin']);

        // staffs
        Permission::create(['name' => 'create staff','guard_name' => 'admin']);
        Permission::create(['name' => 'view staff','guard_name' => 'admin']);
        Permission::create(['name' => 'delete staff','guard_name' => 'admin']);
        Permission::create(['name' => 'update staff','guard_name' => 'admin']);

        //   users
        Permission::create(['name' => 'view users','guard_name' => 'admin']);
        Permission::create(['name' => 'change status','guard_name' => 'admin']);
        Permission::create(['name' => 'change locked status','guard_name' => 'admin']);
        Permission::create(['name' => 'edit user info','guard_name' => 'admin']);
        Permission::create(['name' => 'delete user','guard_name' => 'admin']);
        Permission::create(['name' => 'restore user','guard_name' => 'admin']);


        // setting
        Permission::create(['name' => 'settings','guard_name' => 'admin']);
        Permission::create(['name' => 'mail setting','guard_name' => 'admin']);
        Permission::create(['name' => 'site setting','guard_name' => 'admin']);

        // content categories
        Permission::create(['name' => 'create content category','guard_name' => 'admin']);
        Permission::create(['name' => 'view content category','guard_name' => 'admin']);
        Permission::create(['name' => 'delete content category','guard_name' => 'admin']);
        Permission::create(['name' => 'update content category','guard_name' => 'admin']);

        // creator categories
        Permission::create(['name' => 'create creator category','guard_name' => 'admin']);
        Permission::create(['name' => 'view creator category','guard_name' => 'admin']);
        Permission::create(['name' => 'delete creator category','guard_name' => 'admin']);
        Permission::create(['name' => 'update creator category','guard_name' => 'admin']);

        // company type
        Permission::create(['name' => 'create company type','guard_name' => 'admin']);
        Permission::create(['name' => 'view company type','guard_name' => 'admin']);
        Permission::create(['name' => 'delete company type','guard_name' => 'admin']);
        Permission::create(['name' => 'update company type','guard_name' => 'admin']);

        // legal page
        Permission::create(['name' => 'create legal page','guard_name' => 'admin']);
        Permission::create(['name' => 'view legal page','guard_name' => 'admin']);
        Permission::create(['name' => 'delete legal page','guard_name' => 'admin']);
        Permission::create(['name' => 'update legal page','guard_name' => 'admin']);

        // faqs
        Permission::create(['name' => 'create faq','guard_name' => 'admin']);
        Permission::create(['name' => 'view faq','guard_name' => 'admin']);
        Permission::create(['name' => 'delete faq','guard_name' => 'admin']);
        Permission::create(['name' => 'update faq','guard_name' => 'admin']);

    }
}
