{{-- Extends layout --}}
@extends('admin.layout.dashboard')
@section('title','Edit Faq')
@section('page_title','Edit Faq')
@section('page_route','FAQS / Edit Faq')
{{-- Content --}}
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <form method="post" action="{{route('faq.update',$faq)}}" enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="faq_question">Faq Question</label>
                                    <input type="text"  name="faq_question" class="form-control @error('faq_question') is-invalid @enderror" id="faq_question"  placeholder="faq question" value="{{old('faq_question') ? old('faq_question') : $faq->question}}" required>
                                    @error('faq_question')
                                    <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="faq_answer">Faq Answer</label>
                                    <textarea  name="faq_answer" class="form-control @error('faq_answer') is-invalid border-dark @enderror" id="faq_answer" placeholder="faq answer" required>{{old('faq_answer') ? old('faq_answer') : $faq->answer}}</textarea>
                                    @error('faq_answer')
                                    <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-3">
                            <button class="btn btn-accent float-right" type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

