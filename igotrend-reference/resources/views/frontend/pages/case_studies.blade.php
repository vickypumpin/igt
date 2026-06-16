@extends('layouts.app')
@section('title','Case Study')
@push('cs')
@endpush
@section('content')


<div class="mt-n8 bg-shape" style="margin-top:70px !important">
        <div class="container">
        <div class="row">
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div class="card mb-2 border-0" data-aos="zoom-in">

                        <img src="{{asset('images/ph1.png')}}" class="img-fluid rounded-top" alt="">

                        <div class="card-body border p-4">
                            <h3 class="text-danger font-14 text-uppercase font-weight-bold">Case Study</h3>
                            <p><img src="{{asset('images/instagram.png')}}" alt="Insta" class="img-fluid"> &nbsp; <img src="{{asset('images/snapchat.png')}}" alt="Insta" class="img-fluid"> </p>
                            <h3 class="text-success font-14 text-uppercase font-weight-bold">Phonetique NG</h3>
                            <p class="mb-4">Successfully reached 250k users on two different platforms: Snapchat and Instagram with an engagement rate of 5K with both unique deals and brand ambassadors. </p>
                            <a href="#modalCenter" class=" btn btn-secondary btn-sm" data-toggle="modal">Read more</a>
                        </div>
                    </div>
                </div>
                <!-- case study close -->
                <!-- case study start -->
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div class="card mb-2 border-0" data-aos="zoom-in">
                        <img src="{{asset('images/amo1.png')}}" alt="" class="img-fluid rounded-top">

                        <div class="card-body border p-4">
                            <h3 class="text-danger font-14 text-uppercase font-weight-bold">Case Study</h3>
                            <p><img src="{{asset('images/instagram.png')}}" alt="Insta" class="img-fluid"> &nbsp; <img src="{{asset('images/tiktok.png')}}" alt="tiktok" class="img-fluid">&nbsp; <img src="{{asset('images/facebook.png')}}" alt="FB" class="img-fluid"> </p>
                            <h3 class="text-success font-14 text-uppercase font-weight-bold">Amoke Stores</h3>
                            <p class="mb-4"> Amazing african food or delicious drinks? We could not choose either, so why should you: Amoke's store message about its diverse usage reached almost 118K with an engagement exceeding 12K. </p>
                            <a href="#modalCenter2" class=" btn btn-secondary btn-sm" data-toggle="modal">Read more</a>
                        </div>
                    </div>
                </div>
                <!-- case study close -->
                <!-- case study start -->
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div class="card mb-2 border-0" data-aos="zoom-in">
                        <img src="{{asset('images/jo1.png')}}" alt="" class="img-fluid rounded-top">

                        <div class="card-body border p-4">
                            <h3 class="text-danger font-14 text-uppercase font-weight-bold">Case Study</h3>
                            <p><img src="{{asset('images/instagram.png')}}" alt="Insta" class="img-fluid"> &nbsp; <img src="{{asset('images/tiktok.png')}}" alt="tiktok" class="img-fluid"> </p>
                            <h3 class="text-success font-14 text-uppercase font-weight-bold">Jolly Travels</h3>
                            <p class="mb-4">Successfully reached more than 50k users with only 5 content creators with a high engagement rate on Instagram and TikTok. </p>
                            <a href="#modalCenter3" class=" btn btn-secondary btn-sm" data-toggle="modal">Read more</a>
                        </div>
                    </div>
                </div>
                <!-- case study close -->
            </div>
        </div>
    </div>

	<!-- section
    <div class="py-xl-14 py-5 bg-light">
        <div class="container">
            <div class="row">
                <div class="offset-xl-3 col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- section heading start --
                    <div class="mb-10 text-center">
                        <h2 class="mb-0"> Here’s what our customers have been saying about us</h2>

                    </div>
                    <!-- section heading close --
                </div>
            </div>
            <div class="row">
                <div class="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- testimonial block start --
                    <div class="testimonial-carousel">
                        <div class="owl-carousel owl-theme card-testimonial">
                            <div class="item">
                                <div class="card" data-aos="fade-up">
                                    <div class="card-body  px-xl-12 py-xl-8">
                                        <p class="mb-4 text-center font-weight-semi-bold text-italic">
                                            “Working with IGoTrend gives us the tools to find the right influencers to advocate for our brands.<br> The platform allows us to track actual, real-time results.”
                                        </p>
                                        <div class="d-flex justify-content-center mx-auto">
                                            <img src="{{asset('images/lssimage.png')}}" alt="Legion Security"
                                                class="rounded-circle icon-lg mr-2">
                                            </p>
                                            <div class="">
                                                <h6 class="mb-0 font-weight-bold">
                                                Legion Security service Ltd
                                                </h6>
                                                <p class="small mb-0">
                                                Adewale A, MD/CEO</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="card" data-aos="fade-up">
                                    <div class="card-body  px-xl-12 py-xl-8">
                                        <p class="mb-4 text-center font-weight-semi-bold text-italic">
                                            “The way we worked with content creators before IGoTrend was not a pretty experience. It took forever!.<br>Now, we've been able to grow by 56% using IGoTrend.”
                                        </p>
                                        <div class="d-flex justify-content-center mx-auto">
                                            <img src="{{asset('images/jol.png')}}" alt="Jolly Travels"
                                                class="rounded-circle icon-lg mr-2">
                                            </p>
                                            <div class="">
                                                <h6 class="mb-0 font-weight-bold">
                                                Jolly Travels
                                                </h6>
                                                <p class="small mb-0">
                                                Elizabeth O. -Marketer</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="card" data-aos="fade-up">
                                    <div class="card-body px-xl-12 py-xl-8">
                                        <p class="mb-4 text-center font-weight-semi-bold text-italic">
                                            “IGoTrend helps us connect with micro to macro influencers, and we were able to amplify and trend our music video all across social platform” </p>
                                        <div class="d-flex justify-content-center mx-auto">
                                            <img src="{{asset('images/nifty.png')}}" alt="Nifty Records"
                                                class="rounded-circle icon-lg mr-2">
                                            </p>
                                            <div class="">
                                                <h6 class="mb-0 font-weight-bold">
                                                Nifty Records
                                                </h6>
                                                <p class="small mb-0">
                                                Chuks A, Music Producer</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- testimonial block close --
                </div>

            </div>
        </div>
    </div>

    <!-- footer section -->
    <!-- Modal HTML 1-->
    <div id="modalCenter" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content justify-content-center">
                <div class="modal-header">
                    <h6 class="modal-title">CASE STUDY</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="py-xl-4 py-5 bg-light">
                        <div class="container">
                            <div class="row">
                                <div class="offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12 text-center" data-aos="fade-up">
                                    <!-- section heading start -->
                                    <div class="mb-10">
                                        <img src="{{asset('images/phonetique.png')}}" class="" alt="Phonetique" height="100px">
                                        <p>
                                        Sells different brands of phones, tabs, and computers
                                        </p>
                                        <p>Service: Managed Service </p>
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
                                            <div>
                                                <h5 class="font-weight-bold h6">Campaign Objective</h5>
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
                                            <p>
                                            Raise brand awareness and position the product as fun, modern and youthful.
                                            </p><br>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="card" data-aos="fade-down">
                                        <!-- testimonial content -->
                                        <div class="card-body p-5">
                                            <!-- testimonial meta -->
                                            <div>
                                                <h5 class="font-weight-bold h6">Creator Task</h5>
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
                                            <p>

                                                -  Present their product in an authentic way <br>
                                                -  Post text, url to their pages & handles <br>
                                                -  Generate traffic to their website

                                            </p>
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
                                            <div>
                                                <h5 class="font-weight-bold h6">Results</h5>
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
                                            <p>
                                            Successfully reached 250k users on two different platforms: Snapchat and Instagram with an engagement rate of 5K with both unique deals and brand ambassadors.
                                            </p><br>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="card" data-aos="fade-down">
                                        <!-- testimonial content -->
                                        <div class="card-body p-5">
                                            <!-- testimonial meta -->
                                            <div>
                                                <h5 class="font-weight-bold h6">Deliverables</h5>
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
                                            <p>

                                            -  Educate potential clients about the new arrivals and features <br>

                                            -  Nurture long term relationships with creators through ambassador partnerships <br>

                                            -  Reach an audience of young, trendy adults
                                            </p>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal HTML -->

    <!-- Modal HTML 2-->
    <div id="modalCenter2" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content justify-content-center">
                <div class="modal-header">
                    <h6 class="modal-title">CASE STUDY</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="py-xl-4 py-5 bg-light">
                        <div class="container">
                            <div class="row">
                                <div class="offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12 text-center" data-aos="fade-up">
                                    <!-- section heading start -->
                                    <div class="mb-10">
                                        <img src="{{asset('images/amokelogonew.png')}}" class="" alt="Phonetique" height="100px">
                                        <p>
                                        Sells different kinds African foods and Groceries. -www.amokemarket.com
                                        </p>
                                        <p>Service: Managed Service </p>
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
                                            <div>
                                                <h5 class="font-weight-bold h6">Campaign Objective</h5>
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
                                            <p>
                                            Raise brand awareness and create positive associations with the brand.
                                            </p><br>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="card" data-aos="fade-down">
                                        <!-- testimonial content -->
                                        <div class="card-body p-5">
                                            <!-- testimonial meta -->
                                            <div>
                                                <h5 class="font-weight-bold h6">Creator Task</h5>
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
                                            <p>

                                                -  Inspire followers to order exciting combinations of africans groceries<br>
                                                -  Post amoke market website on their pages & handles <br>
                                                -  Use the #AmokeMarket hashtags

                                            </p>
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
                                            <div>
                                                <h5 class="font-weight-bold h6">Results</h5>
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
                                            <p>
                                            Amazing african food or delicious drinks? We could not choose either, so why should you: Amoke's store message about its diverse usage reached almost 118K with an engagement exceeding 12K.
                                            </p>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="card" data-aos="fade-down">
                                        <!-- testimonial content -->
                                        <div class="card-body p-5">
                                            <!-- testimonial meta -->
                                            <div>
                                                <h5 class="font-weight-bold h6">Deliverables</h5>
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
                                            <p>

                                            -  Generate sales on the target market  <br>

                                            -  Involve the most authentic foodie and lifestyle influencers <br>

                                            -  Create the basis of the whole digital campaign
                                            </p>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal HTML -->

    <!-- Modal HTML 3-->
    <div id="modalCenter3" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content justify-content-center">
                <div class="modal-header">
                    <h6 class="modal-title">CASE STUDY</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="py-xl-4 py-5 bg-light">
                        <div class="container">
                            <div class="row">
                                <div class="offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12 text-center" data-aos="fade-up">
                                    <!-- section heading start -->
                                    <div class="mb-10">
                                        <img src="{{asset('images/jolly.png')}}" class="" alt="Phonetique" height="100px">
                                        <p>
                                            Book cheap flights and hotels. - www.jollyairtime.com
                                        </p>
                                        <p>Service: Managed Service </p>
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
                                            <div>
                                                <h5 class="font-weight-bold h6">Campaign Objective</h5>
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
                                            <p>
                                            Increase sales during the low season in the hospitality and travel industry with a New Year campaign generating at least a total reach of 50K with an Instagram-TikTok integrated campaign.
                                            </p>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="card" data-aos="fade-down">
                                        <!-- testimonial content -->
                                        <div class="card-body p-5">
                                            <!-- testimonial meta -->
                                            <div>
                                                <h5 class="font-weight-bold h6">Creator Task</h5>
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
                                            <p>

                                                -  Motivate followers to travel using the campaign's coupon code<br>
                                                -  Show the excitement of travelling to inspire them  <br>
                                                -  Use the #jollytravel hashtag

                                            </p>
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
                                            <div>
                                                <h5 class="font-weight-bold h6">Results</h5>
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
                                            <p>
                                            Successfully reached more than 50k users with only 5 content creators with a high engagement rate on Instagram and TikTok.
                                            </p>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="card" data-aos="fade-down">
                                        <!-- testimonial content -->
                                        <div class="card-body p-5">
                                            <!-- testimonial meta -->
                                            <div>
                                                <h5 class="font-weight-bold h6">Deliverables</h5>
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
                                            <p>

                                            -  Involve the most authentic travel and lifestyle influencers  <br>

                                            -  Generate sales with the 'jolly20' coupon code  <br>

                                            </p>
                                        </div>
                                        <!-- testimonial content -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


@endsection
