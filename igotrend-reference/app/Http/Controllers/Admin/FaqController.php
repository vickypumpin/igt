<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()){
            $faqs = Faq::orderBy('id', 'DESC');
            return DataTables::of($faqs)
                ->addColumn('actions', function ($faq){
                    $html = '<div class="btn-group btn-group-sm">';
                    if (auth()->guard('admin')->user()->can('update faq')){
                        $html .= '<a href="'.route("faq.edit",$faq).'" class="btn btn-accent btn-sm">
                                <i class="fa fa-pencil-alt"></i>
                            </a>';
                    }
                    if (auth()->guard('admin')->user()->can('delete faq')){
                        $html .= '<a href="'.route("faq.destroy",$faq).'" class="btn btn-danger btn-sm">
                                <i class="fa fa-trash"></i>
                            </a>';
                    }
                    return $html .'</div>';
                })
                ->editColumn('question', function ($faq){
                    return Str::limit($faq->question,30);
                })
                ->editColumn('answer', function ($faq){
                    return Str::limit($faq->answer,30);
                })
                ->rawColumns(['actions'])
                ->make(true);
        }
        return view('admin.pages.faq.index');
    }

    public function create()
    {
        return view('admin.pages.faq.create');
    }

    public function save (Request $request)
    {
        Faq::create([
            'question' => $request->faq_question ,
            'answer' => $request->faq_answer ,
        ]);
        return redirect()->route('faqs')->with('success','Faq Added Successfully');
    }

    public function edit (Faq $faq)
    {
        return view('admin.pages.faq.edit',compact('faq'));
    }

    public function update (Request $request,Faq $faq)
    {
         $faq->update([
             'question' => $request->faq_question ,
             'answer' => $request->faq_answer ,
         ]);
        return redirect()->route('faqs')->with('success','Faq Updated Successfully');
    }

    public function delete (Faq $faq)
    {
        Faq::destroy($faq->id);
        return redirect()->back()->with('success','Faq Deleted Successfully');
    }
}
