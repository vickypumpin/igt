<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Yajra\DataTables\DataTables;

class RoleController extends Controller
{

    public function index(Request $request)
    {
        if($request->ajax()){
            $roles = Role::orderBy('id','DESC');
            return DataTables::of($roles)
                ->editColumn('name', function ($row){
                    return ucwords($row->name);
                })
                ->addColumn('action', function ($role){

                    $html = '<div class="btn-group btn-group-sm">';

                    if (auth()->guard('admin')->user()->can('update staff')){
                        $html .= '<a href="'.route("roleEdit",$role).'" class="btn btn-accent">
                                <i class="fa fa-pencil-alt"></i>
                            </a>';
                    }
                    if (auth()->guard('admin')->user()->can('delete staff')){
                        $html .= '<a href="'.route("roleDelete",$role).'" class="btn btn-danger">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }
                    return $html .'</div>';
                })
                ->rawColumns(['action'])
                ->make(true);
        }
        return view('admin.pages.role.index');
    }

    public function create()
    {
        return view('admin.pages.role.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name'
        ]);
        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'admin',
        ]);
        return redirect()->route('userPermission', $role)->with('success','Role Added Successfully');
    }

    public function edit(Role $role){

        return view('admin.pages.role.edit', compact('role'));

    }

    public function destroy(Role $role){
        $role->delete();
        return redirect()->route('roles')->with('success','Role Deleted Successfully');

    }

    public function update(Request $request,Role $role){

        $data = $request->validate([
            'name' => 'required'
        ]);
        $role->update($data);
        return redirect()->route('roles')->with('success','Role Updated Successfully');
    }
}
