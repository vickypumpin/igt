@extends('layouts.auth')
@section('title','Register')
@section('page_header_title','Register')
@push('css')
    <link href="https://cdn.jsdelivr.net/npm/smartwizard@6/dist/css/smart_wizard_all.min.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <style>
        .select2.select2-container {
            width: 100%!important;
        }
        .select2-selection {
            background-color: #e9ecef !important;
        }
        .select2-selection--multiple .select2-selection__choice {
            background-color: #f5f7fa !important;
            margin-top: 10px !important;
        }
        .select2-selection--multiple{
            height: 50px !important;
            border: unset !important;
        }
        .alert-soft-warning{
            color: #e4a93c;
            background-color: rgba(228,169,60,.05);
            border-color: #f7e7c8;
        }
        .pb-16pt{
            padding-bottom: 1rem!important;
        }
        .mb-16pt{
            margin-bottom: 1rem!important;
        }
        .select2-container .select2-search--inline .select2-search__field{
            height: 29px !important;
        }
    </style>
@endpush
@section('content')

    <div class=" pt-32pt pt-sm-64pt pb-32pt">
        <div class="container page__container">
            @if($setting->registration_status == 1)
                <div id="smartwizard" class="mt-4">
                    <ul class="nav">
                        <li class="nav-item">
                            <a class="nav-link" href="#step-1">
                                <div class="num">1</div>
                                Account details
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#step-2">
                                <span class="num">2</span>
                                Roles / Social details
                            </a>
                        </li>
                    </ul>
                    <form method="post" action="{{route('register')}}" id="register-form" enctype="multipart/form-data">
                        @csrf
                        <div class="tab-content">
                            <div id="step-1" class="tab-pane" role="tabpanel" aria-labelledby="step-1" data-url="{{route('validateStepOne')}}" style="padding: 0.8rem;">
                                <div class="row">
                                    <div class="col-md-8" >
                                        <div class="form-row">
                                            <div class="col-md-4 mb-3">
                                                <label for="first_name">First name</label>
                                                <input type="text" name="first_name" class="form-control " id="first_name" placeholder="First name"  >
                                                <span class="invalid-feedback first_name-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="last_name">Last name</label>
                                                <input type="text" name="last_name" class="form-control" id="last_name" placeholder="Last name"  >
                                                <span class="invalid-feedback last_name-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="phone">Phone</label>
                                                <input type="text" name="phone" class="form-control" id="phone" placeholder="ex (+234 80123456789)"  >
                                                <span class="invalid-feedback phone-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-md-4 mb-3">
                                                <label for="country">Country</label>
                                                <select id="country" class="form-control custom-select" name="country"  data-url="{{route('getStates')}}" >
                                                    <option selected value="">Choose Country</option>
                                                    @foreach($countries as $country)
                                                        <option value="{{$country->id}}">{{$country->name}}</option>
                                                    @endforeach
                                                </select>
                                                <span class="invalid-feedback country-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="state">State</label>
                                                <select id="state" name="state" class="form-control custom-select" >
                                                    <option selected value="">Choose State</option>
                                                </select>
                                                <span class="invalid-feedback state-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="role">Roles</label>
                                                <select id="role" name="role" class="form-control custom-select" >
                                                    <option selected value="">Choose Role</option>
                                                    <option value="1">Brands / Advertiser</option>
                                                    <option value="2">Influencer</option>
                                                    <option value="3">Creator</option>
                                                </select>
                                                <span class="invalid-feedback role-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-md-3 mb-3">
                                                <label for="gender">Gender</label>
                                                <select id="gender" name="gender" class="form-control custom-select" >
                                                    <option selected value="" >Choose </option>
                                                    <option value="1">Male</option>
                                                    <option value="2">Female</option>
                                                </select>
                                                <span class="invalid-feedback gender-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                            <div class="col-md-5 mb-3">
                                                <label for="user_name">Username</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text" id="validationTooltipUsernamePrepend">@</span>
                                                    </div>
                                                    <input type="text" class="form-control" id="user_name" placeholder="Username" name="user_name"  autocomplete="falase">
                                                    <span class="invalid-feedback user_name-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                                </div>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="password">Password</label>
                                                <input type="password" name="password" class="form-control" id="password" placeholder="password"  >
                                                <span class="invalid-feedback password-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card mb-0">
                                            <div class="card-body">
                                                <h5>
                                                    <i class="fa fa-lightbulb text-danger"></i>
                                                    Hint!
                                                </h5>
                                                <div class="d-flex mb-8pt">
                                                    <div class="flex"><strong class="text-70">Important</strong></div>
                                                    <strong>Information</strong>
                                                </div>

                                                <div class="alert alert-soft-warning">
                                                    <div class="d-flex justify-content-between">
                                                        <div class="mr-2" >
                                                            <i class="fa fa-check text-warning"></i>
                                                        </div>
                                                        <div >
                                                            <small class="text-dark">
                                                                Phone number and email are unique, peculiar and will be use for verification
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-flex justify-content-between mb-16pt pb-16pt border-bottom">
                                                    <div >
                                                        <strong class="text-70">Registration</strong>
                                                    </div>
                                                    <div>
                                                        <strong>Free</strong>
                                                    </div>

                                                </div>
                                                <div class="custom-control">
                                                    <strong>Keeping IGT Safe</strong>
                                                    <small class="form-text text-muted">Accounts will be scrutinized and reviewed</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="step-2" class="tab-pane" role="tabpanel" aria-labelledby="step-2" data-url="{{route('validateStepTwo')}}" style="padding: 0.8rem;">
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="form-row brands_info d-none">
                                            <div class="col-md-4 mb-3">
                                                <label for="company_name">Company name</label>
                                                <input type="text" name="company_name" class="form-control" id="company_name" placeholder="Company Name"  >
                                                <span class="invalid-feedback company_name-feedback" role="alert">
                                               <strong></strong>
                                           </span>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="company_size">Company Size</label>
                                                <select id="company_size" name="company_size" class="form-control custom-select" >
                                                    <option selected value="">Choose Size</option>
                                                    <option value="1-5">1 - 5</option>
                                                    <option value="6-10">6 - 10</option>
                                                    <option value="11-50">11-50</option>
                                                    <option value="51-100">51-100</option>
                                                    <option value="100+">100+</option>
                                                </select>
                                                <span class="invalid-feedback company_size-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="company_type">Company Type</label>
                                                <select id="company_type" name="company_type" class="form-control custom-select" >
                                                    <option selected value="">Choose Type</option>
                                                    @foreach($company_types as $type)
                                                        <option value="{{$type->id}}">{{$type->name}}</option>
                                                    @endforeach
                                                </select>
                                                <span class="invalid-feedback company_type-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                        </div>
                                        <div class="form-row influencer_info d-none">
                                            <div class="col-md-12 mb-3">
                                                <label class="dob">DoB</label>
                                                <input type="text" name="dob" id="dob" class="form-control flatpickr" placeholder="dob" >
                                                <span class="invalid-feedback dob-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                        </div>
                                        <div class="form-row influencer_info d-none">
                                            <div class="col-md-12 mb-3">
                                                <label for="content_category">Content Category</label>
                                                <select id="content_category" name="content_category[]"  class="form-control content-category-select " multiple>
                                                    @foreach($content_categories as $category)
                                                        <option value="{{$category->id}}">{{$category->name}}</option>
                                                    @endforeach
                                                </select>
                                                <span class="invalid-feedback content_category-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                        </div>
                                        <div class="form-row  creator_info d-none">
                                            <div class="col-md-12 mb-3">
                                                <label for="creator_category">Creator Category</label>
                                                <select id="creator_category" name="creator_category"  class="form-control creator-category-select " >
                                                    @foreach($creator_categories as $category)
                                                        <option value="{{$category->id}}">{{$category->name}}</option>
                                                    @endforeach
                                                </select>
                                                <span class="invalid-feedback creator_category-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-md-6 mb-3">
                                                <label for="email">Email</label>
                                                <input type="email" name="email" class="form-control" id="email" placeholder="email" value="" >
                                                <span class="invalid-feedback email-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                            </div>
                                            <div class="col-md-6 mb-3 influencer_info d-none">
                                                <label for="photo">Photo</label>
                                                <div class="custom-file" id="validationTooltip05">
                                                    <input type="file" name="photo" class="custom-file-input" id="photo" accept="image/*">
                                                    <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                                                    <small class="form-text text-muted">Note: JPG, JPEG, PNG. / You can upload later</small>
                                                    <span class="invalid-feedback photo-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row influencer_info d-none">
                                            <div class="col-md-4 mb-3">
                                                <label for="instagram_profile">Instagram Profile</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                            <span class="input-group-text" >
                                                <img src="{{asset('images/instagram.png')}}" width="24" height="24" alt="Insta">
                                            </span>
                                                    </div>
                                                    <input type="text" class="form-control" name="instagram_profile" id="instagram_profile" placeholder="instagram profile"  >
                                                    <span class="invalid-feedback instagram_profile-feedback" role="alert">
                                                 <strong></strong>
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="facebook_profile">Facebook Profile</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                            <span class="input-group-text" >
                                                <img src="{{asset('images/facebook.png')}}" width="24" height="24" alt="FB">
                                            </span>
                                                    </div>
                                                    <input type="text" class="form-control" name="facebook_profile" id="facebook_handle" placeholder="@igotrend"  >
                                                    <span class="invalid-feedback facebook_profile-feedback" role="alert">
                                                 <strong></strong>
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="twitter_profile">Twitter Profile</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                            <span class="input-group-text" id="">
                                                <img src="{{asset('images/twitter.png')}}" width="24" height="24" alt="TT">
                                            </span>
                                                    </div>
                                                    <input type="text" class="form-control" name="twitter_profile" id="twitter_profile" placeholder="twitter profile"  >
                                                    <span class="invalid-feedback twitter_profile-feedback" role="alert">
                                                 <strong></strong>
                                            </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row influencer_info d-none">
                                            <div class="col-md-4 mb-3">
                                                <label for="tiktok_profile">Tiktok Profile</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                            <span class="input-group-text" id="validationTooltipTiktokPrepend">
                                                <img src=" {{asset('images/tiktok.png')}}" width="24" height="24" alt="Tik">
                                            </span>
                                                    </div>
                                                    <input type="text" class="form-control" name="tiktok_profile" id="tiktok_profile" placeholder="tiktok profile"  >
                                                    <span class="invalid-feedback tiktok_profile-feedback" role="alert">
                                                 <strong></strong>
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="snapchat_profile">Snapchat Profile</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                            <span class="input-group-text" >
                                                <img src="{{asset('images/snapchat.png')}}" width="24" height="24" alt="snap">
                                            </span>
                                                    </div>
                                                    <input type="text" class="form-control" name="snapchat_profile" id="snapchat_profile" placeholder="snapchat profile">
                                                    <span class="invalid-feedback snapchat_profile-feedback" role="alert">
                                                 <strong></strong>
                                            </span>
                                                </div>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                <label for="youtube_profile">Youtube Profile</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                            <span class="input-group-text" >
                                                <img src="{{asset('images/youtube.png')}} " width="24" height="24" alt="yT">
                                            </span>
                                                    </div>
                                                    <input type="text" class="form-control" name="youtube_profile" id="youtube_profile" placeholder="youtube profile" >
                                                    <span class="invalid-feedback youtube_profile-feedback" role="alert">
                                                 <strong></strong>
                                            </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card mb-0">
                                            <div class="card-body">
                                                <h5>
                                                    <i class="fa fa-lightbulb text-danger"></i>
                                                    Hint!
                                                </h5>
                                                <div class="d-flex mb-8pt">
                                                    <div class="flex"><strong class="text-70">Important</strong></div>
                                                    <strong>Information</strong>
                                                </div>

                                                <div class="alert alert-soft-warning">
                                                    <div class="d-flex justify-content-between">
                                                        <div class="mr-2" >
                                                            <i class="fa fa-check text-warning"></i>
                                                        </div>
                                                        <div >
                                                            <small class="text-dark">
                                                                Social media handles are unique,peculiar and will be verified
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-flex justify-content-between mb-16pt pb-16pt border-bottom">
                                                    <div >
                                                        <strong class="text-70">Registration</strong>
                                                    </div>
                                                    <div>
                                                        <strong>Free</strong>
                                                    </div>

                                                </div>
                                                <div class="custom-control custom-checkbox">
                                                    <input type="checkbox" class="custom-control-input" checked  id="topic-all">
                                                    <label class="custom-control-label">Terms and conditions</label>
                                                    <small class="form-text text-muted">By checking here and continuing, I agree to the  Terms of Use</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>

                    <!-- Include optional progressbar HTML -->
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            @else
                <div class="row">
                    <div class="col-md-12 text-center mt-4" >
                        <h3>This service currently unavailable</h3>
                    </div>
                </div>
            @endif

        </div>
    </div>
@endsection
@push('js')
    <script src="https://cdn.jsdelivr.net/npm/smartwizard@6/dist/js/jquery.smartWizard.min.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <script>
        $(function() {
            // SmartWizard initialize
            $('#smartwizard').smartWizard({
                selected: 0,
                theme: 'arrows',
                justified: true,
                enableUrlHash: false,
                autoAdjustHeight: true,
                anchor: {
                    enableNavigation: false,
                },
                transition: {
                    animation: 'slideHorizontal',
                },
                toolbar: {
                    showNextButton: true, // show/hide a Next button
                    showPreviousButton: true, // show/hide a Previous button
                    position: 'bottom', // none/ top/ both bottom
                    extraHtml: `<button class="btn btn-success tn-sm" id="btnFinish" disabled  style="padding: 6px">Submit</button>`
                },
            });
            $("#smartwizard").on("leaveStep", function(e, anchorObject, currentStepIndex, nextStepIndex, stepDirection) {
                if(currentStepIndex === 0 &&  nextStepIndex === 1) {
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    const url = $('#step-1').data("url");
                    $.ajax({
                        url: url,
                        type: 'post',
                        data: {
                            'first_name': $('#first_name').val(),
                            'last_name': $('#last_name').val(),
                            'phone': $('#phone').val(),
                            'user_name': $('#user_name').val(),
                            'password': $('#password').val(),
                            'country': $("#country").children("option:selected").val(),
                            'state': $("#state").children("option:selected").val(),
                            'role': $("#role").children("option:selected").val(),
                            'gender': $("#gender").children("option:selected").val(),
                        },
                        beforeSend: function (xhr) {
                            $('#step-1').find("input, select, textarea").removeClass("is-invalid");
                            $('#smartwizard').smartWizard("loader", "show");
                        },
                        success: function (data) {
                            if (data.error) {
                                let messages = data.messages;
                                Object.keys(messages).forEach(function (key) {
                                    $("#" + key).addClass("is-invalid");
                                    $("." + key + "-feedback").text(messages[key]);
                                });
                                // Hide the loader
                                $('#smartwizard').smartWizard("loader", "hide");
                                $('#smartwizard').smartWizard("goToStep", 0, true);
                                $('#smartwizard').smartWizard("setState", [0], 'error');
                            }else {
                                $('#smartwizard').smartWizard("loader", "hide");
                                $('#step1').find("input, select, textarea").removeClass("is-invalid");
                                $('#smartwizard').smartWizard("unsetState", [0], 'error');
                            }
                        }
                    });
                }
                if(nextStepIndex === 1){
                    const role_type = $("#role").children("option:selected").val();
                    if(role_type === "1"){
                        $('.brands_info').removeClass('d-none')
                        $('.influencer_info').addClass('d-none')
                    }else {
                        if (role_type === "3"){
                            $('.brands_info').addClass('d-none')
                            $('.influencer_info').removeClass('d-none')
                            $('.creator_info').removeClass('d-none')
                        }else{
                            $('.brands_info').addClass('d-none')
                            $('.influencer_info').removeClass('d-none')
                            $('.creator_info').addClass('d-none')
                        }
                    }
                }

            });
            $("#smartwizard").on("showStep", function(e, anchorObject, stepIndex, stepDirection, stepPosition) {
                if(stepPosition === "last"){
                    $('#step-2').find("input, select, textarea").removeClass("is-invalid");
                    $('#btnFinish').prop('disabled',false)
                }else {
                    $('#btnFinish').prop('disabled',true)
                }
            });
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
        });
        flatpickr(".flatpickr", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            defaultDate: "today",
        });
        $('.content-category-select').select2({
            placeholder: "Select a content category",
            maximumSelectionLength: 5
        });
        $('.creator-category-select').select2({
            placeholder: "Select a creator category",
            maximumSelectionLength: 3
        });

        $(document).on("click","#btnFinish",function(e) {
            e.preventDefault();
            const url = $('#step-2').data("url");
            $.ajax({
                url: url,
                type: 'post',
                data: {
                    'role': $("#role").children("option:selected").val(),
                    'company_name': $("#company_name").val(),
                    'company_size': $("#company_size").children("option:selected").val(),
                    'company_type': $("#company_type").children("option:selected").val(),
                    'email': $("#email").val(),
                    'dob': $("#dob").val(),
                    'content_category': $("#content_category").val(),
                    'creator_category': $("#creator_category").val(),
                    'instagram_profile':  $("#instagram_profile").val(),
                    'facebook_profile':  $("#facebook_profile").val(),
                    'twitter_profile':  $("#twitter_profile").val(),
                    'tiktok_profile':  $("#tiktok_profile").val(),
                    'snapchat_profile':  $("#snapchat_profile").val(),
                    'youtube_profile':  $("#youtube_profile").val(),
                },
                beforeSend: function (xhr) {
                    $('#step-2').find("input, select, textarea").removeClass("is-invalid");
                    $('#smartwizard').smartWizard("loader", "show");
                },
                success: function (data) {
                    if (data.error) {
                        let messages = data.messages;
                        Object.keys(messages).forEach(function (key) {
                            $("#" + key).addClass("is-invalid");
                            $("." + key + "-feedback").text(messages[key]);
                        });
                        // Hide the loader
                        $('#smartwizard').smartWizard("loader", "hide");
                    }else {
                        $('#register-form').submit();
                    }
                }
            });
        });
    </script>
@endpush
