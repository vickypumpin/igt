{{-- Extends layout --}}
@extends('admin.layout.dashboard')
@section('title','Add Creator Category')
@section('page_title','Add Creator Category')
@section('page_route','Settings / Creator Categories / Add Creator Category')
{{-- Content --}}
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <form method="post" action="{{route('creator-category.store')}}" enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input type="text"  name="name" class="form-control @error('name') is-invalid @enderror" id="name"  placeholder="name" value="{{old('name')}}">
                                    @error('name')
                                    <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-12">
                                <label >Creator Category Image</label>
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="profileImage" name="creator_category_image"  accept="image/*">
                                    <label class="custom-file-label profileImageLabel" for="profileImage">Creator Category Image</label>
                                    @error('creator_category_image')
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

