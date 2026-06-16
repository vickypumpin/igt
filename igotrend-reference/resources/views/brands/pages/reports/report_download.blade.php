<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    @yield('meta')
    <title>@yield('title')</title>
    @if($settings->site_description)
        <meta name="description" content="{{$settings->site_description}}">
    @endif
    @if($settings->seo_tags)
        <meta name="keywords" content="{{$settings->seo_tags}}">
    @endif
    @if($settings->site_favicon)
        <link rel="icon"  href="{{asset('/storage/favicon/'.$settings->site_favicon)}}">
    @else
        <link href="{{asset('images/igt_ico.ico')}}" rel="icon" />
    @endif
    <!-- Prevent the demo from appearing in search engines -->
    <meta name="robots" content="noindex">
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700%7COswald:300,400,500,700%7CRoboto:400,500%7CExo+2:600&display=swap" rel="stylesheet">
    <link type="text/css" href="{{asset('css/dashboard.css')}}" rel="stylesheet">
    @stack('css')
</head>

<body class="layout-boxed layout-sticky-subnav ">


<div class="mdk-drawer-layout js-mdk-drawer-layout" data-push data-responsive-width="992px">
    <div class="mdk-drawer-layout__content page-content">

        <button class="btn btn-accent" id="download_invoice" >
            Download <i class="material-icons icon--right">file_download</i>
        </button>
        <!--  ####### Page content ######   -->

        <a href="{{route('reports')}}" class="btn btn-primary">
            Back <i class="material-icons icon--right">arrow_back</i>
        </a>

        <div id="invoice">
            <nav class="navbar navbar-expand-sm navbar-list border-bottom-2  py-sm-16pt">
                <div class="container-fluid page__container">
                    <div class="page-separator">
                        <div class="page-separator__text">Campaign Reports</div>
                    </div>

                    <div class="row card-group-row mb-lg-8pt">
                        <div class="col-lg-4 col-md-6 card-group-row__col">
                            <div class="card card-group-row__card">
                                <div class="card-body d-flex flex-row align-items-center">
                                    <div class="flex">
                                        <p class="d-flex align-items-center mb-0">
                                            <strong>Total Spend</strong>
                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                        </p>
                                        <span class="h3 m-0">
                                       &nbsp; {{number_format($budget)}}
                                        </span>
                                    </div>
                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                </div>
                                <div class="progress" style="height: 3px;">
                                    <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 card-group-row__col">
                            <div class="card card-group-row__card">
                                <div class="card-body d-flex flex-row align-items-center">
                                    <div class="flex">
                                        <p class="d-flex align-items-center mb-0">
                                            <strong>Reach </strong>

                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                        </p>
                                        <span class="h3 m-0">
                                            {{number_format($total_reach)}}
                                            <!-- <small class="text-muted"> / 50,000</small> -->
                                        </span>
                                    </div>
                                    <i class="material-icons icon-32pt text-20 ml-8pt">radio_button_checked</i>
                                </div>
                                <div class="progress" style="height: 3px;">
                                    <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 card-group-row__col">
                            <div class="card card-group-row__card">
                                <div class="card-body d-flex flex-row align-items-center">
                                    <div class="flex">
                                        <p class="d-flex align-items-center mb-0">
                                            <strong>Engagement</strong>

                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                        </p>
                                        <span class="h3 m-0">
                                              {{number_format($total_engagement)}}
                                            <!-- <small class="text-muted"> / 50,000</small> -->
                                        </span>
                                    </div>
                                    <i class="material-icons icon-32pt text-20 ml-8pt">radio_button_checked</i>
                                </div>
                                <div class="progress" style="height: 3px;">
                                    <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>

            <div class="page-section bg-alt border-bottom-2">
                <div class="container-fluid page__container">
                    <div class="row">
                        <div class="col-lg-9">
                            <div class="row">
                                <div class="col-md-6 mb-24pt mb-lg-0">
                                    <p class="text-70 mb-0"><strong>Campaign Name</strong></p>
                                    <h3>{{$campaign->name}}</h3>
                                    <p class="text-70 mb-0"><strong>Sponsor</strong></p>
                                    <p class="text-50">{{$campaign->sponsor}}</p>
                                    <p class="text-70 mb-0"><strong>Type</strong>&nbsp; creators/Influencer</p>
                                    <p class="text-70 mb-0"><strong>Age:</strong>&nbsp; {{str_replace(';','-',$campaign->age_range)}}</p>
                                    <p class="text-70 mb-0"><strong>No.# of Trenders</strong>&nbsp; {{$campaign->no_of_trender}}</p>
                                    @if($campaign->campaign_category)
                                        <p class="text-70 mb-0"><strong>Content Category:</strong>&nbsp;{{$campaign->campaign_category->name}}</p>
                                    @endif
                                    @if($campaign->campaign_creator_category)
                                        <p class="text-70 mb-0"><strong>Creator Category:</strong>&nbsp;{{$campaign->campaign_creator_category->name}}</p>
                                    @endif
                                </div>
                                <div class="col-md-6">
{{--                                    <p class="text-70 mb-0"><strong>Platform</strong></p>--}}
                                    <p class="text-70 mb-0"><strong>Campaign Type:</strong></p>
                                    <p>
                                        @if($campaign->type == \App\Models\Campaign::INFLUENCER_TYPE)
                                            <b>Influencer Campaign</b>
                                        @else
                                            <b>Creator Campaign</b>
                                        @endif
{{--                                        @if($campaign->campaign_duration == "day")--}}
{{--                                            @if((int)$campaign->daily_instagram_post >= 1 || (int)$campaign->daily_instagram_story_post >= 1 || (int)$campaign->daily_instagram_reel  >= 1||  (int)$campaign->daily_instagram_live  >= 1  )--}}
{{--                                                <img src="{{asset('images/instagram.png')}} " width="18" height="18" alt="Insta">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->daily_fb_post >= 1 || (int)$campaign->daily_fb_story_post >= 1 || (int)$campaign->daily_fb_reel >= 1 || (int)$campaign->daily_fb_live >= 1 )--}}
{{--                                                <img src="{{asset('images/facebook.png')}}" width="18" height="18" alt="FB">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->daily_tiktok_post >= 1 || (int)$campaign->daily_tiktok_video_15_s >= 1 || (int)$campaign->daily_tiktok_video_60_s >= 1 || (int)$campaign->daily_tiktok_video_10_m >= 1 )--}}
{{--                                                <img src="{{asset('images/tiktok.png')}}" width="18" height="18" alt="Tik">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->daily_youtube_post >= 1  || (int)$campaign->daily_youtube_video >= 1 || (int)$campaign->daily_youtube_short >= 1 || (int)$campaign->daily_youtube_live >= 1)--}}
{{--                                                <img src="{{asset('images/youtube.png')}}" width="18" height="18" alt="YT">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->daily_twitter_post >= 1 || (int)$campaign->daily_twitter_poll >= 1 || (int)$campaign->daily_twitter_space >= 1 )--}}
{{--                                                <img src="{{asset('images/twitter.png')}}" width="18" height="18" alt="Twitter">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->daily_snapchat_story >= 1  || (int)$campaign->daily_snapchat_video >= 1 )--}}
{{--                                                <img src="{{asset('images/snapchat.png')}}" width="18" height="18" alt="SNAP">--}}
{{--                                            @endif--}}
{{--                                        @else--}}
{{--                                            @if((int)$campaign->weekly_instagram_post >= 1 || (int)$campaign->weekly_instagram_story_post >= 1 || (int)$campaign->weekly_instagram_reel  >= 1||  (int)$campaign->weekly_instagram_live  >= 1  )--}}
{{--                                                <img src="{{asset('images/instagram.png')}} " width="18" height="18" alt="Insta">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->weekly_fb_post >= 1 || (int)$campaign->weekly_fb_story_post >= 1 || (int)$campaign->weekly_fb_reel >= 1 || (int)$campaign->weekly_fb_live >= 1 )--}}
{{--                                                <img src="{{asset('images/facebook.png')}}" width="18" height="18" alt="FB">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->weekly_tiktok_post >= 1 || (int)$campaign->weekly_tiktok_video_15_s >= 1 || (int)$campaign->weekly_tiktok_video_60_s >= 1 || (int)$campaign->weekly_tiktok_video_10_m >= 1 )--}}
{{--                                                <img src="{{asset('images/tiktok.png')}}" width="18" height="18" alt="Tik">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->weekly_youtube_post >= 1  || (int)$campaign->weekly_youtube_video >= 1 || (int)$campaign->weekly_youtube_short >= 1 || (int)$campaign->weekly_youtube_live >= 1)--}}
{{--                                                <img src="{{asset('images/youtube.png')}}" width="18" height="18" alt="YT">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->weekly_twitter_post >= 1 || (int)$campaign->weekly_twitter_poll >= 1 || (int)$campaign->weekly_twitter_space >= 1 )--}}
{{--                                                <img src="{{asset('images/twitter.png')}}" width="18" height="18" alt="Twitter">--}}
{{--                                            @endif--}}
{{--                                            @if((int)$campaign->weekly_snapchat_story >= 1  || (int)$campaign->weekly_snapchat_video >= 1 )--}}
{{--                                                <img src="{{asset('images/snapchat.png')}}" width="18" height="18" alt="SNAP">--}}
{{--                                            @endif--}}
{{--                                        @endif--}}
                                    </p>
                                    <p class="text-70 mb-0"><strong>Mode:</strong> &nbsp; {{ucfirst($campaign->mood)}}</p>
                                    <p class="text-70 mb-0"><strong>Status:</strong>
                                        @if($campaign->status == \App\Models\Campaign::PENDING)
                                            Pending
                                        @elseif($campaign->status == \App\Models\Campaign::ACTIVE)
                                            Active
                                        @elseif($campaign->status == \App\Models\Campaign::DECLINE)
                                            Declined
                                        @elseif($campaign->status == \App\Models\Campaign::COMPLETED)
                                            completed
                                        @endif
                                    </p>
                                    <p class="text-70 mb-0"><strong>Start:</strong>&nbsp; {{\Carbon\Carbon::parse($campaign->start_date)->format('d/m/Y')}}</p>
                                    <p class="text-70 mb-0"><strong>End date:</strong>&nbsp; {{\Carbon\Carbon::parse($campaign->end_date)->format('d/m/Y')}}</p>
                                    <p class="text-70 mb-0"><strong>Duration:</strong>&nbsp;
                                        @if($campaign->campaign_duration == "day")
                                            @if((int)$campaign->no_of_day == 1)
                                                {{$campaign->no_of_day}} day
                                            @else
                                                {{$campaign->no_of_day}} days
                                            @endif
                                        @else
                                            @if((int)$campaign->no_of_week == 1)
                                                {{$campaign->no_of_week}} week
                                            @else
                                                {{$campaign->no_of_week}} weeks
                                            @endif
                                        @endif
                                    </p>
                                    @php
                                        $format = new NumberFormatter("en", NumberFormatter::SPELLOUT);
                                        $post_format = $format->format($count_posts_story['total_deliverables']);
                                        if($campaign->type == 2){
                                                 $story_format = $format->format(1);
                                        }else{
                                                 $story_format = $format->format(0);
                                        }
                                    @endphp
                                    <p class="text-70 mb-0"><strong>Total Social Media Deliverables:</strong>&nbsp;{{$post_format}} ({{$count_posts_story['total_deliverables']}})</p>
                                    @if($campaign->type == "2")
                                        <p class="text-70 mb-0"><strong>Total Creator Content Deliverables :</strong>&nbsp; {{$story_format}} (1)</p>
                                    @else
                                        <p class="text-70 mb-0"><strong>Total Creator Content Deliverables :</strong>&nbsp; {{$story_format}} (0)</p>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <div class="card">
                                @if(!$campaign->getMedia('campaign_cover_image')->isEmpty())
                                    <img src="{{asset($campaign->getMedia('campaign_cover_image')->first()->getUrl())}}" alt="" class="card-img" height="175px">
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-fluid page__container">
                <div class="row">
                    <div class="col-lg-9 pr-lg-0">

                        <div class="page-section">
                            <h4>Campaign Brief</h4>

                            <div class="card card-body">
                                <div class="d-flex">
                                    <a href="#" class="avatar avatar-32pt  mr-12pt">
                                        <img src="{{ get_user_image($campaign->user_id) }}" alt="people" class="avatar-img rounded-circle">
                                    </a>
                                    <div class="flex">
                                        <p class="d-flex align-items-center mb-2">
                                            <a href="#" class="text-body mr-2"><strong>Brand Description</strong></a>
                                        </p>
                                        <p class="text-justify">{{$campaign->brand_description}}</p>
                                        @if(!$campaign->getMedia('campaign_media_files')->isEmpty())
                                            @foreach($campaign->getMedia('campaign_media_files') as $media)
                                                <a href="{{asset($media->getUrl())}}" class="d-flex align-items-center border-1 rounded mb-0 p-8pt" download="">
                                                <span class="mr-8pt p-8pt bg-secondary rounded" style="width: 40px; height: 40px;">
                                                    <i class="material-icons icon-24pt text-white">file_download</i>
                                                </span>
                                                    <span class="flex d-flex flex-column">
                                                    <span class="text-100">{{$media->file_name}}</span>
                                                </span>
                                                    <span class="text-70 text-underline mr-8pt">download</span>
                                                </a>
                                            @endforeach
                                        @endif

                                    </div>
                                </div>
                            </div>
                            <div class="html2pdf__page-break"></div>

                            <!-- // Start List all the deliverables -->
                            <div class="page-separator">
                                <div class="page-separator__text">Deliverables </div>
                            </div>

                            <div class="row ">
                                @if($campaign->campaign_duration == "day")
                                    <div class="col-md-4">
                                        <div class="row">
                                            @if((int)$campaign->daily_instagram_post >= 1 || (int)$campaign->daily_instagram_story_post >= 1 || (int)$campaign->daily_instagram_reel  >= 1||  (int)$campaign->daily_instagram_live  >= 1  )
                                                <!-- // Start instagram deliverables  -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Instagram</strong>&nbsp;
                                                                        <img src="{{asset('images/instagram.png')}}" width="24" height="24" >
                                                                    </p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->daily_instagram_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                        <small class="text-50 lh-24pt"><strong>Qty => {{$campaign->daily_instagram_post ?? 0}}</strong></small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_instagram_story_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Story</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_instagram_story_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_instagram_reel >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Reel</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_instagram_reel ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_instagram_live >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_instagram_live ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // instagram deliverables ends   -->
                                            @endif
                                            @if((int)$campaign->daily_fb_post >= 1 || (int)$campaign->daily_fb_story_post >= 1 || (int)$campaign->daily_fb_reel >= 1 || (int)$campaign->daily_fb_live >= 1 )
                                                <!-- // start FB deliverables -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Facebook</strong>&nbsp;<img src="{{asset('images/facebook.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->daily_fb_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_fb_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_fb_story_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Story</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_fb_story_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_fb_reel >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Reel</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_fb_reel ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_fb_live >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_fb_live ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // End FB deliverables  -->
                                            @endif
                                        </div>
                                    </div>
                                    <div class="col-md-4">

                                        <div class="row">
                                            @if((int)$campaign->daily_tiktok_post >= 1 || (int)$campaign->daily_tiktok_video_15_s >= 1 || (int)$campaign->daily_tiktok_video_60_s >= 1 || (int)$campaign->daily_tiktok_video_10_m >= 1 )
                                                <!-- // Start TikTok deliverables  -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>TikTok</strong>&nbsp;<img src="{{asset('images/tiktok.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->daily_tiktok_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_tiktok_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_tiktok_video_15_s >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video 15s</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_tiktok_video_15_s ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_tiktok_video_60_s >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video 60s</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_tiktok_video_60_s ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_tiktok_video_10_m >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video 10m</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_tiktok_video_10_m ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // TK deliverables ends   -->
                                            @endif
                                            @if((int)$campaign->daily_youtube_post >= 1  || (int)$campaign->daily_youtube_video >= 1 || (int)$campaign->daily_youtube_short >= 1 || (int)$campaign->daily_youtube_live >= 1)
                                                <!-- // start youtube deliverables -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Youtube</strong>&nbsp;<img src="{{asset('images/youtube.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->daily_youtube_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_youtube_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_youtube_video >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_youtube_video ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_youtube_short >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Short</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_youtube_short ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_youtube_live >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_youtube_live ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // End YT deliverables  -->
                                            @endif
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="row">
                                            @if((int)$campaign->daily_twitter_post >= 1 || (int)$campaign->daily_twitter_poll >= 1 || (int)$campaign->daily_twitter_space >= 1 )
                                                <!-- // Start Twitter X deliverables  -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Twitter (X)</strong>&nbsp;<img src="{{asset('images/twitter.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->daily_twitter_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Tweet</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_twitter_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_twitter_poll >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>poll</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_twitter_poll ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_twitter_space >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>space</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_twitter_space ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // Twitter deliverables ends   -->
                                            @endif
                                            @if((int)$campaign->daily_snapchat_story >= 1  || (int)$campaign->daily_snapchat_video >= 1 )
                                                <!-- // start Snap deliverables -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Snapchat</strong>&nbsp;<img src="{{asset('images/snapchat.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->daily_snapchat_story >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Snap</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_snapchat_story ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->daily_snapchat_video >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->daily_snapchat_video ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // End FB deliverables  -->
                                            @endif
                                        </div>
                                    </div>
                                @else
                                    <div class="col-md-4">

                                        <div class="row">
                                            @if((int)$campaign->weekly_instagram_post >= 1 || (int)$campaign->weekly_instagram_story_post >= 1 || (int)$campaign->weekly_instagram_reel  >= 1||  (int)$campaign->weekly_instagram_live  >= 1  )
                                                <!-- // Start instagram deliverables  -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Instagram</strong>&nbsp;
                                                                        <img src="{{asset('images/instagram.png')}}" width="24" height="24" >
                                                                    </p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->weekly_instagram_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                        <small class="text-50 lh-24pt"><strong>Qty => {{$campaign->weekly_instagram_post ?? 0}}</strong></small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_instagram_story_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Story</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_instagram_story_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_instagram_reel >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Reel</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_instagram_reel ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_instagram_live >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_instagram_live ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // instagram deliverables ends   -->
                                            @endif
                                            @if((int)$campaign->weekly_fb_post >= 1 || (int)$campaign->weekly_fb_story_post >= 1 || (int)$campaign->weekly_fb_reel >= 1 || (int)$campaign->weekly_fb_live >= 1 )
                                                <!-- // start FB deliverables -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Facebook</strong>&nbsp;<img src="{{asset('images/facebook.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->weekly_fb_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_fb_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_fb_story_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Story</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_fb_story_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_fb_reel >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Reel</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_fb_reel ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_fb_live >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_fb_live ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // End FB deliverables  -->
                                            @endif
                                        </div>

                                    </div>
                                    <div class="col-md-4">
                                        <div class="row">
                                            @if((int)$campaign->weekly_tiktok_post >= 1 || (int)$campaign->weekly_tiktok_video_15_s >= 1 || (int)$campaign->weekly_tiktok_video_60_s >= 1 || (int)$campaign->weekly_tiktok_video_10_m >= 1 )
                                                <!-- // Start TikTok deliverables  -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>TikTok</strong>&nbsp;<img src="{{asset('images/tiktok.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->weekly_tiktok_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_tiktok_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_tiktok_video_15_s >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video 15s</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_tiktok_video_15_s ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_tiktok_video_60_s >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video 60s</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_tiktok_video_60_s ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_tiktok_video_10_m >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video 10m</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_tiktok_video_10_m ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // TK deliverables ends   -->
                                            @endif
                                            @if((int)$campaign->weekly_youtube_post >= 1  || (int)$campaign->weekly_youtube_video >= 1 || (int)$campaign->weekly_youtube_short >= 1 || (int)$campaign->weekly_youtube_live >= 1)

                                                <!-- // start youtube deliverables -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Youtube</strong>&nbsp;<img src="{{asset('images/youtube.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->weekly_youtube_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_youtube_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_youtube_video >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_youtube_video ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_youtube_short >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Short</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_youtube_short ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_youtube_live >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_youtube_live ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // End YT deliverables  -->
                                            @endif
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="row">
                                            @if((int)$campaign->weekly_twitter_post >= 1 || (int)$campaign->weekly_twitter_poll >= 1 || (int)$campaign->weekly_twitter_space >= 1 )
                                                <!-- // Start Twitter X deliverables  -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Twitter (X)</strong>&nbsp;<img src="{{asset('images/twitter.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->weekly_twitter_post >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Tweet</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_twitter_post ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_twitter_poll >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>poll</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_twitter_poll ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_twitter_space >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>space</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_twitter_space ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // Twitter deliverables ends   -->
                                            @endif
                                            @if((int)$campaign->weekly_snapchat_story >= 1  || (int)$campaign->weekly_snapchat_video >= 1 )
                                                <!-- // start Snap deliverables -->
                                                <div class="col-md-6">
                                                    <div class="card">
                                                        <div class="card-header d-flex">
                                                            <div class="flex d-flex align-items-center">
                                                                <div class="flex d-flex flex-column">
                                                                    <p class="mb-0"><strong>Snapchat</strong>&nbsp;<img src="{{asset('images/snapchat.png')}}" width="24" height="24" alt=""></p>
                                                                    <small class="text-50">Deliverables</small>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div class="card-body">
                                                            @if((int)$campaign->weekly_snapchat_story >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Snap</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_snapchat_story ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                            @if((int)$campaign->weekly_snapchat_video >= 1)
                                                                <div class="mb-4pt">
                                                                    <p class="d-flex align-items-center mb-0">
                                                                        <small class="flex lh-24pt"><strong>Video</strong></small>
                                                                        <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_snapchat_video ?? 0}}</small>
                                                                    </p>
                                                                    <div class="progress" style="height: 4px;">
                                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- // End FB deliverables  -->
                                            @endif
                                        </div>
                                    </div>
                                @endif
                            </div>
                            <!-- // End List all the deliverables -->

                            <div class="page-separator">
                                <div class="page-separator__text">Post Caption/Text </div>
                            </div>

                            <div class="card card-body">
                                <div class="d-flex">

                                    <div class="flex">
                                        <p class="d-flex align-items-center mb-2">
                                            <small class="form-text text-muted">You must us this text exactly as it is in you post.</small>
                                        </p>
                                        <p class="text-justify p-1" style="line-height: 2rem;">ADS: &nbsp; {{$campaign->post_caption_text}}.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="page-separator  mt-2">
                                <div class="page-separator__text">Handle(s) /Hash tags </div>
                            </div>

                            <div class="card card-body">
                                <div class="d-flex">

                                    <div class="flex">
                                        <p class="d-flex align-items-center mb-2">
                                            <small class="form-text text-muted">You must incorporate the text below in your post.</small>
                                        </p>
                                        <p class="text-justify p-1" style="line-height: 2rem;">{{$campaign->handles_hash}}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="page-separator">
                                <div class="page-separator__text">Do's</div>
                            </div>

                            <div class="card card-body">
                                <div class="d-flex">
                                    <div class="flex">
                                        <p class="text-justify p-1" style="line-height: 2rem;">{{$campaign->dos}}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="html2pdf__page-break"></div>

                            <div class="page-separator">
                                <div class="page-separator__text">Dont's</div>
                            </div>

                            <div class="card card-body">
                                <div class="d-flex">
                                    <div class="flex">
                                        <p class="text-justify p-1" style="line-height: 2rem;">{{$campaign->donts}}</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div class="col-lg-3 page-nav">

                        <div class="card mb-0">

                            <div class="table-responsive" >
                                <table class="table mb-0 table-nowrap thead-border-top-0">
                                    <thead>
                                    <tr>
                                        <th>
                                            <a href="javascript:void(0)"  >Username</a>
                                        </th>

                                        <th style="width: 100px;">
                                            <a href="javascript:void(0)"  >Amount</a>
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody  >
                                    @if($campaign->campaign_users)
                                        @foreach($campaign->campaign_users as $user_invite)
                                            {{--                                        {{dd($user)}}--}}
                                            <tr>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="material-icons text-20 mr-8pt">contacts</i>
                                                        <a class="js-lists-values-orders-name" href="#">@ {{ $user_invite->user->user_name }}</a>
                                                    </div>
                                                </td>

                                                <td>
                                                    <a class="js-lists-values-orders-amount" href="#">{{ \App\Models\Campaign::get_trender_payout($user_invite->campaign,$user_invite->user) }}</a>
                                                </td>
                                            </tr>
                                        @endforeach
                                    @endif
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.js"></script>

<script>
    window.onload = function() {
        document.getElementById("download_invoice").addEventListener("click", () => {
            const invoice = this.document.getElementById("invoice");

            var opt = {
                margin: 0,
                filename: 'report.pdf',
                image: {
                    type: 'jpeg',
                    quality: 0.98
                },
                html2canvas: {
                    dpi: 192,
                    letterRendering: true
                },
                jsPDF: {
                    unit: 'in',
                    format: 'letter', // Change 'letter' to 'a4' for A4 size
                    orientation: 'portrait'
                }
            };
            html2pdf().from(invoice).set(opt).save();
        })
    }
</script>

</body>

</html>
