@extends('admin.layout.dashboard')
@section('title','Edit Account')
@section('page_title','Account')
@section('page_route','Account / Edit Account')
@section('content')
    <div class="container-fluid page__container">
        <form action="{{route('admin_account_update_info',auth()->guard('admin')->user())}}" method="post" enctype="multipart/form-data">
            @csrf
            <div class="row">
                <div class="col-lg-9 pr-lg-0">
                    <div class="page-section">
                        <div class="list-group list-group-form">
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Name</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="name" class="form-control @error('name') is-invalid @enderror"  placeholder="name" value="{{auth()->guard('admin')->user()->name}}">
                                        @error('name')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Email</label>
                                    <div class="col-sm-9">
                                        <input type="email" name="email" class="form-control @error('email') is-invalid @enderror"  placeholder="email" value="{{auth()->guard('admin')->user()->email}}">
                                        @error('email')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Phone</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="phone_no" class="form-control  @error('phone_no') is-invalid @enderror" value="{{auth()->guard('admin')->user()->phone_no}}" placeholder="NG phone: (234) 803-000-0000" >
                                        @error('phone_no')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Gender</label>
                                    <div class="col-sm-9">
                                        <select id="custom-select" class="form-control custom-select  @error('gender') is-invalid @enderror" name="gender">
                                            <option value="">Choose Gender</option>
                                            <option value="male" @if(auth()->guard('admin')->user()->gender == "male") selected @endif>Male</option>
                                            <option value="female" @if(auth()->guard('admin')->user()->gender == "female") selected @endif>Female</option>
                                            @error('gender')
                                            <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3">Your photo</label>
                                    <div class="col-sm-9 media align-items-center">
                                        <a href="" class="media-left mr-16pt">
                                            <img src="{{get_admin_image(auth()->guard('admin')->user()->id)}}" alt="{{auth()->guard('admin')->user()->name}}" width="60" height="60"  class="rounded-circle">
                                        </a>
                                        <div class="media-body">
                                            <div class="custom-file">
                                                <input type="file" class="custom-file-input  @error('profile_image') is-invalid @enderror" id="profileImage" name="profile_image"  accept="image/*">
                                                <label class="custom-file-label profileImageLabel" for="profileImage">Profile Image</label>
                                                <small class="form-text text-muted">Note: JPG, JPEG, PNG supported.</small>
                                                @error('profile_image')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-lg-3 page-nav">
                    <div class="page-section pt-lg-112pt">
                        <nav class="nav page-nav__menu">
                            <a class="nav-link {{ active_class('admin_edit_account') }}" href="{{route('admin_edit_account')}}">Basic Information</a>
                            <a class="nav-link {{ active_class('admin_edit_password') }}" href="{{route('admin_edit_password')}}">Change Password</a>
                        </nav>
                        <div class="page-nav__content">
                            <button type="submit" class="btn btn-accent">Update Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection
@push('page-scripts')
    <script>
        $('#profileImage').on('change',function(){
            //get the file name
            const fileName = document.getElementById("profileImage").value;
            var filename=fileName.replace(/^.*[\\\/]/, '');
            if (filename.length === 34){
                $( ".profileImageLabel" ).text(filename);
            }else {
                $( ".profileImageLabel" ).text(filename.substr(filename.length - 37));
            }
        })
    </script>
@endpush
