<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Yajra\DataTables\DataTables;

class PermissionController extends Controller
{
    public function index(Request $request){
        if($request->ajax()){
            $permissions = Permission::orderBy('id','Desc');
            return DataTables::of($permissions)
                ->editColumn('name', function ($row){
                    return ucwords($row->name);
                })
                ->make(true);
        }
        return view('admin.pages.permission.index');
    }

    public function permissions(Role $role){
        return view('admin.pages.permission.permissions',[
            'role' => $role
        ]);
    }

    public function assignPermissions(Request $request,Role $role)
    {
        $role->givePermissionTo($request->permissions);
        return redirect()->route('roles')->with('success','Permissions Assign Role Successfully');
    }

    public function updateRolePermissions(Request $request,Role $role)
    {
        $role->syncPermissions($request->permissions);
        return redirect()->route('roles')->with('success','Role Permissions Updated Successfully');
    }

}
