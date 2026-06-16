@extends('layouts.app')
@section('title','Explore')
@section('content')
    <style type="text/css">
        .select2-search--inline .select2-search__field {
            padding-bottom: 30px !important;
        }
        .select2-container--default.select2-container--focus .select2-selection--multiple {
            border: 1px solid #efeef1 !important;
            border-radius: 0.25rem !important;
        }
        .select2-container .select2-selection--multiple {
            min-height: 53px !important;
            border: 1px solid #efeef1 !important;
        }
        .select2-container--default .select2-selection--multiple .select2-selection__choice__display {
            color: black !important;
        }
        .select2-container .select2-search--inline .select2-search__field {
            margin-top: 13px !important;
            margin-left: 20px !important;
            font-size: .875rem !important;
            font-weight: 300 !important;
            line-height: 1.6 !important;
        }

    </style>
    <div class="pageheader bg-shape" style="background: linear-gradient(270deg, purple 0%, blue 101.08%), #66bbf3; background-size: cover;">
        <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- pagecaption start -->
                    <div class="page-caption">
                        <div class="page-caption-para-text">
                            <h1 class="page-caption-title center" style="text-align: center;">Find and Hire Influencers in Seconds</h1>
                            <p class="mb-4 text-white" style="text-align: center;">You must be logged in to view full results</p>
                            <form class="" method="GET" action="{{route('explore')}}">
                                <div class="form-row" style="text-align: center;">

                                    <div class="form-group col-md-6">
                                        <!-- <label class="form-control-label" for="basic-url">Search Username (optional) </label> -->
                                        <div class="input-group" style="color: black; background-color: white;">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text" id="basic-addon3">https://www.igotrend.com/</span>
                                            </div>
                                            <input type="text" name="user_name" value="{{ $user_name ?? '' }}" class="form-control">
                                        </div>
                                    </div>


                                    <div class="form-group col-md-6">
                                        <select class="custom-select" name="platform" style="color: black; background-color: white;">
                                            <option selected>Choose Platform</option>
                                            <option value="all"       @if($platform == 'all') selected @endif>All</option>
                                            <option value="insta"    @if($platform == 'insta') selected @endif>Instagram</option>
                                            <option value="facebook" @if($platform == 'facebook') selected @endif>Facebook</option>
                                            <option value="twitter"  @if($platform == 'twitter') selected @endif>Twitter</option>
                                            <option value="tiktok"   @if($platform == 'tiktok') selected @endif>TikTok</option>
                                            <option value="youtube"  @if($platform == 'youtube') selected @endif>Youtube</option>
                                            <option value="snapchat" @if($platform == 'snapchat') selected @endif>Snapchat</option>
                                        </select>

                                    </div>
                                    <div class="form-group col-md-6">
                                        <select class="custom-select  w-100" multiple id="category"   >
                                            @foreach($content_categories as $content_category)
                                                <option  value="{{$content_category->id}}" @if($content) @if(in_array($content_category->id,$content)) selected @endif @endif data-type="content_category">{{$content_category->name}}</option>
                                            @endforeach
                                            @foreach($creator_categories as $creator_category)
                                                <option  value="{{$creator_category->id}}" @if($creator) @if(in_array($creator_category->id,$creator)) selected @endif @endif data-type="creator_category">{{$creator_category->name}}</option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <input type="hidden" id="content_categories" name="content_categories" value="{{json_encode($content)}}" >
                                    <input type="hidden" id="creator_categories" name="creator_categories" value="{{json_encode($creator)}}" >

                                    <div class="form-group col-md-6">
                                        <select class="custom-select" name="country" style="color: black; background-color: white;">
                                            <option selected value="">Choose Country</option>
                                            @foreach($countries as $country)
                                                <option value="{{$country->id}}" @if($countryy == $country->id) selected @endif>{{$country->name}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <select class="custom-select" name="gender" style="color: black; background-color: white;">
                                            <option selected value="">Choose Gender</option>
                                            <option value="1" @if($gender == 1) selected @endif>Male</option>
                                            <option value="2" @if($gender == 2) selected @endif>Female</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <button type="submit" class="btn btn-secondary">Search Now!</button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                    <!-- pagecaption close -->
                </div>
            </div>
        </div>

    </div>
    <div class="py-xl-10 py-5">
        <div class="container">
            <div class="row ">
                <div class="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                    <div class="mb-12" data-aos="fade-up">
                        <h2>Trender's Marketplace!</h2>
                    </div>
                </div>
            </div>
            <div class="row ">
                <!-- trenderdisp start -->
                @if($users->count() == 0)
                    <div class="col-12 text-center">
                        <h4>No Trenders Found</h4>
                    </div>
                @else
                    @foreach ($users as $user)
                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                            <div class="card text-center border-0 mb-10 mb-xl-0" data-aos="fade-up">
                                <div class="mt-n6 small">
                                    <img src="{{get_user_image($user->id)}}" class="rounded-circle icon-xxl shadow-sm" >
                                    <h3 class="mt-4 text-primary font-14 text-uppercase font-weight-bold mb-1">
                                        <a href="{{route('summary',$user)}}">
                                            @ {{$user->user_name}}
                                        </a>
                                    </h3>
                                    <p>{{  implode(', ', $user->content_category_name->toarray())}} </p>
                                    <p>
                                    <ul class="list-unstyled">
                                        {{calculate_age($user)}} / {{$user->badge}}
                                        &nbsp;<li class="fas fa-star text-warning"></li>
                                    </ul>
                                    </p>
                                    <p> {{$user->country->name}} , {{$user->state->name}}</p>
                                </div>
                                <div class="mb-3 small">
                                    <p class="mb-0 small">
                                        @if($user->facebook_profile)
                                            <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($user->tiktok_profile)
                                            <img src="{{asset('images/tiktok.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($user->instagram_profile)
                                            <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($user->twitter_profile)
                                            <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($user->youtube_profile)
                                            <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($user->snapchat_profile)
                                            <img src="{{asset('images/snapchat.png')}}" alt="" class="img-fluid">
                                        @endif
                                    </p>
                                </div>

                            </div>
                        </div>
                    @endforeach
                @endif

            </div>

        </div>
    </div>

    <!-- celebe image      -->
    <div class="py-xl-10 py-5 bg-light">
        <div class="container">

            <div class="row">
                <div class="col-md-5 mb-xl-8 mb-0" data-aos="fade-up">
                    <h2 class="text-success"> Featured Trenders</h2>
                </div>
            </div>
            <div class="row" data-aos="zoom-in">
                @if(isset($featured_trenders[0]))
                    <div class="col-lg-3 col-md-6">
                        <div class="card border-0 mt-14 uplift">
                            <img src="{{get_user_image($featured_trenders[0]['id'])}}" alt="" class="img-fluid rounded-top">
                            <div class="card-body bg-success rounded-bottom text-white ">

                                <h5 class="font-18 mb-0 text-white">{{"@".\Illuminate\Support\Str::mask($featured_trenders[0]['user_name'],'*',2)}}<i class="fas fa-lock mb-4"></i></h5>
                                <p class="mb-0 small"><p class="mb-0 small">
                                    @if($featured_trenders[0]['facebook_profile'])
                                        <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                    @endif
                                    @if($featured_trenders[0]['instagram_profile'])
                                        <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                    @endif
                                    @if($featured_trenders[0]['twitter_profile'])
                                        <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                    @endif
                                    @if($featured_trenders[0]['youtube_profile'])
                                        <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                    @endif
                                </p>
                            </div>
                        </div>
                    </div>
                @endif
                @if(isset($featured_trenders[1]) || isset($featured_trenders[2]))
                    <div class="col-lg-3 col-md-6">
                        @if(isset($featured_trenders[1]))
                            <div class="card border-0 mt-10 uplift">
                                <img src="{{get_user_image($featured_trenders[1]['id'])}}" alt="" class="img-fluid rounded-top">
                                <div class="card-body bg-primarydarker rounded-bottom text-white ">

                                    <h5 class="font-18 mb-0 text-white">{{"@".\Illuminate\Support\Str::mask($featured_trenders[1]['user_name'],'*',2)}}<i class="fas fa-lock mb-4"></i></h5>
                                    <p class="mb-0 small">
                                    <p class="mb-0 small"><p class="mb-0 small">
                                        @if($featured_trenders[1]['facebook_profile'])
                                            <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[1]['instagram_profile'])
                                            <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[1]['twitter_profile'])
                                            <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[1]['youtube_profile'])
                                            <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                        @endif
                                    </p>
                                </div>
                            </div>
                        @endif
                        @if(isset($featured_trenders[2]))
                            <div class="card border-0 mt-4 uplift">
                                <img src="{{get_user_image($featured_trenders[2]['id'])}}" alt="" class="img-fluid rounded-top">
                                <div class="card-body bg-lightpeach rounded-bottom text-white ">

                                    <h5 class="font-18 mb-0 text-white">{{"@".\Illuminate\Support\Str::mask($featured_trenders[2]['user_name'],'*',2)}}<i class="fas fa-lock mb-4"></i></h5>
                                    <p class="mb-0 small">
                                    <p class="mb-0 small">
                                        @if($featured_trenders[2]['facebook_profile'])
                                            <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[2]['instagram_profile'])
                                            <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[2]['twitter_profile'])
                                            <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[2]['youtube_profile'])
                                            <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                        @endif
                                    </p>
                                </div>
                            </div>
                        @endif
                    </div>
                @endif
                @if(isset($featured_trenders[3]) || isset($featured_trenders[4]))
                    <div class="col-lg-3 col-md-6">
                        @if(isset($featured_trenders[3]))
                            <div class="card border-0 mt-4 uplift">
                                <img src="{{get_user_image($featured_trenders[3]['id'])}}" alt="" class="img-fluid rounded-top">
                                <div class="card-body bg-danger rounded-bottom text-white ">

                                    <h5 class="font-18 mb-0 text-white">{{"@".\Illuminate\Support\Str::mask($featured_trenders[3]['user_name'],'*',2)}}<i class="fas fa-lock mb-4"></i></h5>
                                    <p class="mb-0 small"><p class="mb-0 small"><p class="mb-0 small">
                                        @if($featured_trenders[3]['facebook_profile'])
                                            <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[3]['instagram_profile'])
                                            <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[3]['twitter_profile'])
                                            <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[3]['youtube_profile'])
                                            <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                        @endif
                                    </p>
                                </div>
                            </div>
                        @endif
                        @if(isset($featured_trenders[4]))
                            <div class="card border-0 mt-4 uplift">
                                <img src="{{get_user_image($featured_trenders[4]['id'])}}" alt="" class="img-fluid rounded-top">
                                <div class="card-body bg-secondary rounded-bottom text-white ">

                                    <h5 class="font-18 mb-0 text-white">{{"@".\Illuminate\Support\Str::mask($featured_trenders[4]['user_name'],'*',2)}}<i class="fas fa-lock mb-4"></i></h5>
                                    <p class="mb-0 small"><p class="mb-0 small">
                                        @if($featured_trenders[4]['facebook_profile'])
                                            <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[4]['instagram_profile'])
                                            <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[4]['twitter_profile'])
                                            <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[4]['youtube_profile'])
                                            <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                        @endif
                                    </p>
                                </div>
                            </div>
                        @endif
                    </div>
                @endif
                @if(isset($featured_trenders[5]) || isset($featured_trenders[6]))
                    <div class="col-lg-3 col-md-6">
                        @if(isset($featured_trenders[5]))
                            <div class="card border-0 mt-0 uplift">
                                <img src="{{get_user_image($featured_trenders[5]['id'])}}" alt="" class="img-fluid rounded-top">
                                <div class="card-body bg-warning rounded-bottom text-white ">

                                    <h5 class="font-18 mb-0 text-white">{{"@".\Illuminate\Support\Str::mask($featured_trenders[5]['user_name'],'*',2)}}<i class="fas fa-lock mb-4"></i></h5>
                                    <p class="mb-0 small">
                                    <p class="mb-0 small">
                                        @if($featured_trenders[5]['facebook_profile'])
                                            <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[5]['instagram_profile'])
                                            <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[5]['twitter_profile'])
                                            <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[5]['youtube_profile'])
                                            <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                        @endif
                                    </p>
                                </div>
                            </div>
                        @endif
                        @if(isset($featured_trenders[6]))
                            <div class="card border-0 mt-4 uplift">
                                <img src="{{get_user_image($featured_trenders[6]['id'])}}" alt="" class="img-fluid rounded-top">
                                <div class="card-body bg-info rounded-bottom text-white ">

                                    <h5 class="font-18 mb-0 text-white">{{"@".\Illuminate\Support\Str::mask($featured_trenders[6]['user_name'],'*',2)}}<i class="fas fa-lock mb-4"></i></h5>
                                    <p class="mb-0 small">
                                        @if($featured_trenders[6]['facebook_profile'])
                                            <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[6]['instagram_profile'])
                                            <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[6]['twitter_profile'])
                                            <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                        @endif
                                        @if($featured_trenders[6]['youtube_profile'])
                                            <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                        @endif
                                    </p>
                                </div>
                            </div>
                        @endif
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection
@push('js')

    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <script>
        $(document).ready(function() {
            $('#category').select2({
                placeholder: "Select a Category",
                allowClear: true,
                width: '100%'
            });
        });


        $('#category').on('select2:select', function (e) {
            const type = $(e.params.data.element).data('type');
            const value = e.params.data.id;
            let content_categories = $('#content_categories').val();
            let creator_categories = $('#creator_categories').val();

            if(type === "content_category"){
                if(content_categories){
                    const previous_categories = JSON.parse(content_categories);
                    previous_categories.push(value)
                    $('#content_categories').val(JSON.stringify( previous_categories ));
                }else {
                    $('#content_categories').val(JSON.stringify([value]));
                }
            }
            if(type === "creator_category"){
                if(creator_categories){
                    const previous_creator_categories = JSON.parse(creator_categories);
                    previous_creator_categories.push(value)
                    $('#creator_categories').val(JSON.stringify( previous_creator_categories ));
                }else {
                    $('#creator_categories').val(JSON.stringify([value]));
                }
            }
        });
        $('#category').on('select2:unselect', function (e) {
            const type = $(e.params.data.element).data('type');
            const remove_value = e.params.data.id;
            let content_categories = $('#content_categories').val();
            let creator_categories = $('#creator_categories').val();


            if(type === "content_category"){
                if(content_categories){
                    let previous_categories = JSON.parse(content_categories);
                    previous_categories = jQuery.grep(previous_categories, function(value) {
                        return value !== remove_value;
                    });

                    $('#content_categories').val(JSON.stringify( previous_categories));
                }
            }
            if(type === "creator_category"){
                if(creator_categories){
                    let previous_creator_categories = JSON.parse(creator_categories);
                    previous_creator_categories = jQuery.grep(previous_creator_categories, function(value) {
                        return value !== remove_value;
                    });
                    $('#creator_categories').val(JSON.stringify( previous_creator_categories ));
                }
            }


        });
    </script>

@endpush


