{{-- Extends layout --}}
@extends('admin.layout.dashboard')
@section('title','Add Staff')
@section('page_title','Add Staff')
@section('page_route','Account Mgt / Staffs / Add Staff')
{{-- Content --}}
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <form method="post" action="{{route('staff.store')}}" enctype="multipart/form-data">
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
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="email">Email </label>
                                    <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" id="email"  placeholder="email" value="{{old('email')}}">
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
                                    <select id="role" class="form-control  @error('role') is-invalid @enderror" name="role">
                                        @foreach($roles as $role)
                                            <option value="{{$role->id}}" {{collect(old('role'))->contains($role->id) ? 'selected' : '' }} >{{$role->name}}</option>
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
                                <div class="form-group">
                                    <label for="newPassword">Password</label>
                                    <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" id="newPassword" placeholder="password">
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
                            <div class="col-6">
                                <label >Profile Image</label>
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="profileImage" name="profile_image"  accept="image/*">
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
                            <button class="btn btn-accent float-right" type="submit">Save</button>
                        </div>
                    </form>
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

