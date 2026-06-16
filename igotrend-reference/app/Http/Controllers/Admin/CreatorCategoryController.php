<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreatorCategory;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class CreatorCategoryController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()){
            $content_categories = CreatorCategory::orderBy('id', 'DESC');
            return DataTables::of($content_categories)
                ->addColumn('actions', function ($category){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('update creator category')){
                        $html .= '<a href="'.route("creator-category.edit",$category).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-pencil-alt"></i>
                            </a>';
                    }
                    if (auth()->guard('admin')->user()->can('delete creator category')){
                        $html .= '<a href="'.route("creator-category.destroy",$category).'" class="btn btn-danger btn-sm">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }
                    return $html .'</div>';
                })
                ->addColumn('image', function ($category){
                    if(!$category->getMedia('creator-category-image')->isEmpty()){
                        return '<img src="'. asset($category->getMedia('creator-category-image')->first()->getUrl()).'" width="50px" height="50px">';
                    }
                })
                ->rawColumns(['actions','image'])
                ->make(true);
        }
        return view('admin.pages.creator_categories.index');
    }
    public function create()
    {
        return view('admin.pages.creator_categories.create');
    }
    public function store(Request  $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'creator_category_image' => 'sometimes|image|mimes:jpeg,jpg,png',
        ]);

        if (! $request->file('creator_category_image')){
           CreatorCategory::create([
                'name' => $request->name,
            ]);
        }else{
            $staff = CreatorCategory::create([
                'name' => $request->name,
            ]);
            $staff->addMedia($request->file('creator_category_image'))->toMediaCollection('creator-category-image');
        }

        return redirect()->route('creator-categories')->with('success','Creator Category Added Successfully');
    }






    public function destroy(CreatorCategory $creator_category)
    {
        CreatorCategory::destroy($creator_category->id);
        return redirect()->route('creator-categories')->with('success','Creator Category deleted Successfully');
    }
    public function edit(CreatorCategory $creator_category)
    {
        return view('admin.pages.creator_categories.edit',compact('creator_category'));
    }
    public function update(Request $request,CreatorCategory $creator_category)
    {
        $request->validate([
            'name' => 'required|max:255',
            'creator_category_image' => 'sometimes|image|mimes:jpeg,jpg,png',
        ]);

        if (!$request->file('creator_category_image')){
            $creator_category->update([
                'name' => $request->name,
            ]);
        }else{
            $creator_category->update([
                'name' => $request->name,
            ]);

            $media = $creator_category->getMedia('creator-category-image');
            if (!$media->isEmpty()){
                $media->first()->delete();
                $creator_category->addMedia($request->file('creator_category_image'))
                    ->toMediaCollection('creator-category-image');
            }else{
                $creator_category->addMedia($request->file('creator_category_image'))->toMediaCollection('creator-category-image');
            }
        }

        return redirect()->route('creator-categories')->with('success','Content Category updated Successfully');
    }
}
