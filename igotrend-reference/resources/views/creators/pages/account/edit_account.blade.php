@extends('creators.layout.app')
@section('title','Edit Account')
@section('page_title','Account')
@section('page_route','Account / Edit Account')
@section('content')
    <div class="container-fluid page__container">
        <form action="{{route('creator_account_update_info',auth()->user()->id)}}" method="post" enctype="multipart/form-data">
            @csrf
            <div class="row">
                <div class="col-lg-9 pr-lg-0">
                    <div class="page-section">
                        <div class="list-group list-group-form">
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">First name</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="first_name" class="form-control @error('first_name') is-invalid @enderror" value="{{auth()->user()->first_name}}" placeholder="first name" >
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
                                        <input type="text" name="last_name" class="form-control @error('last_name') is-invalid @enderror" value="{{auth()->user()->last_name}}" placeholder="last name" >
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
                                    <label class="form-label col-form-label col-sm-3">Email Address</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="email" class="form-control @error('email') is-invalid @enderror" value="{{auth()->user()->email}}" placeholder="email address" >
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
                                        <input type="text" name="phone" class="form-control @error('phone') is-invalid @enderror" value="{{auth()->user()->phone}}" placeholder="NG phone: (234) 803-000-0000" >
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
                                    <label class="form-label col-form-label col-sm-3">Dob</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="dob" class="form-control flatpickr @error('dob') is-invalid @enderror" value="{{auth()->user()->dob}}" placeholder="NG phone: (234) 803-000-0000" >
                                        @error('dob')
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
                                            <option value="1" @if(auth()->user()->gender == "1") selected @endif>Male</option>
                                            <option value="2" @if(auth()->user()->gender == "2") selected  @endif>Female</option>
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
                                    <label class="form-label col-form-label col-sm-3">Country</label>
                                    <div class="col-sm-9">
                                        <select name="country" id="country" class="form-control custom-select @error('country') is-invalid @enderror"  data-url="{{route('creatorGetCountriesStates')}}">
                                            <option selected value="">Choose Country</option>
                                            @foreach($countries as $country)
                                                <option value="{{$country->id}}"  @if(auth()->user()->country_id == $country->id) selected @endif>{{$country->name}}</option>
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
                                                <option value="{{$state->id}}"  @if(auth()->user()->state_id == $state->id) selected @endif>{{$state->name}}</option>
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
                                            <img src="{{get_user_image(auth()->user()->id)}}" alt="{{auth()->user()->name}}" width="60" height="60"  class="rounded-circle">
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
                            <a class="nav-link {{ active_class('creator_edit_account') }}" href="{{route('creator_edit_account')}}">Basic Information</a>
                            <a class="nav-link {{ active_class('edit_social_profile') }}" href="{{route('edit_social_profile')}}">Social Profile</a>
                            <a class="nav-link {{ active_class('creator_edit_password') }}" href="{{route('creator_edit_password')}}">Change Password</a>
                        </nav>
                        <div class="page-nav__content">
                            <button type="submit" class="btn btn-accent">Update Now</button>
                        </div>
                      	<div class="page-nav__content">
                            
    <script src ="https://form.jotform.com/static/feedback2.js" type="text/javascript"></script>
    <script type="text/javascript">
        var JFL_250197344750054 = new JotformFeedback({
          formId: '250197344750054',
          base: 'https://form.jotform.com/',
          windowTitle: 'Account Deletion',
          backgroundColor: '#FFA500',
          fontColor: '#FFFFFF',
          type: '0',
          height: 500,
          width: 700,
          openOnLoad: false
        });
    </script>
    <script src='https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js'></script>
    <script>window.jotformEmbedHandler("iframe[id='250197344750054']", "https://form.jotform.com/")</script>
      <a class="btn lightbox-250197344750054"
      style="
      margin-top: 16px;
      text-transform: uppercase;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      display: inline-block;
      padding: 10px;
      font-family: inherit;
      text-shadow: none;
      user-select: none;
      transition: all,.1s,ease-in;
      background-color: #FFA500;
      border: 1px solid #FFA500;
      color: #FFFFFF;
      ">
        Account Deletion
      </a>
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
        flatpickr(".flatpickr", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            defaultDate: "today",
        });
    </script>
@endpush
