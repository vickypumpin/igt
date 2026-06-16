@extends('layouts.app')
@section('title','Influencers & Content Creators')
@push('cs')
@endpush
@section('content')
    <div class="bg-shape">
        <div class="container">
            <div class="row">
                <div class="offset-xl-3 col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- pagecaption start -->
                    <div class="pt-12 text-center" data-aos="fade-up">
                        <h1 class="text-secondary">Instant collaboration with curated brands </h1>
                        <p class="font-20 mb-4"> Social account linkage not required.. Only handle(s)!</p>
                    </div>
                    <!-- pagecaption close -->
                </div>
            </div>
        </div>
    </div>
    <!-- hero slide twelveth close -->
    <div class="pt-10 pb-0 position-relative z-index-n1">
        <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- feature section start -->
                    <div class="task-screen text-center position-relative d-none d-md-none d-lg-block">
                        <div class="feature-section-big-img" data-aos="fade-up">
                            <img src="{{asset('images/creatorbanner2.png')}}" alt="" class="img-fluid">
                        </div>
                        <div class="task-chatbox position-absolute" data-aos="zoom-in">
                            <img src="{{asset('images/creatorbanner.png')}}" alt="" class="img-fluid">
                        </div>
                    </div>
                    <!-- feature section close -->
                </div>
            </div>
            <!-- client section -->

        </div>
    </div>
    <div class="py-xl-8 py-8 bg-shape bg-light">
        <div class="container">
            <div class="row">
                <div class="offset-xl-2 col-xl-8 offset-lg-2 col-lg-8 col-md-12 col-sm-12 col-12 m-b-60">
                    <!--  section heading start -->
                    <div class="text-center mb-10" data-aos="fade-up">
                        <h3 class="text-secondary">Gain access to our technology and discover all the possibilities it has to offer </h3>

                    </div>
                    <!--  section heading close -->
                </div>
            </div>
            <div class="row">
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--  block start -->
                    <div class="card card-body p-5 text-center" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/payroll-int.svg')}}" class="" alt="" width="60px" height="60px">
                        </div>
                        <div class="">
                            <h5 class="h6 font-weight-bold mb-0">Register</h5>
                            <p class="mb-5">Fill the registration form & wait for account review; usually less than 48 hours as we scrutinize all acounts to make sure necessary standards are met.</p>
                        </div>
                    </div>
                    <!--   block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--   block start -->
                    <div class="card card-body p-5 text-center" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/empolyee.svg')}}" class="" alt="" width="70px" height="70px">
                        </div>
                        <div class="">
                            <h5 class="h6 font-weight-bold mb-0">Collaborate </h5>
                            <p class="mb-5">Now that you're approved! Choose your favourite compaign, execute the task and publish the post on your social media account as slated in the campaign </p>
                        </div>
                    </div>
                    <!--   block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--   block start -->
                    <div class="card card-body p-5 text-center" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/folder.png')}}" class="" alt="" width="70px" height="70px">
                        </div>
                        <div class="">
                            <h5 class="h6 font-weight-bold mb-0">Recieve Bank Alert</h5>
                            <p class="mb-5">Smile to the bank as money will be deposited into your bank account within 2 days of campaign advertiser's approval.</p>
                        </div>
                    </div>
                    <!--   block close -->
                </div>

            </div>
        </div>
    </div>
    <div class="py-6">
        <div class="container">
            <div class="row">
                <div class="offset-xl-3 col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- heading section start -->
                    <div class="section-heading text-center mb-10" data-aos="fade-up">
                        <h2 class="section-heading-title text-secondary">Monetize your content, creativity, and influence in the largest marketplace of its kind.</h2>
                        <p class="section-heading-text">Connect with brands, advertisers, and publishers for sponsorship opportunities to create and share content across your social media accounts in exchange for compensation.</p>
                    </div>
                    <!-- heading section close -->
                </div>
            </div>
            <div class="row">
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="feature-block-v12 feature-block" data-aos="fade-up">
                        <div class="feature-img">
                            <img src="{{asset('images/vivibanner2.png')}}" alt="" class="img-fluid mb-7">
                        </div>
                        <div class="feature-content">
                            <h4 class="mb-3">Do what you love</h4>
                            <p class="mb-0">We bring the brands to you, so you don't have to waste time looking for contact details and pitching ideas, so that you can focus on doing what you love and engaging your audience.</p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="feature-block-v12 feature-block" data-aos="fade-up">
                        <div class="feature-img">
                            <img src="{{asset('images/createreward.png')}}" alt="" class="img-fluid mb-7">
                        </div>
                        <div class="feature-content">
                            <h4 class="mb-3">Earn Rewards</h4>
                            <p class="mb-0">IGT prides it self by administering rewards and loyalty such as mobile airtime or data; sponsored by advertisers for highly rated influencers and content creators delivering top notch campaigns for brands and products.</p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="feature-block-v12 feature-block" data-aos="fade-up">
                        <div class="feature-img">
                            <img src="{{asset('images/creatoralma.png')}}" alt="" class="img-fluid mb-7">
                        </div>
                        <div class="feature-content">
                            <h4 class="mb-3">Project collaboration spaces</h4>
                            <p class="mb-0">Our job is to maximise the diversity of campaign opportunities at hand. If your work is consistent and impactful we’ll ensure that you get the maximum number of brand campaign opportunities to choose from.</p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
            </div>

        </div>
    </div>
    <br><br>


    <!-- process block start -->
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
@endsection
