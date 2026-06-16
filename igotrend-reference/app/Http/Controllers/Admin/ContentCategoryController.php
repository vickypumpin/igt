<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentCategory;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class ContentCategoryController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()){
            $content_categories = ContentCategory::orderBy('id', 'DESC');
            return DataTables::of($content_categories)
                ->addColumn('actions', function ($category){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('update content category')){
                        $html .= '<a href="'.route("content-category.edit",$category).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-pencil-alt"></i>
                            </a>';
                    }
                    if (auth()->guard('admin')->user()->can('delete content category')){
                        $html .= '<a href="'.route("content-category.destroy",$category).'" class="btn btn-danger btn-sm">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }
                    return $html .'</div>';
                })
                ->addColumn('image', function ($category){
                    if(!$category->getMedia('content-category-image')->isEmpty()){
                        return '<img src="'. asset($category->getMedia('content-category-image')->first()->getUrl()).'" width="50px" height="50px">';
                    }
                })
                ->rawColumns(['actions','image'])
                ->make(true);
        }
        return view('admin.pages.content_categories.index');
    }
    public function create()
    {
        return view('admin.pages.content_categories.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'content_category_image' => 'sometimes|image|mimes:jpeg,jpg,png',
        ]);

        if ($request->file('content_category_image')){

            $staff = ContentCategory::create([
                'name' => $request->name,
            ]);
            $staff->addMedia($request->file('content_category_image'))->toMediaCollection('content-category-image');
        }else{
            ContentCategory::create([
                'name' => $request->name,
            ]);
        }
        return redirect()->route('content-categories')->with('success','Content Category Added Successfully');
    }


    public function destroy(ContentCategory $content_category)
    {
        ContentCategory::destroy($content_category->id);
        return redirect()->route('content-categories')->with('success','Content Category deleted Successfully');
    }
    public function edit(ContentCategory $content_category)
    {
        return view('admin.pages.content_categories.edit',compact('content_category'));
    }
    public function update(Request $request,ContentCategory $content_category)
    {
         $request->validate([
             'name' => 'required|max:255',
             'content_category_image' => 'sometimes|image|mimes:jpeg,jpg,png',
         ]);

        if ($request->file('content_category_image')){


            $content_category->update([
                'name' => $request->name,
            ]);
            $media = $content_category->getMedia('content-category-image');
            if (!$media->isEmpty()){
                $media->first()->delete();
                $content_category->addMedia($request->file('content_category_image'))
                    ->toMediaCollection('content-category-image');
            }else{
                $content_category->addMedia($request->file('content_category_image'))->toMediaCollection('content-category-image');
            }
        }else{
            $content_category->update([
                'name' => $request->name,
            ]);
        }



        return redirect()->route('content-categories')->with('success','Content Category updated Successfully');
    }
}
