@extends('layouts.app')
@section('title','Home')
@section('content')

    <style type="text/css">

        /* Slick Slider */

        .slick-prev, .slick-next {
            position: absolute;
            top: 135%;
            font-size: 1.8rem;
        }

        .slick-prev {
            left: 0;
        }

        .slick-next {
            right: 0;
        }

        .slick-slider {
            position: relative;
            display: block;
            box-sizing: border-box;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -khtml-user-select: none;
            -ms-touch-action: pan-y;
            touch-action: pan-y;
            -webkit-tap-highlight-color: transparent;
        }

        .slick-list {
            position: relative;
            display: block;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }

        .slick-list:focus {
            outline: none;
        }

        .slick-list.dragging {
            cursor: pointer;
            cursor: hand;
        }

        .slick-slider .slick-track,
        .slick-slider .slick-list {
            -webkit-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
            -ms-transform: translate3d(0, 0, 0);
            -o-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        .slick-track {
            position: relative;
            top: 0;
            left: 0;
            display: block;
        }

        .slick-track:before,
        .slick-track:after {
            display: table;
            content: '';
        }

        .slick-track:after {
            clear: both;
        }

        .slick-loading .slick-track {
            visibility: hidden;
        }

        .slick-slide {
            display: none;
            float: left;
            height: 100%;
            min-height: 1px;
        }

        [dir='rtl'] .slick-slide {
            float: right;
        }

        .slick-slide img {
            display: block;
        }

        .slick-slide.slick-loading img {
            display: none;
        }

        .slick-slide.dragging img {
            pointer-events: none;
        }
        .slick-initialized .slick-slide {
            display: block;
        }
        .slick-loading .slick-slide {
            visibility: hidden;
        }
        .slick-vertical .slick-slide {
            display: block;
            height: auto;
            border: 1px solid transparent;
        }

        .slick-arrow.slick-hidden {
            display: none;
        }

        .slide {
            transition: filter .4s;
            margin: 0px 40px;
        }

        .fas {
            color: #00D4A1;
        }
        .slick-prev {
            left: 0;
        }
        .slick-prev, .slick-next {
            position: absolute;
            top: 35%;
            font-size: 1.8rem;
        }
        .select2-search--inline .select2-search__field {
            padding-bottom: 20px !important;
        }
        .select2-container--default.select2-container--focus .select2-selection--multiple {
            border: 1px solid #efeef1 !important;
            border-radius: 0.25rem !important;
        }
        .select2-container .select2-selection--multiple {
            min-height: 42px !important;
            border: 1px solid #efeef1 !important;
        }
        .select2-container--default .select2-selection--multiple .select2-selection__choice__display {
            color: black !important;
        }

        .select2-container .select2-search--inline .select2-search__field {
            margin-top: 10px !important;
            font-size: .875rem !important;
            font-weight: 300 !important;
            line-height: 1.6 !important;
        }

    </style>
    <div class="bg-shape pt-xl-2 pb-xl-8 pb-6 pt-4 img-fluid bg-dark">
        <div class="container header-content">
            <!-- <div class="fullscreen-video-wrap">
                <video src="https://res.cloudinary.com/dstvuoook/video/upload/v1667135496/igtbgvid_bw1yat.mp4"
                       autoplay type="video/mp4" muted poster="{{asset('images/pexe.jpg')}}" id="homevid">
                </video>
            </div> -->
            <!--<div class="div-overlay" style="background: none !important;"></div> -->
            <div class="row ">
                <!-- pagecaption start -->
                <div class="offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div class="py-xl-12 py-8 text-center div-content" data-aos="fade-up ">
                        <h1 class="text-white">Discover Influencers & Content Creators for your Campaign!</h1><br>
                        <p class="text-white mb-3">A reward-based platform where Influencers and Content creators get paid for doing what they love!.</p>
                        <!-- cta section start -->
                        <h4 class="text-white">Ready to Support Trenders?</h4>
                        <p class="text-white mb-4">Buy them Gems!</p>
                        <form  method="GET"  action="{{route('explore')}}">
                            <div class="form-row mx-3">
                                <div class="form-group col-md-6">
                                    <select class="custom-select" name="platform" required  style="color: black; background-color: white; height: 43px !important; padding: 9px !important;">
                                        <option selected value="">Choose Platform</option>
                                        <option value="all">All</option>
                                        <option value="insta">Instagram</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="twitter">Twitter ( X )</option>
                                        <option value="tiktok">TikTok</option>
                                        <option value="youtube">Youtube</option>
                                        <option value="snapchat">Snapchat</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-6">
                                    <select class="custom-select  w-100" multiple id="category"  required >
                                        @foreach($content_categories as $content_category)
                                            <option value="{{$content_category->id}}" data-type="content_category">{{$content_category->name}}</option>
                                        @endforeach
                                        @foreach($creator_categories as $creator_category)
                                            <option value="{{$creator_category->id}}" data-type="creator_category">{{$creator_category->name}}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <input type="hidden" id="content_categories" name="content_categories" >
                                <input type="hidden" id="creator_categories" name="creator_categories">
                                <div class="form-group col-md-12">
                                    <button type="submit" class="btn btn-secondary">Search Now</button>
                                </div>

                            </div>
                        </form> <br><br>
                        <!-- cta section close -->

                        @if($random_creator_categories->count() != 0 || $random_content_categories->count() != 0 )
                            <!-- categories carousel -->
                            <div class="slider mt-2 mb-5">
                                @foreach($random_creator_categories as $random_creator_category)
                                    @php
                                        $creator_val = json_encode([$random_creator_category->id]);
                                    @endphp
                                    <div class="slide">
                                        <a href={{route('explore',['creator_categories' => $creator_val])}}>
                                            @if($random_creator_category->getMedia('creator-category-image')->isEmpty())
                                                <img src="{{asset('img_placeholder.jpg')}}"  height="100" width="150">
                                            @else
                                                <img src="{{asset($random_creator_category->getMedia('creator-category-image')->first()->getUrl())}}"  height="100" width="150">
                                            @endif
                                        </a>
                                        <span class="text-white">{{ucfirst($random_creator_category->name)}}</span>
                                    </div>
                                @endforeach
                                @foreach($random_content_categories as $random_content_category)
                                    @php
                                        $content_val = json_encode([$random_content_category->id]);
                                    @endphp
                                    <div class="slide">
                                        <a href={{route('explore',['content_categories' => $content_val])}}>
                                            @if($random_content_category->getMedia('content-category-image')->isEmpty())
                                                <img src="{{asset('img_placeholder.jpg')}}"  height="100" width="150">
                                            @else
                                                <img src="{{asset( $random_content_category->getMedia('content-category-image')->first()->getUrl() )}}"  height="100" width="150">
                                            @endif
                                        </a>
                                        <span class="text-white">{{ucfirst($random_content_category->name)}}</span>
                                    </div>
                                @endforeach

                            </div>
                            <!-- end categories carousel -->
                        @endif


                    </div>

                </div>
                <!-- pagecaption close -->
            </div>
        </div>
    </div>
    <!-- hero slide eighth close -->
    <div class="pb-xl-4 pb-8">
        <div class="container div-content">
            <div class="row">
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 div-content" data-aos="fade-down">
                    <!-- feature block start -->
                    <div class="card mt-n8 uplift mb-8 bg-secondary" style="background-image: url({{asset('images/bgpolygon3.png')}});background-repeat: no-repeat;background-attachment: inherit;background-size: cover;">
                        <div class="card-body p-5 text-center">
                            <img src="{{asset('images/search.png')}}" alt="" class="mb-5" width="60px" height="70px">
                            <h3 class="h5 mb-2 text-center">Unique Collaborate </h3>
                            <p class="mb-4" style="font-weight: bolder; color: black;">
                                IGT allows advertisers to find,connect and collaborate with the right influencers or creators, giving you the quality engagement rate and ROI possible coupled with better analytics and reporting.
                            </p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 div-content" data-aos="fade-down">
                    <!-- feature block start -->
                    <div class="card mt-n8 uplift mb-8 bg-light" style="background-image: url({{asset('images/bgpolygon.png')}});background-repeat: no-repeat;background-attachment: inherit;background-size: cover;">
                        <div class="card-body p-5 text-center">
                            <img src="{{asset('images/rev.png')}}"  alt="" class="mb-5" width="60px" height="60px">
                            <h3 class="h5 mb-2 text-center">Review </h3>
                            <p class="mb-4" style="font-weight: bolder; color: grey;">
                                We have a very rigorous process in place before and after content creators / influencers are approved on the IGT platform; so you can be sure you are reaching real people that produces quality niche content, and will uphold brand quality standards.
                            </p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 div-content" data-aos="fade-down">
                    <!-- feature block start -->
                    <div class="card mt-n8 uplift mb-5 text-center bg-secondary" style="background-image: url({{asset('images/bgpolygon2.png')}});background-repeat: no-repeat;background-attachment: inherit;background-size: cover;">
                        <div class="card-body p-5">
                            <img src="{{asset('images/amp.png')}}" alt="" class="mb-5" width="60px" height="70px">
                            <h3 class="h5 mb-2 text-center">Amplify and Get Paid</h3>
                            <p class="mb-4" style="font-weight: bolder; color: black;">We supports various payment methods and also deliver payment to content creators / influencers, which includes payments escrowing, transactions via Bank accounts / other electronic payment systems. </p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
            </div>
        </div>

        <!-- image grid start  -->
        <div>
            <img src="{{asset('images/photogrid.png')}}" alt="" class="img-fluid">
        </div>
        <!-- image grid end  -->

        <h3 class="mb-2 text-center"><u><strong><br>..We mean it, when we say "You Get Value for your INFLUENCE!"</strong></u></h3>
    </div>

	<!-- cta section -->
    <div class="bg-info bg-shape pt-12 pb-14">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                    <div class="" data-aos="zoom-up">
                        <h2 class="text-white mb-4">Get our App on iOS or Android</h2>
                        <div class="d-inline-flex">
                            <a href="https://apps.apple.com/us/app/igotrend/id6740608556" target="_blank" class="mr-2"><img src="{{asset('images/app-store.svg')}}" alt="" class="img-fluid"></a>
                            <a href="https://play.google.com/store/apps/details?id=com.igt.IGoTrend" target="_blank" class="mr-2"><img src="{{asset('images/google-play.svg')}}" alt="" class="img-fluid"></a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- cta section -->
    <div class="pattern-bottom">
        <div class="pattern-slide"></div>
    </div>

    <div class="pt-xl-10 pb-xl-6 pb-8">
        <div class="container">
            <div class="row">
                <div class="offset-xl-1 col-xl-5 col-lg-6 col-md-6 col-sm-12 col-12">

                    <!-- feature section img start -->
                    <div data-aos="fade-up">
                        <img src="{{asset('images/igtpic1.png')}}" alt="" class="img-fluid mb-3">
                    </div>
                    <div class="mb-5" data-aos="fade-up">

                        <div class="">
                            <p><strong>Artists, Musicians, Choreographers,Comedy skit filmers & Producers</strong></p>
                            <h3 class="font-24 mb-2">Amplify your video using Micro to Macro Influencers</h3>
                            <p>By getting your videos, songs into every nooks and cranny of millenials heart and homes.</p>
                        </div>
                    </div>

                    <!-- feature section img close -->
                </div>
                <div class="offset-xl-1 col-xl-5 col-lg-6 col-md-6 col-sm-12 col-12">
                    <!-- feature section content start -->
                    <div class="mb-5" data-aos="fade-up">

                        <div class="">
                            <p><strong>For Influencers & Creators</strong></p>
                            <h3 class="font-24 mb-2">You Bring the Passion, We will Bring the Brands</h3>
                            <p>Get paid for your creativity and unique voice. Join the IGoTrend marketplace and bid on opportunities or get hired by brands and agencies.</p>
                        </div>
                    </div>
                    <div class="mb-5" data-aos="fade-up">

                        <div class=" mb-4">
                            <h3 class="font-24 mb-2">For Brands & Advertisers</h3>
                            <p>A cost effective, scalable, and predictable way to execute influencer marketing campaigns.</p>
                            <p>Find Influencers or Creators across all major social networks</p>
                        </div>

                        <div class="row">
                            <!-- client block start -->
                            <div class="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-6">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/tiktok.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/snapchat.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                        </div>
                    </div>
                    <!-- feature section content close -->
                </div>
            </div>
        </div>
    </div>
    <div class="py-8 bg-light">
        <div class="container">
            <div class="row">
                <div class="offset-xl-2 col-xl-8 offset-lg-2 col-lg-8 col-md-12 col-sm-12 col-12">
                    <!--  section heading start -->
                    <div class="text-center mb-10">
                        <h2 class="mb-2">Make smarter investments and maximize ROI</h2>
                       <!-- <p>Stop wasting money & time on expensive TV ads and chasing after celebrities. With IGoTrend software, you run profitable campaigns with hundreds of micro-, mid-tier- and  macro-influencers in a fraction of the time. </p> -->
                    </div>
                    <!--  section heading close -->
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                    <!--  pricing block start -->
                    <div class="card card-body py-5 px-4 mb-4 border-lightinfo" data-aos="zoom-in">
                        <div class="mb-3 text-center">
                            <h3 class="text-uppercase  font-14 textspace-lg text-info mb-3">Features</h3>
                            <p class="font-12">A data driven and AI powered platform.</p>
                        </div>
                        <div class="text-center">
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Search & Discovery
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>

                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Contact Mgt.
                                </p>
                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>

                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Contract Mgt.
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>

                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Campaign Mgt.
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>

                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Analytics & Reporting
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>

                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Rewards & Loyalty
                                </p>

                            </div>
                            <a href="#LearnMore" class="btn btn-outline-primary mt-4 btn-sm">Learn More</a>
                        </div>
                    </div>
                    <!--  pricing block close -->
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                    <!--  pricing block start -->
                    <div class="card card-body py-5 px-4 mb-4 border-lightpeach" data-aos="zoom-in">
                        <div class="mb-3 text-center">
                            <h3 class="text-uppercase font-14 textspace-lg text-danger mb-3">Industry</h3>
                            <p class="font-12">We serve these sets.</p>
                        </div>
                        <div class="text-center">
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Beauty
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Fashion
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Fitness
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Food
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Home & Family
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Health & Wellness
                                </p>

                            </div>
                            <!-- <div class="d-flex mb-2">
                                <!-- Check -->
                               <!--  <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div> -->

                                <!-- Text -->
                               <!--  <p class="mb-0 font-14">
                                    Entertainment
                                </p> -->

                           <!--  </div>  -->
                            <a href="#LearnMore" class="btn btn-outline-primary mt-4 btn-sm">And More!</a>
                        </div>
                    </div>
                    <!--  pricing block close -->
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                    <!--  pricing block start -->
                    <div class="card card-body py-5 px-4 mb-4 border-primary shadow" data-aos="zoom-in">
                        <div class="mb-3 text-center">
                            <h3 class="text-uppercase  font-14 textspace-lg text-primary mb-3">Creators</h3>
                            <!-- <p class="font-24 font-weight-bold text-dark">Free for life!</p> -->
                            <p class="font-12">Curated features to bring out the quality in you</p>
                        </div>
                        <div class="text-center">
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Exposure to brands
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    No Daily Limit
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Quick Payments
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Accept/Reject Offers
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Unlimited Messaging
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    24/7 Support/Guidance
                                </p>

                            </div>
                            <a href="creators.php" class="btn btn-outline-info mt-4 btn-sm">Start Now</a>
                        </div>
                    </div>
                    <!--  pricing block close -->
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                    <!--  pricing block start -->
                    <div class="card card-body py-5 px-4 mb-4 border-success" data-aos="zoom-in">
                        <div class="mb-3 text-center">
                            <h3 class="text-uppercase  font-14 textspace-lg text-success mb-3">Brands</h3>
                          <!--  <p class="font-24 font-weight-bold text-dark">Custom Pricing</p> -->
                            <p class="font-12">Amplify your advert program with extra support from our team.</p>
                        </div>
                        <div class="text-center">
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Unlimited Creators
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Unlimited Campaigns
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    No Daily Limit
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Advanced Reports
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    Your Branding
                                </p>

                            </div>
                            <div class="d-flex mb-2">
                                <!-- Check -->
                                <div class="bg-lightpalegreen mr-2 icon-shape icon-xs rounded-circle font-10 ">
                                    <i class="fas fa-check text-success"></i>
                                </div>

                                <!-- Text -->
                                <p class="mb-0 font-14">
                                    24/7 Support
                                </p>

                            </div>
                            <a href="brands.php" class="btn btn-outline-info mt-4 btn-sm">Start Now</a>
                        </div>
                    </div>
                    <!--  pricing block close -->
                </div>

            </div>
        </div>
    </div>
    <div class="pt-0 pb-6 bg-light">
        <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- section heading start -->
                    <div class=" text-center mb-13">
                        <h2>Collaborate seamlessly with brand(s) today!</h2>
                        <p>Get paid right after you complete your content or post directly to your bank account <!--, Totally <u>FREE</u> for life for Influencers and content Creators -->.</p>
                    </div>
                    <!-- section heading close -->
                </div>
            </div>
            <!-- company logo here  -->
        </div>
    </div>

 <!-- place company icons here -->
<div class="py-8">
        <div class="container">
          	<!-- remove later and move to company logo up -->
          	<div class="row">
                <!-- client block start -->
                <div class="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-6">
                    <div class="mb-4" data-aos="fade-up">
                        <p>
                            <img src="{{asset('images/phonetique.png')}}" alt="" class="img-fluid" width="350px" height="150px" >
                        </p>
                    </div>
                </div>
                <!-- client block close -->
                <!-- client block start -->
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                    <div class="mb-4" data-aos="fade-up">
                        <p>
                            <img src="{{asset('images/whogo.png')}}" alt="" class="img-fluid" width="350px" height="150px" >
                        </p>
                    </div>
                </div>
                <!-- client block close -->
                <!-- client block start -->
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                    <div class="mb-4" data-aos="fade-up">
                        <p>
                            <img src="{{asset('images/printivo.png')}}" alt="" class="img-fluid" width="350px" height="150px">
                        </p>
                    </div>
                </div>
                <!-- client block close -->
                <!-- client block start -->
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                    <div class="mb-4" data-aos="fade-up">
                        <p>
                            <img src="{{asset('images/tecno.png')}}" alt="" class="img-fluid" width="350px" height="100px">
                        </p>
                    </div>
                </div>
                <!-- client block close -->
                <!-- client block start -->
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                    <div class="mb-4" data-aos="fade-up">
                        <p>
                            <img src=" {{asset('images/checkd.png')}}" alt="" class="img-fluid" width="350px" height="150px">
                        </p>
                    </div>
                </div>
                <!-- client block close -->
                <!-- client block start -->
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6">
                    <div class="mb-4" data-aos="fade-up">
                        <p>
                            <img src="{{asset('images/konga.png')}}" alt="" class="img-fluid" width="350px" height="200px">
                        </p>
                    </div>
                </div>
                <!-- client block close -->
            </div>
          	<!-- remove later end -->
          
            <div class="row">
                <div class="offset-xl-2 col-xl-8 offset-lg-2 col-lg-8 col-md-12 col-sm-12 col-12 m-b-60">
                    <!--  section heading start 
                    <div class="text-center mb-10" data-aos="fade-up">
                        <h2>
                            What Our Customers are Saying</h2>
                        <p>We are a full-service AI powered platform, built to guide you through every step of the process, perfectly tailoring each campaign to meet your unique business needs.. </p>
                    </div>
                    <!--  section heading close -->
                </div>
            </div>
            <div class="row">
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--  testimonial block start 
                    <div class="card card-body p-5 text-center" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/lssimage.png')}}" class="" alt="Legion Security" width="60px" height="60px">
                        </div>
                        <div class="">
                            <p class="mb-5">Working with IGoTrend gives us the tools to find the right influencers to advocate for our brands.<br> The platform allows us to track actual, real-time results.</p>
                            <h5 class="h6 font-weight-bold mb-0">Legion Security service Ltd</h5>
                            <span class="small">Adewale A, MD/CEO</span>
                            <div class="rating font-12 text-warning">
                                <ul class="list-unstyled">
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--  testimonial block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--  testimonial block start 
                    <div class="card card-body p-5 text-center" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/jol.png')}}" class="" alt="Jolly Travels" width="70px" height="70px">
                        </div>
                        <div class="">
                            <p class="mb-5">The way we worked with content creators before IGoTrend was not a pretty experience. It took forever!.<br>Now, we've been able to grow by 56% using IGoTrend.</p>
                            <h5 class="h6 font-weight-bold mb-0">Jolly Travels</h5>
                            <span class="small">Elizabeth O. -Marketer</span>
                            <div class="rating font-12 text-warning">
                                <ul class="list-unstyled">
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--  testimonial block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--  testimonial block start 
                    <div class="card card-body p-5 text-center" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/nifty.png')}}" class="" alt="Nifty Records" width="70px" height="70px">
                        </div>
                        <div class="">
                            <p class="mb-5">IGoTrend helps us connect with micro to macro influencers, and we were able to amplify and trend our music video all across social platform</p>
                            <h5 class="h6 font-weight-bold mb-0">Nifty Records </h5>
                            <span class="small">Chuks A, Music Producer</span>
                            <div class="rating font-12 text-warning">
                                <ul class="list-unstyled">
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--  testimonial block close -->
                </div>

            </div>
        </div>
    </div>
 <!-- place company icons here -->

    <!-- features section start -->
    <div class="bg-shape" style="background: url({{asset('images/bg-shape-gradient.svg')}});background-size: cover;">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                    <div data-aos="fade-up" class="py-10"><br>
                        <h3 class="text-white h1" id="LearnMore">Who We Are?</h3>
                        <span class="mb-3 d-block text-white font-12 font-weight-bold text-uppercase">IGoTrend is an exclusive hub where advertisers, brands and trenders such as influencers or content creators connect.</span>
                        <p class="text-white mb-4">Our application process is selective and all of the trenders in our network are hand-picked. We accept about 10% of applicants who apply.<br> This ensures our influencers / creators have authentic and active followings, produce quality niche content, and will uphold brand quality standards.<br>
                            We make working with influencers / creators available at scale for any brand in Africa, providing quick and easy access to all of the world's leading social media channels in one click.<br>
                            Our global system of record enables intelligent creator discovery, streamlines end-to-end workflows, and drives meaningful measurement. </p>
                        <a href="{{route('services')}}" class="btn btn-primarydarker">See More</a>
                    </div>
                </div>
                <div class="offset-xl-1 col-xl-6 col-lg-5 col-md-12 col-sm-12 col-12">
                    <div class="pt-xl-6" data-aos="fade-down">
                        <img src="{{asset('images/bimnew.png')}}" alt="" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection


@push('js')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <script type="text/javascript">
        $(document).ready(function(){
            $('.slider').slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 1500,
                arrows: true,
                dots: false,
                pauseOnHover: true,
                prevArrow: '<i class="slick-prev fas fa-angle-left"></i>',
                nextArrow: '<i class="slick-next fas fa-angle-right"></i>',
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4,
                        }
                    },
                    {
                        breakpoint: 1000,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    }
                ]
            });
        });
    </script>
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
