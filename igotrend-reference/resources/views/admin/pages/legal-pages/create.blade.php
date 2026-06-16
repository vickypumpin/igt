{{-- Extends layout --}}
@extends('admin.layout.dashboard')
@section('title','Add Legal Page')
@section('page_title','Add Legal Page')
@section('page_route','Settings / Legal Pages / Add Legal Page')
{{-- Content --}}
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <form method="post" action="{{route('legal-page.store')}}" enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="page_name">Page Name</label>
                                    <input type="text"  name="page_name" class="form-control @error('page_name') is-invalid @enderror" id="page_name"  placeholder="page name" value="{{old('page_name')}}">
                                    @error('page_name')
                                    <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="page_description">Page Description</label>
                                    <input type="text"  name="page_description" class="form-control @error('page_description') is-invalid @enderror" id="page_name"  placeholder="page description" value="{{old('page_description')}}">
                                    @error('page_description')
                                    <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="page_content">Page Content</label>
                                    <textarea  name="page_content" class="form-control @error('page_content') is-invalid border-dark @enderror summernote" id="page_content"></textarea>
                                    @error('page_content')
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
@push('page-scripts')
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
    <script>
        $('.summernote').summernote({
            placeholder: 'page content',
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', [ 'help']],
            ]
        });
    </script>

@endpush

