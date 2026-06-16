<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\AddStaff;
use App\Http\Requests\UpdateStaff;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use Yajra\DataTables\DataTables;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        if($request->ajax()){
            $staffs = Admin::where('id', '!=', Auth::guard('admin')->user()->id)
                ->orderBy('id', 'DESC');
            return DataTables::of($staffs)
                ->addColumn('actions', function ($staff){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('update staff')){
                        $html .= '<a href="'.route("staff.edit",$staff).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-pencil-alt"></i>
                            </a>';
                    }
                    if (auth()->guard('admin')->user()->can('delete staff')){
                        $html .= '<a href="'.route("staff.destroy",$staff).'" class="btn btn-danger btn-sm">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }
                    return $html .'</div>';
                })
                ->addColumn('roles', function ($staff){
                    $roles =  $staff->getRoleNames();
                    $html = '';
                    foreach ($roles as $role){
                        $html .= '<span class="badge  badge-primary">'.$role.'</span> &nbsp;';
                    }
                    return $html;
                })
                ->rawColumns(['actions','roles'])
                ->make(true);
        }
        return view('admin.pages.staff.index');
    }

    public function create()
    {
        $roles = Role::all();
        return view('admin.pages.staff.create',[
            'roles' => $roles
        ]);
    }

    public function store(AddStaff $request)
    {
        if (!isset($request->profile_image)){
            $staff = Admin::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
            $staff->assignRole($request->role);

        }else{
            $staff = Admin::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
            $staff->assignRole($request->role);
            $staff->addMedia($request->file('profile_image'))->toMediaCollection('admin-profile-image');
        }

        return redirect()->route('staffs')->with('success','Staff Added Successfully');
    }

    public function destroy(Admin $staff)
    {
        $staff->delete();
        return redirect()->route('staffs')->with('success','Staff Deleted Successfully');
    }

    public function edit(Request $request,Admin $staff)
    {
        $passwordTab = isset($request->passwordTab) ? $request->passwordTab : 'false';
        $roles = Role::all();
        return view('admin.pages.staff.edit',[
            'staff' => $staff,
            'roles' => $roles,
            'passwordTab' => $passwordTab,

        ]);
    }

    public function updateProfileInfo(UpdateStaff $request,Admin $staff)
    {
        if (!isset($request->profile_image)){
            $staff->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);
            $staff->syncRoles($request->role);
        }else{
            $staff->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);
            $staff->syncRoles($request->role);
            $media = $staff->getMedia('admin-profile-image');
            if (!$media->isEmpty()){
                $media->first()->delete();
                $staff->addMedia($request->file('profile_image'))
                    ->toMediaCollection('admin-profile-image');
            }else{
                $staff->addMedia($request->file('profile_image'))->toMediaCollection('admin-profile-image');
            }
        }
        return redirect()->back()->with('success','Staff profile info updated successfully');

    }

    public function updatePassword(Request $request,Admin $staff)
    {
        $rules = array(
            'password' => 'required|string|confirmed|min:8',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->route('staff.edit',[$staff,'passwordTab=true'])->withErrors($validator);
        }

        $staff->update([
            'password' => Hash::make( $request->password ),
        ]);
        return redirect()->back()->with('success','Staff password updated successfully');
    }
}
