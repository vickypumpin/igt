<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyType;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class CompanyTypeController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()){
            $company_types = CompanyType::orderBy('id', 'DESC');
            return DataTables::of($company_types)
                ->addColumn('actions', function ($type){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('update company type')){
                        $html .= '<a href="'.route("company-type.edit",$type).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-pencil-alt"></i>
                            </a>';
                    }
                    if (auth()->guard('admin')->user()->can('delete company type')){
                        $html .= '<a href="'.route("company-type.destroy",$type).'" class="btn btn-danger btn-sm">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }
                    return $html .'</div>';
                })
                ->rawColumns(['actions'])
                ->make(true);
        }
        return view('admin.pages.company_type.index');
    }
    public function create()
    {
        return view('admin.pages.company_type.create');
    }
    public function store(Request  $request)
    {
        $request->validate([
            'name' => 'required|max:255'
        ]);
        CompanyType::create([
            'name' => $request->name
        ]);
        return redirect()->route('company-types')->with('success','Company type Added Successfully');
    }
    public function destroy(CompanyType $type)
    {
        CompanyType::destroy($type->id);
        return redirect()->route('company-types')->with('success','Company type deleted Successfully');
    }
    public function edit(CompanyType $type)
    {
        return view('admin.pages.company_type.edit',compact('type'));
    }
    public function update(Request $request,CompanyType $type)
    {
        $request->validate([
            'name' => 'required|max:255'
        ]);
        $type->update([
            'name' => $request->name
        ]);
        return redirect()->route('company-types')->with('success','Company type updated Successfully');
    }
}
