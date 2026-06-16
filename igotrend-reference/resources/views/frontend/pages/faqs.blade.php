@extends('layouts.app')
@section('title','Help Center')
@push('cs')
@endpush
@section('content')

 <div class="py-xl-8 py-5 bg-shape">
        <div class="container">
            <div class="row">
                <div class="col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12">
                    <!-- pagecaption start -->
                    <div class="pt-10" data-aos="fade-up">
                        <h2 class="caption-title">Welcome to IGoTrend Learning Center</h2>
                        <p class="caption-text">Guides, videos and tutorials to help you navigate IGoTrend.</p>
                        <p class="caption-text">Do take your quality time to go thru the content of this page as it will sensitize you and help</p>
                        <p class="caption-text">find answers to your questions; and learn tips to<br> enhance your IGoTrend experience.</p>
                        <p class="caption-text">Still Need Help? Chat us! we here to help</p>
                    </div>
                    <!-- pagecaption close -->
                </div>
                <div class="col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12">
                    <div class="graph d-md-block">
                        <div class="row">
                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <div class="graph-one mb-4 shadow" data-aos="fade-up" data-aos-delay="1000">
                                    <section class="bg-cover rounded shadow-lg py-12 pb-5" style="background: url({{asset('images/kpags.png')}})no-repeat;
                                            background-size: cover;">
                                        <!-- Button -->
                                        <a href="https://youtu.be/3nrECPW2pfg"
                                            class="icon-shape rounded-circle bg-white icon-xl text-decoration-none"
                                            data-fancybox>
                                            <i class="fas fa-play" class=""></i>
                                        </a>
                                    </section>
                                </div>
                                <div class="graph-two mb-4 shadow" data-aos="fade-down" data-aos-delay="1500">
                                    <section class="bg-cover rounded shadow-lg py-12 pb-5" style="background: url({{asset('images/intro.png')}})no-repeat;
                                            background-size: cover;">
                                        <!-- Button -->
                                        <a href="https://youtu.be/QaQZufgP_MM"
                                            class="icon-shape rounded-circle bg-white icon-xl text-decoration-none"
                                            data-fancybox>
                                            <i class="fas fa-play" class=""></i>
                                        </a>
                                    </section>
                                </div>
                            </div>
                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <div class="graph-three mb-4 shadow" data-aos="fade-up" data-aos-delay="2000">
                                    <section class="bg-cover rounded shadow-lg py-16 pb-5" style="background: url({{asset('images/servicethumbnail.png')}})no-repeat;
                                            background-size: cover;">
                                        <!-- Button -->
                                        <a href="https://youtu.be/Z2SMumesrAA"
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
    <!-- pageheader close -->
	<div class="py-14 py-6 bg-light my-n14">
        <div class="container">
            <div class="row">
                <div class="offset-xl-3 col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- heading section start -->
                    <div class="section-heading text-center mb-10" data-aos="fade-up">
                        <h2 class="section-heading-title">IGoTrend.com usage guide</h2>
                        <p class="section-heading-text">Discover the power of collaboration across trenders.</p>
                    </div>
                    <!-- heading section close -->
                </div>
            </div>
            <div class="row">
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="feature-block-v12 feature-block" data-aos="fade-up">
                        <div class="graph-one mb-4 shadow" data-aos="fade-up" data-aos-delay="1000">
                                    <section class="bg-cover rounded shadow-lg py-12 pb-5" style="background: url({{asset('images/influereg.png')}})no-repeat;
                                            background-size: cover;">
                                        <!-- Button -->
                                        <a href="https://youtu.be/EFuE2MJMwjA"
                                            class="icon-shape rounded-circle bg-white icon-xl text-decoration-none"
                                            data-fancybox>
                                            <i class="fas fa-play" class=""></i>
                                        </a>
                                    </section>
                                </div>
                        <div class="feature-content">
                            <h4 class="mb-3">HowTo: Creators Registration</h4>
                            <p class="mb-0">Detailed step by step guide for influencers and content creators on how to register, promote campaigns and get paid</p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="feature-block-v12 feature-block" data-aos="fade-up">
                        <div class="graph-one mb-4 shadow" data-aos="fade-up" data-aos-delay="1000">
                                    <section class="bg-cover rounded shadow-lg py-12 pb-5" style="background: url({{asset('images/brandreg.png')}})no-repeat;
                                            background-size: cover;">
                                        <!-- Button -->
                                        <a href="https://youtu.be/puKf2Lp17hc"
                                            class="icon-shape rounded-circle bg-white icon-xl text-decoration-none"
                                            data-fancybox>
                                            <i class="fas fa-play" class=""></i>
                                        </a>
                                    </section>
                                </div>
                        <div class="feature-content">
                            <h4 class="mb-3">HowTo: Brand/Advertisers Registration</h4>
                            <p class="mb-0">Detailed step by step for brands/advertisers on how to join and collaborate. </p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <!-- feature block start -->
                    <div class="feature-block-v12 feature-block" data-aos="fade-up">
                        <div class="graph-one mb-4 shadow" data-aos="fade-up" data-aos-delay="1000">
                                    <section class="bg-cover rounded shadow-lg py-12 pb-5" style="background: url({{asset('images/igtpc.png')}})no-repeat;
                                            background-size: cover;">
                                        <!-- Button -->
                                        <a href="https://youtu.be/ffExckFqaq8"
                                            class="icon-shape rounded-circle bg-white icon-xl text-decoration-none"
                                            data-fancybox>
                                            <i class="fas fa-play" class=""></i>
                                        </a>
                                    </section>
                                </div>
                        <div class="feature-content">
                            <h4 class="mb-3">How to post campaign and collaborate</h4>
                            <p class="mb-0">A detailed step by step guide on how to collaborate with trenders.</p>
                        </div>
                    </div>
                    <!-- feature block close -->
                </div>
            </div>
        </div>
    </div>
    <!--  FAQ questions and answers start  -->

    <div class="py-xl-6 py-2 bg-light bg-shape">
        <div class="container">
            <div class="row">
                <div class="offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12 text-center" data-aos="fade-up">
                    <!-- section heading start -->
                    <div class="mb-10">
                        <h2 class="text-secondary">Frequently asked questions</h2>
                        <p>
                        Below are general commonly asked questions.<br>
                        For account specific questions.. kindly log into your account and click the FAQs menu
                        </p>
                    </div>
                    <!-- section heading close -->
                </div>
            </div>

            <div class="row">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <!-- testimonial block -->
                    <div class="card" data-aos="fade-down">
                        <!-- testimonial content -->
                        <div class="card-body p-5">
                            <!-- testimonial meta -->
                            <h5 class="text-success">What is IGoTrend?</h5><br>
                            <p>A Content Creator & Influencer Marketing Platform.</p>
                            <p>Engage with brands, earn money, products & rewards. while producing great ROI for brands and advertisers</p>
                        </div>
                        <!-- testimonial content -->
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div class="card" data-aos="fade-down">
                        <!-- testimonial content -->
                        <div class="card-body p-5">
                            <h5 class="text-success">Is IGoTrend free?</h5>
                            <p>Registrations are free for all.. Advertisers, brands, influencers and content creators.</p>
                            <p>However, platform fees, payment gateway fee, tax may be included where necessary.</p>
                        </div>
                        <!-- testimonial content -->
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <!-- testimonial block -->
                    <div class="card" data-aos="fade-down">
                        <!-- testimonial content -->
                        <div class="card-body p-5">
                            <!-- testimonial meta -->
                            <h5 class="text-success">Why is my account pending?</h5>
                            <p>For Influencers and creators; we take time to scrutinize and verify account.</p>
                            <p>Usually, less than Four(4) hours. except for accounts with holds.</p>
                        </div>
                        <!-- testimonial content -->
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div class="card" data-aos="fade-down">
                        <!-- testimonial content -->
                        <div class="card-body p-5">
                            <h5 class="text-success">Which payment methods do you accept?</h5>
                            <p>We accept VISA, Mastercard, Verve, Bank Deposit & Trandsfers</p>
                            <p>We do not store card details as payments are process by third party payment system</p>
                        </div>
                        <!-- testimonial content -->
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <!-- testimonial block -->
                    <div class="card" data-aos="fade-down">
                        <!-- testimonial content -->
                        <div class="card-body p-5">
                            <!-- testimonial meta -->
                            <h5 class="text-success">What's the registration requirement?</h5>
                            <p>For Influencers and creators; You need to have atleast ten(10) thousand followers. On each individual platform you want to add to your account.</p>
                            <p>This requirements does not apply to brands and advertisers. </p>
                        </div>
                        <!-- testimonial content -->
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div class="card" data-aos="fade-down">
                        <!-- testimonial content -->
                        <div class="card-body p-5">
                            <h5 class="text-success">What social platforms does IGotrend support?</h5>
                            <p>We currently support Instagram, Facebook, Twitter, Tiktok, Snapchat, Youtube.</p>
                            <p>User's social media account login details are not and will not be required. <br>Your handles identifier is okay</p>
                        </div>
                        <!-- testimonial content -->
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <!-- testimonial block -->
                    <div class="card" data-aos="fade-down">
                        <!-- testimonial content -->
                        <div class="card-body p-5">
                            <!-- testimonial meta -->
                            <h5 class="text-success">Rates on IGoTrend?</h5>
                            <p>For Influencers and creators; users must upload their rates.</p>
                            <p>Brands and advertisers have the power to design their budgets. </p>
                        </div>
                        <!-- testimonial content -->
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <div class="card" data-aos="fade-down">
                        <!-- testimonial content -->
                        <div class="card-body p-5">
                            <h5 class="text-success">How fast can I get a response?</h5>
                            <p>Our team of experts monitors and follow up at every stages.</p>
                            <p>As soon as an advert campaign goes live after it has been reviewed by IGoTrend, you start getting applications and submissions instantly</p>
                        </div>
                        <!-- testimonial content -->
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
