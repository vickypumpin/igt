@extends('layouts.app')
@section('title','Managed Services')
@push('cs')
@endpush
@section('content')
    <div class="py-xl-10 py-5 bg-info bg-shape">
        <div class="container">
            <div class="row">
                <div class="col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12">
                    <!-- pagecaption start -->
                    <div class="pt-10" data-aos="fade-up">
                        <h1 class=" text-white">What makes us great</h1>
                        <p class="text-light">Our team handles influencer sourcing, performance reporting, & everything in between.</p>
                    </div>
                    <div class="client-logo-v2-section mt-10">
                        <div class="row">
                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3" data-aos="zoom-in">
                                <h5 class="text-uppercase font-14">We use below media channels for your campaigns</h5>
                            </div>
                            <!-- client block start -->
                            <div class="col">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/tiktok.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>
                            <!-- client block close -->
                            <!-- client block start -->
                            <div class="col">
                                <div class="mb-4" data-aos="fade-up">
                                    <p>
                                        <img src="{{asset('images/snapchat.png')}}" alt="" class="img-fluid">
                                    </p>
                                </div>
                            </div>

                            <!-- client block close -->
                        </div>
                        <div class="d-flex align-items-center">
                            <a href="{{route('contact').'#managedservice'}}" class="btn btn-light btn-lg">Talk to an expert!</a>
                        </div><br>
                    </div>
                    <!-- pagecaption close -->
                </div>
                <div class="col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12">
                    <div class="graph  d-md-block">
                        <div class="row">
                            <div class="col-xl-12 col-lg-6 col-md-6 col-sm-12 col-12">
                                <div class="graph-one mb-4 shadow text-center" data-aos="fade-up" data-aos-delay="1000">
                                    <section class="bg-cover rounded shadow-lg py-15 pb-5" style="background: url({{asset('images/servicethumbnail.png')}})no-repeat;
                                            background-size: cover;">
                                        <!-- Button -->
                                        <a href="https://youtu.be/NP7NaVQn_dw"
                                           class="icon-shape rounded-circle bg-white icon-xl text-decoration-none"
                                           data-fancybox>
                                            <i class="fas fa-play" class=""></i>
                                        </a>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card-group" data-aos="zoom-in">
        <div class="card border-0">
            <div class="card-top-img">
                <img src="{{asset('images/servpic1.png')}}" class="w-100">
            </div>
        </div>
        <div class="card border-0">
            <div class="card-top-img">
                <img src="{{asset('images/servpic2.png')}}" class="w-100">
            </div>
        </div>
    </div>

    <!-- pageheader close -->
    <div class="mt-n8 bg-shape">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-12">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="py-xl-12 py-8 my-n8 text-center" data-aos="fade-up">
                                <div class="row">
                                    <div class="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                                        <div class="mb-12" data-aos="fade-up">
                                            <h2 class="text-success">Our Concise & Precise Process..</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <!-- featured start -->
                                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                                        <div class="card text-center border-0 mb-10 mb-xl-0 bg-secondary" data-aos="fade-up">
                                            <div class="mt-n6">
                                                <img src="{{asset('images/1st.png')}}" class="rounded-circle icon-xxl shadow-sm" alt="">
                                            </div>
                                            <div class="card-body p-5">
                                                <div class="mb-3">
                                                    <h3 class="mt-1 text-white font-14 text-uppercase font-weight-bold mb-1">
                                                        Develop a data-backed strategy
                                                    </h3>
                                                </div>
                                                <p>
                                                    Beginning with your goals, our team reverse engineers a launch strategy derived from a myriad of data including competitor audits, audience demographics matching, & channel-specific opportunities.
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                    <!-- featuredclose -->
                                    <!-- featured start -->
                                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                                        <div class="card text-center border-0 mb-10 mb-xl-0 bg-light" data-aos="fade-up">
                                            <div class=" mt-n6">
                                                <img src="{{asset('images/2nd.png')}}" class="rounded-circle icon-xxl shadow-sm" alt=""></div>
                                            <div class="card-body p-5">
                                                <div class="mb-3">
                                                    <h3 class="mt-1 text-secondary font-14 text-uppercase font-weight-bold mb-1">
                                                        Source top-performing niche trenders
                                                    </h3>
                                                </div>
                                                <p>
                                                    Our in-house tools help us find the perfect trenders for your campaign. Large or small, fashion or fishing, selecting creators with an intentful fan base using a world-class profile analysis technology.
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                    <!-- featured close -->
                                    <!-- featured start -->
                                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                                        <div class="card text-center border-0 bg-secondary" data-aos="fade-up">
                                            <div class=" mt-n6"><img src="{{asset('images/3rd.png')}}"
                                                                     class="rounded-circle icon-xxl shadow-sm" alt=""></div>
                                            <div class="card-body p-5">
                                                <div class="mb-3">
                                                    <h3 class="mt-1 text-white font-14 text-uppercase font-weight-bold mb-1">
                                                        Coordinate communication & logistics
                                                    </h3>
                                                </div>
                                                <p>
                                                    With the right trenders selected, our team will manage the entire process including introduction, contract negotiation, deployment, shipping, payments, and a maintained relationship for future activations.
                                                </p>

                                            </div>

                                        </div>
                                    </div>
                                    <!-- Featured close -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- cta section start -->
    <div class="py-xl-5 py-2" data-aos="zoom-in">
        <div class="container bg-warning rounded">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div class="p-6 d-xl-flex justify-content-between">
                        <div>
                            <p class="h1 text-white">Let's trend your products or brand!</p>
                        </div>
                        <div class="d-flex align-items-center">
                            <a href="{{route('contact').'#managedservice'}}" class="btn btn-light btn-lg">Request a quote</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- cta section close -->
    <hr class="my-xl-2 my-2">
    <div class="py-2 py-3 mt-xl-4 mt-6">
        <div class="container">

            <div class="row">
                <div class="offset-xl-3 col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- section heading start -->
                    <div class="section-heading text-center mb-10" data-aos="fade-up">
                        <h2 class="section-heading-title text-secondary">We do more advanced feature..</h2>
                        <p class="section-heading-text">Regardless, you will always know what you are spending as there are no hidden fees. </p>
                    </div>
                    <!-- section heading close -->
                </div>
            </div>
            <div class="row">
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="mb-6 feature-card" data-aos="zoom-in">
                        <div class="feature-icon">
                            <i class="fas fa-mail-bulk font-28 text-success mb-4"></i>
                        </div>
                        <div class="feature-content">
                            <h3 class="feature-title font-20 mb-2">SEO & Email Marketing</h3>
                            <p class="mb-0">The standard brand opportunity to drive taffic to your products & services and getting more engaged users that click, comment, share or buy. </p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="mb-6 feature-card active" data-aos="zoom-in">
                        <div class="feature-icon">
                            <i class="fas fa-ad font-28 text-danger mb-4"></i>
                        </div>
                        <div class="feature-content">
                            <h3 class="feature-title font-20 mb-2">Social media management</h3>
                            <p class="mb-0">We manage your social media marketing from start to finish so you can focus on your business – saving time and money. Fresh social media content, done for you, in just a few clicks.</p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="mb-6 feature-card" data-aos="zoom-in">
                        <div class="feature-icon">
                            <i class="fas fa-icons font-28 text-warning mb-4"></i>
                        </div>
                        <div class="feature-content">
                            <h3 class="feature-title font-20 mb-2">Digital branding and marketing</h3>
                            <p class="mb-0">we create social buzz and generate great ROI for your products and services using the latest technology, platform and strategy. </p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="mb-6 feature-card" data-aos="zoom-in">
                        <div class="feature-icon">
                            <i class="fas fa-photo-video font-28 text-info mb-4"></i>
                        </div>
                        <div class="feature-content">
                            <h3 class="feature-title font-20 mb-2">Graphic Designs & Video Prod.</h3>
                            <p class="mb-0">From packaging to motion pictures; we got the talent, zeal and the expertise to create and deliver a top-notch service. </p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="mb-6 feature-card active" data-aos="zoom-in">
                        <div class="feature-icon">
                            <i class="fas fa-bullhorn font-28 text-primary mb-4"></i>
                        </div>
                        <div class="feature-content">
                            <h3 class="feature-title font-20 mb-2"> Influencer/creator Marketing</h3>
                            <p class="mb-0">We help you run network specific campaigns to drive more ROI and engage audiences across Instagram, tiktok, Twitter, facebook and more! </p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="mb-6 feature-card" data-aos="zoom-in">
                        <div class="feature-icon">
                            <i class="fas fa-code font-28 text-secondary mb-4"></i>
                        </div>
                        <div class="feature-content">
                            <h3 class="feature-title font-20 mb-2">website Development</h3>
                            <p class="mb-0">Full-service impactful design that elevates your brand through the web. Our goal is building that first impression that can make the acquisition of a new client.</p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
            </div>
            <hr class="my-xl-2 my-2">

        </div>
    </div>

    <!-- features section close -->

    <!-- celebe image      -->
    <div class="py-xl-10 py-5 bg-light">
        <div class="container">

            <div class="row">
                <div class="col-md-5 mb-xl-8 mb-0" data-aos="fade-up">
                    <h2 class="text-success"> Celebrity Influencers & Content Creators </h2>
                    <p>We work with all levels of trenders in the industry; Even with celebs who won't literally repond to small scale campaigns except thru their managers or agency do work with us.
                    </p>
                </div>
            </div>
            <div class="row" data-aos="zoom-in">
                <div class="col-lg-3 col-md-6">
                    <div class="card border-0 mt-14 uplift">
                        <img src="{{asset('images/celeb1.png')}}" alt="" class="img-fluid rounded-top">
                        <div class="card-body bg-success rounded-bottom text-white ">

                            <h5 class="font-18 mb-0 text-white">@C***<i class="fas fa-lock mb-4"></i></h5>
                            <p class="mb-0 small"><p class="mb-0 small">
                                <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid"><img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid"><img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid"></p>
                        </div>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="card border-0 mt-10 uplift">
                        <img src=" {{asset('images/celeb2.png')}}" alt="" class="img-fluid rounded-top">
                        <div class="card-body bg-primarydarker rounded-bottom text-white ">

                            <h5 class="font-18 mb-0 text-white">@j***<i class="fas fa-lock mb-4"></i></h5>
                            <p class="mb-0 small"><p class="mb-0 small"><p class="mb-0 small">
                                <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                            </p>
                        </div>
                    </div>
                    <div class="card border-0 mt-4 uplift">
                        <img src="{{asset('images/celeb3.png')}}" alt="" class="img-fluid rounded-top">
                        <div class="card-body bg-lightpeach rounded-bottom text-white ">

                            <h5 class="font-18 mb-0 text-white">@r***<i class="fas fa-lock mb-4"></i></h5>
                            <p class="mb-0 small">
                            <p class="mb-0 small">
                                <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/snapchat.png')}}" alt="" class="img-fluid">
                            </p>
                        </div>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="card border-0 mt-4 uplift">
                        <img src="{{asset('images/celeb4.png')}}" alt="" class="img-fluid rounded-top">
                        <div class="card-body bg-danger rounded-bottom text-white ">

                            <h5 class="font-18 mb-0 text-white">@f***<i class="fas fa-lock mb-4"></i></h5>
                            <p class="mb-0 small"><p class="mb-0 small"><p class="mb-0 small">
                                <img src="{{asset('images/youtube.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/snapchat.png')}}" alt="" class="img-fluid">
                            </p>
                        </div>
                    </div>
                    <div class="card border-0 mt-4 uplift">
                        <img src="{{asset('images/celeb5.png')}}" alt="" class="img-fluid rounded-top">
                        <div class="card-body bg-secondary rounded-bottom text-white ">

                            <h5 class="font-18 mb-0 text-white">@n***<i class="fas fa-lock mb-4"></i></h5>
                            <p class="mb-0 small"><p class="mb-0 small">
                                <img src="{{asset('images/snapchat.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                            </p>
                        </div>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="card border-0 mt-0 uplift">
                        <img src="{{asset('images/celeb6.png')}}" alt="" class="img-fluid rounded-top">
                        <div class="card-body bg-warning rounded-bottom text-white ">

                            <h5 class="font-18 mb-0 text-white">@p***<i class="fas fa-lock mb-4"></i></h5>
                            <p class="mb-0 small"><p class="mb-0 small">
                                <img src="{{asset('images/twitter.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/tiktok.png')}}" alt="" class="img-fluid">
                            </p>
                        </div>
                    </div>
                    <div class="card border-0 mt-4 uplift">
                        <img src="{{asset('images/celeb7.png')}}" alt="" class="img-fluid rounded-top">
                        <div class="card-body bg-info rounded-bottom text-white ">

                            <h5 class="font-18 mb-0 text-white">@e***<i class="fas fa-lock mb-4"></i></h5>
                            <p class="mb-0 small">
                                <img src="{{asset('images/facebook.png')}}" alt="" class="img-fluid">
                                <img src="{{asset('images/instagram.png')}}" alt="" class="img-fluid">
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <!-- celeb imaghe close -->
    <div class="pattern-bottom">
        <div class="pattern-slide"></div>
    </div>
@endsection
