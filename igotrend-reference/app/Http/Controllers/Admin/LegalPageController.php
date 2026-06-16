<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegalPage;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class LegalPageController extends Controller
{

    public function index(Request $request)
    {
        if ($request->ajax()){
            $legal_pages = LegalPage::orderBy('id', 'DESC');
            return DataTables::of($legal_pages)
                ->addColumn('actions', function ($page){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('update legal page')){
                        $html .= '<a href="'.route("legal-page.edit",$page).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-pencil-alt"></i>
                            </a>';
                    }
                    if (auth()->guard('admin')->user()->can('delete legal page')){
                        $html .= '<a href="'.route("legal-page.destroy",$page).'" class="btn btn-danger btn-sm">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }
                    return $html .'</div>';
                })
                ->rawColumns(['actions'])
                ->make(true);
        }
        return view('admin.pages.legal-pages.index');
    }

    public function create()
    {
        return view('admin.pages.legal-pages.create');
    }

    public function save(Request $request)
    {
        $request->validate([
           'page_name' => 'required|max:50',
           'page_description' => 'required|max:200',
           'page_content' => 'required',
        ]);
        LegalPage::create([
            'name' => $request->page_name,
            'description' =>  $request->page_description,
            'slug' =>  $this->slugify($request->page_name),
            'content' =>  $request->page_content,
        ]);
        return redirect()->route('legal-pages')->with('success','Legal Page Added Successfully');
    }

    public function edit(LegalPage $page)
    {
        return view('admin.pages.legal-pages.edit',compact('page'));
    }

    public function update(Request $request,LegalPage $page)
    {
        $request->validate([
            'page_name' => 'required|max:50',
            'page_description' => 'required|max:200',
            'page_content' => 'required',
        ]);
        $page->update([
            'name' => $request->page_name,
            'description' =>  $request->page_description,
            'slug' =>  $this->slugify($request->page_name),
            'content' =>  $request->page_content,
        ]);
        return redirect()->route('legal-pages')->with('success','Legal Page Updated Successfully');
    }

    public function delete(LegalPage $page)
    {
        LegalPage::destroy($page->id);
        return redirect()->route('legal-pages')->with('success','Legal Page Deleted Successfully');
    }


    function slugify($str, $delimiter = '-')
    {
        return strtolower(trim(preg_replace('/[\s-]+/', $delimiter, preg_replace('/[^A-Za-z0-9-]+/', $delimiter, preg_replace('/[&]/', 'and', preg_replace('/[\']/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $str))))), $delimiter));
    }

}
