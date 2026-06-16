@extends('admin.layout.dashboard')
@section('title','Role Create')
@section('page_title','Role Create')
@section('page_route','Roles / Role Create')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <form method="post" action="{{route('roleAdd')}}">
                @csrf
                <div class="list-group list-group-form">
                    <div class="list-group-item">
                        <div class="form-group row mb-0">
                            <div class="col-sm-12">
                                <label for="name">Role Name</label>
                                <input id="name" name="name" type="text" class="form-control @error('name') is-invalid @enderror "  placeholder="role name">
                                @error('name')
                                <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <button type="submit" class="btn btn-accent float-right">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection
