@extends('layouts.app')
@section('title','Brands & Advertisers')
@push('cs')
<style>
    .bg-shape:before {
        background: url({{asset('images/bg-shape.svg')}}) !important;
    }
    .hero-marketing:after {
        background: url({{asset('images/curve-shape-img-1.png')}}) !important;
    }
</style>
@endpush
@section('content')
    <div class="hero-marketing bg-shape" style="background: linear-gradient(270deg, #063c8d 0%, #086bbd 101.08%), #66bbf3; background-size: cover;">
        <div class="container">
            <div class="row">
                <div class="offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- pagecaption start -->
                    <div class="py-xl-12 py-8  text-center" data-aos="fade-up ">
                        <h1 class="text-white">Brands & Advertisers</h1>
                        <p class="text-white mb-4">Build relationships with some of the most influential people on social media and collaborate to promote your story. </p>
                    </div>
                    <!-- pagecaption close -->
                    <!-- pagecaption start -->
                    <div class="img d-none d-lg-block" data-aos="fade-up" data-aos-delay="300">
                        <img src="{{asset('images/brandbanner.png')}}" alt="" class="img-fluid">
                        <div class="smallleft-img" data-aos="fade-right" data-aos-delay="1000">
                            <img src="{{asset('images/brandbanner3.png')}} " alt="" class="img-fluid">
                        </div>
                        <div class="smallright-img " data-aos="fade-left" data-aos-delay="2000">
                            <img src="{{asset('images/brandbanner2.png')}}" alt="" class="img-fluid">
                        </div>
                    </div>
                    <!-- pagecaption close -->
                </div>
            </div>
        </div>
    </div>
    <div class="py-xl-8 py-8 bg-shape bg-light">
        <div class="container">
            <div class="row">
                <div class="offset-xl-2 col-xl-8 offset-lg-2 col-lg-8 col-md-12 col-sm-12 col-12 m-b-60">
                    <!--  section heading start -->
                    <div class="text-center mb-10 aos-init aos-animate" data-aos="fade-up">
                        <h2 class="text-primary">The right solution for every business..</h2>

                    </div>
                    <!--  section heading close -->
                </div>
            </div>
            <div class="row">
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--  block start -->
                    <div class="card card-body p-5 text-center aos-init aos-animate" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/b2c.png')}}" class="" alt="" width="60px" height="60px">
                        </div>
                        <div class="">
                            <h5 class="h6 font-weight-bold mb-0">B2C Business</h5>
                            <p class="mb-5">Use our AI-powered software to search for influencers in any industry, in Africa, on any topic in minutes. Automate manual &amp; repetitive tasks to streamline your campaigns.</p>
                        </div>
                    </div>
                    <!--   block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--   block start -->
                    <div class="card card-body p-5 text-center aos-init aos-animate" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/agen.png')}}" class="" alt="" width="70px" height="70px">
                        </div>
                        <div class="">
                            <h5 class="h6 font-weight-bold mb-0">Agency </h5>
                            <p class="mb-5">Whether you are an expert or a newbie to influencer marketing, our team collaboration tools will help you streamline the entire process internally between you, the influencers and your clients.</p>
                        </div>
                    </div>
                    <!--   block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <!--   block start -->
                    <div class="card card-body p-5 text-center aos-init aos-animate" data-aos="fade-up">
                        <div class="mb-4">
                            <img src="{{asset('images/b2b.png')}}" class="" alt="" width="70px" height="70px">
                        </div>
                        <div class="">
                            <h5 class="h6 font-weight-bold mb-0">B2B Business</h5>
                            <p class="mb-5">Whether you want to stand out in your niche, increase your brand awareness, or launch a new product, our in-house team of experts helps you develop a comprehensive strategy.</p>
                        </div>
                    </div>
                    <!--   block close -->
                </div>

            </div>
        </div>
    </div>
    <div class="py-xl-8 py-6 bg-shape">
        <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center" data-aos="fade-up">
                    <!-- section heading start -->
                    <div class="mb-5">
                        <h4 class="font-18 text-muted">BRANDS WE'VE WORKED WITH</h4>
                    </div>
                    <!-- section heading close -->
                </div>
            </div>
            <div class="row">
                <div class="offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-12">

                    <div class="row">
                        <!-- client block start -->
                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6">
                            <div class="" data-aos="fade-up">

                                <img src="{{asset('images/phonetique.png')}}" alt="" class="img-fluid">

                            </div>
                        </div>
                        <!-- client block close -->
                        <!-- client block start -->
                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6">
                            <div class="" data-aos="fade-up">

                                <img src="{{asset('images/jolly.png')}}" alt="" class="img-fluid">

                            </div>
                        </div>
                        <!-- client block close -->
                        <!-- client block start -->
                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6">
                            <div class="" data-aos="fade-up">
                                <img src="{{asset('images/nifty.png')}}" alt="" class="img-fluid">

                            </div>
                        </div>
                        <!-- client block close -->
                        <!-- client block start -->
                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6">
                            <div class="" data-aos="fade-up">
                                <img src="{{asset('images/lss.png')}}" alt="" class="img-fluid">
                            </div>
                        </div>
                        <!-- client block close -->
                        <div class="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div class="row">
                                <!-- client block start -->
                                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div class="" data-aos="fade-up">
                                        <img src="{{asset('images/ded.png')}}" alt="" class="img-fluid">
                                    </div>
                                </div>
                                <!-- client block close -->
                                <!-- client block start -->
                                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div class="" data-aos="fade-up">
                                        <img src="{{asset('images/veekee.png')}}" alt="" class="img-fluid">
                                    </div>
                                </div>
                                <!-- client block close -->
                                <!-- client block start -->
                                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div class="" data-aos="fade-up">

                                        <img src="{{asset('images/amokelogonew.png')}}" alt="" class="img-fluid">

                                    </div>
                                </div>
                                <!-- client block close -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br><br>
            <div class="py-6 row d-flex align-items-center bg-transparent">
                <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div data-aos="fade-down">
                        <img src="{{asset('images/phoneinsta.png')}}" alt="" class="img-fluid">
                    </div>
                </div>
                <div class="offset-xl-1 col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                    <div data-aos="fade-up">
                        <span class="mb-4 d-block font-weight-bold text-primarydarker text-uppercase font-14">Team resource planning</span>
                        <h2 class="mb-3">Campaign suite for global teams </h2>
                        <p class="mb-4">iGoTrend platform streamlines the collaboration process, removing the complications so you can focus on what really matters. Our data-driven tool empowers teams to manage multi-member influencer campaigns, and make the quality decisions for their brands. </p>
                        <a href="#" class="btn btn-secondary">Manage your team</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="py-xl-8 py-6" style="background-color: #ededed;">
        <div class="container">
            <div class="row">
                <div class="offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                    <div class="mb-10" data-aos="fade-up">
                        <span class="mb-2 d-block font-weight-bold text-primarydarker text-uppercase font-14">Managed Service</span>
                        <h2 class="text-primary">Keep campaigns on track</h2>
                        <p>Tired of reviewing each applications? Let us do the heavy lifting for you. We will handle all the A-Z's of your Adverts / campaigns and amplify it with quality creators / influencers that matches your niche</p>

                    </div>
                    <div data-aos="fade-down">
                        <img src="{{asset('images/banner1.png')}}" alt="" class="img-fluid">
                    </div>
                    <a href="#" class="btn btn-dark mt-6">Let's Do It!</a>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-secondary bg-shape">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                    <div data-aos="fade-up" class="py-10">
                        <span class="mb-3 d-block text-white font-12 font-weight-bold text-uppercase">ALL-IN-ONE PLATFORM</span>
                        <h2 class="text-white h1">We treat brand and influencer collaborations seriously!</h2>
                        <p class="text-white mb-4">iGoTrend influencer / Creator  tool lets you find the right influencers that fit perfectly with your campaign. Discover influencers in your budget. Find Instagram, Tiktok, YouTube and twitter influencers in just a few clicks.</p>
                    </div>
                </div>
                <div class="offset-xl-1 col-xl-6 col-lg-5 col-md-12 col-sm-12 col-12">
                    <div class="pt-xl-6" data-aos="fade-down">
                        <img src="{{asset('images/socio.png')}}" alt="" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="pattern-bottom">
        <div class="pattern-slide"></div>
    </div>
@endsection
