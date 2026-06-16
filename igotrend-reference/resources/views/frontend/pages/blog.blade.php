@extends('layouts.app')
@section('title','Blog')
@section('content')

<div class="pt-xl-8 pb-xl-6 py-8">
        <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div class="d-flex row">
                        <div class="col-lg-8 col-md-12 col-12 pr-0 d-none d-lg-block">
                            <img src="{{asset('images/soc.png')}}" alt="" class="img-fluid w-100" />
                        </div>
                        <div class="border col-lg-4 col-md-12 col-12 pl-0 border-left-0  rounded-right ">
                            <div class="card-body px-4 py-4">
                                <a href="#" class="badge badge-lightpeach text-danger mb-3 text-uppercase">INFLUENCER 101</a>
                                <h3 class=" h4 mb-3"><a href="{{route('what_does_influencer_mean')}}" class="text-dark">What does influencer mean?</a></h3>

                                <strong class="mb-0">An influencer</strong> is someone who has:
                                    <ul>
                                        <li class="mb-0">the power to affect the purchasing decisions of others because of his or her authority, knowledge, position, or ...</li>
                                    </ul>
                                <div class="media align-items-center mt-4 d-md-none d-lg-flex">
                                    <img src="{{asset('images/igt_logo.png')}}" alt=""
                                        class="img-fluid icon-md rounded-circle mr-2" />
                                    <div class="media-body">
                                        <span class="mr-2 font-weight-bold font-12"> <a href="#" class="text-primarydarker">IGT Team </a></span>
                                        <span class="font-14">December 11, 2020</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="pt-0 pb-xl-0 pb-6">
        <div class="container">
            <div class="row">
                <div class="col-md-12 mb-6">
                    <div class="nav-scroller">

                        <nav class="navbar navbar-light nav filter-nav align-items-center mb-3 border-bottom pb-3 px-0 d-xl-inline-flex mb-5" data-aos="fade-up">
                            <a class="active mr-4" href="#" data-filter="*" data-target="#blogs">
                                <span class="">All</span>
                            </a>
                            <a class="mr-4" href="#" data-filter=".creators" data-target="#blogs">
                                <span class="">Creators</span>
                            </a>
                            <a class="mr-4" href="#" data-filter=".brands" data-target="#blogs">
                                <span class="">Advertisers</span>
                            </a>
                            <a class="mr-4" href="#" data-filter=".news" data-target="#blogs">
                                <span class="">News</span>
                            </a>
                            <!-- <form class="ml-xl-auto w-40 d-none d-md-block">
                                <div class="input-group"> -->
                                    <!-- Input -->
                                    <!-- <input type="text" class="form-control border-right-0 form-control-sm "
                                        aria-label="Search our blog..." placeholder="Search our blog..." /> -->

                                    <!-- Append -->
                                    <!-- <div class="input-group-append">
                                        <span
                                            class="input-group-text py-1 pl-1 pr-3 px-3 bg-transparent border border-left-0">
                                            <i class="fa fa-search font-12"></i>
                                        </span>
                                    </div>
                                </div>
                            </form> -->
                        </nav>
                    </div>
                </div>
            </div>
            <div class="row " id="blogs" data-isotope='{"layoutMode": "fitRows"}' data-aos="zoom-in">
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 creators">
                    <div class="mb-8" data-aos="fade-up">
                        <!-- post classic block -->
                        <div class="mb-3">
                            <a href="#">
                                <img src="{{asset('images/creatvsinfl.png')}}" alt="" class="img-fluid rounded">
                            </a>
                        </div>
                        <div>
                            <p class="badge badge-lightpalegreen text-success mb-3 text-uppercase">Influencers</p>
                            <p class="badge badge-lightinfo text-success mb-3 text-uppercase">Content Creators</p>
                            <h3 class="font-20 mb-3">
                                <a href="#" class=" text-dark">Content Creators vs Influencers - Similarities and Differences</a>
                            </h3>
                            <div class="mb-3">
                                <div class="font-14">
                                    <span>January 19, 2021</span>
                                </div>
                            </div>
                            <p>Instagram is filled to the brim with dazzling images, authentic heartfelt posts, and the occasional sponsored post all about the latest diet fad. </p>
                            <div class="media align-items-center mt-4 d-md-none d-lg-flex">
                                <img src="{{asset('images/igt_logo.png')}}" alt=""
                                    class="img-fluid icon-md rounded-circle mr-2" />
                                <div class="media-body">
                                    <span class="mr-2 font-weight-bold font-12"> <a href="#" class="text-primarydarker">IGT Team </a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- post classic block -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 creators">
                    <div class="mb-8" data-aos="fade-up">
                        <!-- post classic block -->
                        <div class="mb-3">
                            <a href="#">
                                <img src="{{asset('images/connectbrands.png')}}" alt="" class="img-fluid rounded">
                            </a>
                        </div>
                        <div>
                            <p class="badge badge-lightinfo text-info mb-3 text-uppercase">Content Creators</p>
                            <p class="badge badge-lightpalegreen text-success mb-3 text-uppercase">Influencers</p>
                            <h3 class="font-20 mb-3">
                                <a href="#" class=" text-dark">How Influencers can Connect With Brands on Instagram</a>
                            </h3>
                            <div class="mb-3">
                                <div class="font-14">
                                    <span>January 14, 2021</span>
                                </div>
                            </div>
                            <p>If you believe yourself to be an Instagram influencer, you may wonder how you could earn money from your online social activities. You have probably heard stories..
                            </p>
                            <div class="media align-items-center mt-4 mb-5">
                                <img src="{{asset('images/igt_logo.png')}}" alt=""
                                    class="img-fluid icon-md rounded-circle mr-2">
                                <div class="media-body">
                                    <span class="mr-2 font-weight-bold font-12">
                                        <a href="#" class="text-primarydarker">IGT Team</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- post classic block -->
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 brands">
                    <div class="mb-8" data-aos="fade-up">
                        <!-- post classic block -->
                        <div class="mb-3">
                            <a href="#">
                                <img src="{{asset('images/event1.jpg')}}" alt="" class="img-fluid rounded">
                            </a>
                        </div>
                        <div>
                            <p class="badge badge-lightpeach text-danger mb-3 text-uppercase">Advertisers</p>
                            <p class="badge badge-warning text-danger mb-3 text-uppercase">Brands</p>
                            <h3 class="font-20 mb-3">
                                <a href="#" class="text-dark">How to Use Influencer Marketing to Promote Your Events</a>
                            </h3>
                            <div class="mb-3">
                                <div class="font-14">
                                    <span>January 11, 2021</span>
                                </div>
                            </div>

                            <p>Influencers have been popularly used to promote brands and products through sponsored posts on social media. Usually, this involves product placements...
                            </p>
                            <div class="media align-items-center mt-4 mb-5">
                                <img src="{{asset('images/igt_logo.png')}}" alt=""
                                    class="img-fluid icon-md rounded-circle mr-2">
                                <div class="media-body">
                                    <span class="mr-2 font-weight-bold font-12">
                                        <a href="#" class="text-primarydarker">IGT Team</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- post classic block -->
                </div>

            </div>
        </div>
    </div>
@endsection
