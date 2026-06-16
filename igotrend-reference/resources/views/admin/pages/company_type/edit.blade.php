{{-- Extends layout --}}
@extends('admin.layout.dashboard')
@section('title','Edit Company Type')
@section('page_title','Edit Company Type')
@section('page_route','Settings / Company Types / Edit Company type')
{{-- Content --}}
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <form method="post" action="{{route('company-type.update',$type)}}" enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input type="text"  name="name" class="form-control @error('name') is-invalid @enderror" id="name"  placeholder="name" value="{{old('name') ? old('name') : $type->name }}">
                                    @error('name')
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

