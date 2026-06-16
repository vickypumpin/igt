
@extends('admin.layout.dashboard')
@section('title','Brand update info')
@section('page_title','Brand update info')
@section('page_route','Users / Brand update info')
@section('content')
    <div class="container-fluid page__container">
        <form action="{{ route('userUpdateInfo',$user) }}" method="post" enctype="multipart/form-data">
            @csrf
            <div class="row">
                <div class="col-lg-9 pr-lg-0">
                    <div class="page-section">
                        <div class="list-group list-group-form">
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">First name</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="first_name" class="form-control @error('first_name') is-invalid @enderror" value="{{$user->first_name}}" placeholder="first name" >
                                        @error('first_name')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Last name</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="last_name" class="form-control @error('last_name') is-invalid @enderror" value="{{$user->last_name}}" placeholder="last name" >
                                        @error('last_name')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Company name</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="company_name" class="form-control @error('company_name') is-invalid @enderror" value="{{$user->company_name}}" placeholder="company name" >
                                        @error('company_name')
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
                                        <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" value="{{$user->email}}" placeholder="email address" >
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
                                        <input type="text" name="phone" class="form-control @error('phone') is-invalid @enderror" value="{{$user->phone}}" placeholder="NG phone: (234) 803-000-0000" >
                                        @error('phone')
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
                                        <select id="custom-select" name="gender" class="form-control custom-select @error('gender') is-invalid @enderror" >
                                            <option selected value="">Choose Gender</option>
                                            <option value="1" @if($user->gender == "1") selected @endif>Male</option>
                                            <option value="2" @if($user->gender == "2") selected  @endif>Female</option>
                                        </select>
                                        @error('gender')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Company Size</label>
                                    <div class="col-sm-9">
                                        <select id="custom-select" class="form-control custom-select @error('company_size') is-invalid @enderror" name="company_size">
                                            <option selected value="">Choose Size</option>
                                            <option value="1-5" @if($user->company_size == "1-5") selected @endif>1 - 5</option>
                                            <option value="6-10" @if($user->company_size == "6-10") selected @endif>6 - 10</option>
                                            <option value="11-50" @if($user->company_size == "11-50") selected @endif>11-50</option>
                                            <option value="51-100" @if($user->company_size == "51-100") selected @endif>51-100</option>
                                            <option value="100+" @if($user->company_size == "100+") selected @endif>100+</option>
                                        </select>
                                        @error('company_size')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Company Type</label>
                                    <div class="col-sm-9">
                                        <select id="custom-select" class="form-control custom-select @error('company_type') is-invalid @enderror" name="company_type">
                                            <option selected value="">Choose Type</option>
                                            @foreach($company_types as $type)
                                                <option value="{{$type->id}}" @if($user->company_type == $type->id) selected @endif>{{$type->name}}</option>
                                            @endforeach
                                        </select>
                                        @error('company_type')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Country</label>
                                    <div class="col-sm-9">
                                        <select name="country" id="country" class="form-control custom-select @error('country') is-invalid @enderror"  data-url="{{route('getStates')}}">
                                            <option selected value="">Choose Country</option>
                                            @foreach($countries as $country)
                                                <option value="{{$country->id}}"  @if($user->country_id == $country->id) selected @endif>{{$country->name}}</option>
                                            @endforeach
                                        </select>
                                        @error('country')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">State</label>
                                    <div class="col-sm-9">
                                        <select name="state" id="state" class="form-control custom-select  @error('state') is-invalid @enderror" >
                                            <option selected value="">Choose State</option>
                                            @foreach($states as $state)
                                                <option value="{{$state->id}}"  @if($user->state_id == $state->id) selected @endif>{{$state->name}}</option>
                                            @endforeach
                                        </select>
                                        @error('state')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3">Your photo</label>
                                    <div class="col-sm-9 media align-items-center">
                                        <a href="" class="media-left mr-16pt">
                                            <img src="{{get_user_image($user->id)}}" alt="{{$user->name}}" width="60" height="60"  class="rounded-circle">
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
                            <a class="nav-link {{ active_class('userAccountInfo') }}" href="{{route('userAccountInfo',$user)}}">Basic Information</a>
                            <a class="nav-link {{ active_class('user-password') }}" href="{{route('user-password',$user)}}">Change Password</a>
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

        $( "#country" ).change(function() {
            const country = $("#country").children("option:selected").val();
            $('#state option:not(:first)').remove();
            if (country  !== ""){
                let path = $(this).data('url');
                path = path+'?country='+country;
                $.ajax({
                    url: path,
                    type: "GET",
                    success: function (data) {
                        const states = data.states
                        var _options =""
                        $.each(states, function(i, value) {
                            _options +=('<option value="'+ value.id+'">'+ value.name +'</option>');
                        });
                        $('#state').append(_options);
                    }
                });
            }
        });
    </script>
@endpush
