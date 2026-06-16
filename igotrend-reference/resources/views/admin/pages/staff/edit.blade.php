{{-- Extends layout --}}
@extends('admin.layout.dashboard')
@section('title','Edit Staff')
@section('page_title','Edit Staff')
@section('page_route','Account Mgt / Staffs / Edit Staff')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link @if($passwordTab == "false")  active @endif" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Profile Info</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link @if($passwordTab == "true")  active @endif" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Change Password</a>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade @if($passwordTab == "false") show  active @endif" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="card">
                        <div class="card-body">
                            <form method="post" action="{{route('staff.update-profile-info',$staff)}}" enctype="multipart/form-data">
                                @csrf
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="name">Name</label>
                                            <input type="text"  name="name" class="form-control @error('name') is-invalid @enderror" id="name" value="{{$staff->name}}" placeholder="name">
                                            @error('name')
                                            <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="email">Email </label>
                                            <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" id="email" value="{{$staff->email}}" placeholder="email">
                                            @error('email')
                                            <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="role">Role</label>
                                            <select id="role" class="form-control select2-single @error('role') is-invalid @enderror" name="role" >
                                                @foreach($roles as $role)
                                                    <option value="{{$role->id}}" {{collect($staff->getRoleNames())->contains($role->name) ? 'selected' : '' }} >{{$role->name}}</option>
                                                @endforeach
                                            </select>
                                            @error('role')
                                            <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label >Profile Image</label>
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="profileImage" name="profile_image" >
                                            <label class="custom-file-label profileImageLabel" for="profileImage">Profile Image</label>
                                            @error('profile_image')
                                            <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group mt-3">
                                    <button class="btn btn-accent float-right" type="submit">Update Info</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade  @if($passwordTab == "true") show  active @endif" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <div class="card">
                        <div class="card-body">
                            <form method="post" action="{{route('staff.update-password',$staff)}}">
                                @csrf
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="newPassword">New Password</label>
                                            <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" id="newPassword" placeholder="new password">
                                            @error('password')
                                            <span class="invalid-feedback" role="alert">
                                                                <strong>{{ $message }}</strong>
                                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="confirmPassword">Confirm Password </label>
                                            <input type="password" name="password_confirmation" class="form-control" id="confirmPassword" placeholder="confirm password">
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-accent float-right" type="submit">Update Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script>
        $('#profileImage').on('change',function(){
            //get the file name
            const fileName = document.getElementById("profileImage").value;
            var filename=fileName.replace(/^.*[\\\/]/, '');
            if (filename.length < 40){
                $( ".profileImageLabel" ).text(filename);
            }else {
                $( ".profileImageLabel" ).text(filename.substr(filename.length - 44));
            }
        })
    </script>
@endpush
