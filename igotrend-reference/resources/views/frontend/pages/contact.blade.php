@extends('layouts.app')
@section('title','Contact -Request a service quote')
@push('cs')
@endpush
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script type="text/javascript" src="captcha.js"></script>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
@section('content')
    <div class="pageheader bg-shape" style="background: linear-gradient(270deg, #0099FF 0%, #086bbd 101.08%), #66bbf3; background-size: cover;">
        <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- pagecaption start -->
                    <div class="page-caption">
                        <div class="page-caption-para-text">
                            <h1 class="page-caption-title">Give us a shout</h1>
                            <p class="page-caption-para-text">Always available to serve!</p>
                        </div>
                    </div>
                    <!-- pagecaption close -->
                </div>
            </div>
        </div>

    </div>

    <!-- pageheader close -->
    <div class="mt-n8">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-3">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="icon-shape icon-lg bg-lightpeach text-danger rounded-circle mb-4">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <h5 class="mb-3 h6">Office(s)</h5>
                            <p class="small">Nigeria</p>
                            <p class="small">United States</p>

                        </div>
                    </div>

                </div>
                <div class="col-12 col-md-3">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="icon-shape icon-lg bg-lightpurple text-primary rounded-circle mb-4">
                                <i class="fas fa-phone"></i>
                            </div>
                            <h5 class="mb-3 h6">Phone Support</h5>
                            <p class="small">Looking for support? Submit a request form.
                            </p>
                            <p class="small">We will give you a call back!</p>

                        </div>
                    </div>

                </div>
                <div class="col-12 col-md-3">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="icon-shape icon-lg bg-lightwarning text-warning rounded-circle mb-4">
                                <i class="fas fa-envelope-open"></i>
                            </div>
                            <h5 class="mb-3 h6">Email Support </h5>
                            <p class="small">For support or any questions send email to us on.</p>
                            <a href="#" class="btn-link small mb-0 d-block">hello{at}igotrend.com</a>
                        </div>
                    </div>

                </div>
                <div class="col-12 col-md-3">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="icon-shape icon-lg bg-lightinfo text-info rounded-circle mb-4">
                                <i class="fas fa-comments"></i>
                            </div>
                            <h5 class="mb-3 h6">Live Chat</h5>
                            <p class="small">Mon - Sun.</p>
                            <p class="small">9am - 5pm.</p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="pt-xl-10 pb-xl-6 pb-8">
        <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- section heading start -->
                    <div class=" text-center mb-13">
                        <h2 id="managedservice" class="text-secondary font-weight-bold">Fully Managed Service</h2>
                        <p>We will handle all the A-Z's of your Advert/campaign and amplify it with the best creators/influencers that matches your niche</p>
                        <p>Fill out the form below and one of our experts will contact you to get you on board.</p>
                    </div>
                    <!-- section heading close -->
                </div>
            </div>
            <div class="row">
                <div class="offset-xl-1 col-xl-5 col-lg-6 col-md-6 col-sm-12 col-12">
                 <!-- Hubspot contact form starts -->
                  <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
                  <script>
                    hbspt.forms.create({
                      region: "na1",
                      portalId: "47133078",
                      formId: "3c0f8731-a6e6-4c58-a2c4-3d5e66bc88da"
                    });
                  </script>
                  <!-- Hubspot contact form ends -->
                  
                

                    <!-- feature section img close -->
                </div>
                <div class="offset-xl-1 col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                    <!-- feature section content start -->
                    <div class="mb-5" data-aos="fade-up">

                        <div class="">
                            <h3 class="font-24 mb-2 text-primary font-weight-bold">Creative Strategy & Direction</h3>
                            <p>We infuse your brand’s core messaging into everything we produce by working alongside the talent to create authentic, story-driven content that lives beyond the campaign. We create key strategy points, geared toward distribution and promotion, optimized for brand recognition and conversion.</p>
                        </div>
                    </div>
                    <div class="mb-5" data-aos="fade-up">

                        <div class=" mb-4">
                            <h3 class="font-24 mb-2 text-primary font-weight-bold">Network of Trenders</h3>
                            <p>Years of executing campaigns have helped us shape strong direct relationships with influencers, bloggers, and other creators. We not only ensure the perfect fit - but the perfect relationship.</p>
                        </div>
                    </div>
                    <!-- feature section content close -->
                </div>
            </div>
        </div>
    </div>
    <hr class="my-xl-2 my-2">
    <div class="py-4 bg-shape bg-warning">
        <div class="container">
            <div class="row">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ">
                    <!-- feature section start -->
                    <div class="p-4" data-aos="zoom-in">
                        <div class="media">
                            <div class="icon-shape icon-xl rounded-circle bg-lightpalegreen text-success mr-4 h4">
                                <i class="far fa-check-circle"></i>
                            </div>
                            <div class="media-body">
                                <h3 class="h4"> Reporting & Insights</h3>
                                <p class="mb-0">Results are everything. Our post-campaign reporting suite will reveal which influencers, social channels, types of content, and audiences performed the best.</p>
                            </div>
                        </div>
                    </div>
                    <!-- feature section close -->
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ">
                    <!-- feature section start -->
                    <div class="p-4" data-aos="zoom-in">
                        <div class="media">
                            <div class="media-icon icon-shape icon-xl rounded-circle bg-lightinfo text-info mr-4 h4">
                                <i class="fas fa-lightbulb"></i></div>
                            <div class="media-body">
                                <h3 class="h4">Innovative technology</h3>
                                <p class="mb-0">We invested years in building the data collection and refinement infrastructure that make up the IGT platform. We are extremely rigid about our accuracy and coverage; This enables us to provide the most comprehensive and accurate solution for all. </p>
                            </div>
                        </div>
                    </div>
                    <!-- feature section close -->
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ">
                    <!-- feature section start -->
                    <div class="p-4" data-aos="zoom-in">
                        <div class="media">
                            <div class="media-icon icon-shape icon-xl rounded-circle bg-lightpeach text-danger mr-4 h4">
                                <i class="fas fa-user-tie fa-fw"></i></div>
                            <div class="media-body">
                                <h3 class="h4"> Experienced Managers</h3>
                                <p class="mb-0">Talent acquisition and management is key to a successful campaign. We manage the entire contracting and negotiating process - including pricing strategy, legal contracts, compliance, and everything in between from campaign deliverables to final payment.</p>
                            </div>
                        </div>
                    </div>
                    <!-- feature section close -->
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ">
                    <!-- feature section start -->
                    <div class="p-4" data-aos="zoom-in">
                        <div class="media">
                            <div
                                class="media-icon icon-shape icon-xl rounded-circle bg-lightwarning text-warning mr-4 h4">
                                <i class="fas fa-star fa-fw"></i></div>
                            <div class="media-body">
                                <h3 class="h4">First-class service</h3>
                                <p class="mb-0">Our network includes influencers across Lifestyle, Beauty, Women's Fashion, Mommy, Food, Health, Menswear, Travel & more!. So we monitor trenders on your team and millions of others everyday so you don't have to. </p>
                            </div>
                        </div>
                    </div>
                    <!-- feature section close -->
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        var total;

        function getRandom(){return Math.ceil(Math.random()* 20);}
        function createSum(){
            var randomNum1 = getRandom(),
                randomNum2 = getRandom();
            total =randomNum1 + randomNum2;
            $( "#question" ).text( randomNum1 + " + " + randomNum2 + "=" );
            $("#ans").val('');
            checkInput();
        }

        function checkInput(){
            var input = $("#ans").val(),
                slideSpeed = 200,
                hasInput = !!input,
                valid = hasInput && input == total;
            $('#message').toggle(!hasInput);
            $('button[type=submit]').prop('disabled', !valid);
            $('#success').toggle(valid);
            $('#fail').toggle(hasInput && !valid);
        }

        $(document).ready(function(){
            //create initial sum
            createSum();
            // On "reset button" click, generate new random sum
            $('button[type=reset]').click(createSum);
            // On user input, check value
            $( "#ans" ).keyup(checkInput);
        });
    </script>
@endsection
