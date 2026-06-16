@extends('creators.layout.app')
@section('title','Campaigns Detail')
@section('page_title','Campaigns Detail')
@section('page_route',' CAMPAIGN MGT / CAMPAIGN DETAILS')
@push('css')
    <link type="text/css" href="{{asset('css/image-uploader.css')}}" rel="stylesheet">
    <style>
        .image-uploader {
            min-height: 5rem !important;
            border: unset !important;
        }
        .image-uploader.has-files .upload-text {
            display: flex !important;
            position: inherit;
        }
    </style>

@endpush
@section('content')
    <nav class="navbar navbar-expand-sm navbar-list border-bottom-2  py-sm-16pt">
        <div class="container-fluid page__container">
            <ul class="nav navbar-nav w-100">
                <li class="nav-item navbar-list__item py-16pt py-sm-0">
                    <a href="{{route('creator_my_campaigns')}}" class="nav-link" >
                        <i class="material-icons icon--left">keyboard_backspace</i>
                        Back to My Campaigns
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <div class="page-section bg-alt border-bottom-2">
        <div class="container-fluid page__container">
            <div class="row">
                <div class="col-lg-9">
                    <div class="row">
                        <div class="col-md-6 mb-24pt mb-lg-0">
                            <p class="text-70 mb-0"><strong>Campaign Name:</strong></p>
                            <h3>{{$campaign->name}}</h3>
                            <p class="text-70 mb-0"><strong>Sponsor:</strong></p>
                            <p class="text-50">{{$campaign->sponsor}}</p>
                            <p class="text-70 mb-0"><strong>Age:</strong>&nbsp; {{str_replace(';','-',$campaign->age_range)}}</p>
                            <p class="text-70 mb-0"><strong>No.#: of Trenders</strong>&nbsp; {{$campaign->no_of_trender}}</p>
                            @if($campaign->campaign_category)
                                <p class="text-70 mb-0"><strong>Content Category:</strong>&nbsp;{{$campaign->campaign_category->name}}</p>
                            @endif
                        </div>
                        <div class="col-md-6">
{{--                            <p class="text-70 mb-0"><strong>Platform:</strong></p>--}}
                            <p class="text-70 mb-0"><strong>Campaign Type:</strong></p>
                            <p>
                                @if($campaign->type == \App\Models\Campaign::INFLUENCER_TYPE)
                                    <b>Influencer Campaign</b>
                                @else
                                    <b>Creator Campaign</b>
                                @endif
{{--                                @if($campaign->duration == "day")--}}
{{--                                    @if((int)$campaign->daily_instagram_post >= 1 || $campaign->daily_instagram_story_post >= 1 )--}}
{{--                                        <img src="{{asset('images/instagram.png')}} " width="18" height="18" alt="Insta">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->daily_fb_post >= 1 || $campaign->daily_fb_story_post >= 1 )--}}
{{--                                        <img src="{{asset('images/facebook.png')}}" width="18" height="18" alt="FB">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->daily_tiktok_post >= 1 )--}}
{{--                                        <img src="{{asset('images/tiktok.png')}}" width="18" height="18" alt="Tik">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->daily_youtube_post >= 1 )--}}
{{--                                        <img src="{{asset('images/youtube.png')}}" width="18" height="18" alt="YT">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->daily_twitter_post >= 1 || $campaign->daily_twitter_fleet >= 1 )--}}
{{--                                        <img src="{{asset('images/twitter.png')}}" width="18" height="18" alt="Twitter">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->daily_snapchat_story >= 1  )--}}
{{--                                        <img src="{{asset('images/snapchat.png')}}" width="18" height="18" alt="SNAP">--}}
{{--                                    @endif--}}
{{--                                @else--}}
{{--                                    @if((int)$campaign->weekly_instagram_post >= 1 || $campaign->weekly_instagram_story_post >= 1 )--}}
{{--                                        <img src="{{asset('images/instagram.png')}} " width="18" height="18" alt="Insta">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->weekly_fb_post >= 1 || $campaign->weekly_fb_story_post >= 1 )--}}
{{--                                        <img src="{{asset('images/facebook.png')}}" width="18" height="18" alt="FB">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->weekly_tiktok_post >= 1 )--}}
{{--                                        <img src="{{asset('images/tiktok.png')}}" width="18" height="18" alt="Tik">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->weekly_youtube_post >= 1 )--}}
{{--                                        <img src="{{asset('images/youtube.png')}}" width="18" height="18" alt="YT">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->weekly_twitter_post >= 1 || $campaign->weekly_twitter_fleet >= 1 )--}}
{{--                                        <img src="{{asset('images/twitter.png')}}" width="18" height="18" alt="Twitter">--}}
{{--                                    @endif--}}
{{--                                    @if((int)$campaign->weekly_snapchat_story >= 1  )--}}
{{--                                        <img src="{{asset('images/snapchat.png')}}" width="18" height="18" alt="SNAP">--}}
{{--                                    @endif--}}
{{--                                @endif--}}
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
        <form action="#">
            <div class="row">
                <div class="col-lg-9 pr-lg-0">
                    <div class="page-section">
                        <div class="card">
                            <ul class="nav nav-tabs nav-tabs-card">
                                <li class="nav-item">
                                    <a href="#Campbrief" data-toggle="tab" role="tab" aria-selected="true" class="dashboard-area-tabs__tab card-body text-center active">
                                        <span class="font-weight-bold">Campaign</span>
                                    </a>
                                </li>
                                @if($check_status &&  $check_status->status == \App\Models\Campaign::ACTIVE)
                                    <li class="nav-item">
                                        <a href="#Submission" data-toggle="tab" role="tab" aria-selected="false" class="dashboard-area-tabs__tab card-body text-center">
                                            <span class="font-weight-bold">Submissions</span>
                                        </a>
                                    </li>
                                @endif
                            </ul>
                            <div class="card-body tab-content">
                                <div class="tab-pane active" id="Campbrief">
                                    <div class="page-separator">
                                        <div class="page-separator__text">Campaign Brief </div>
                                    </div>

                                    <div class="page-section">
                                        <div class="card card-body">
                                            <div class="d-flex">
                                                <a href="" class="avatar avatar-32pt  mr-12pt">
                                                    <img src="{{get_user_image($campaign->user_id)}}" alt="people" class="avatar-img rounded-circle">
                                                </a>
                                                <div class="flex">
                                                    <p class="d-flex align-items-center mb-2">
                                                        <a href="" class="text-body mr-2"><strong>Brand Description</strong></a>
                                                    </p>
                                                    <p class="text-justify">{{$campaign->brand_description}}</p>
                                                    <small class="form-text text-muted"> Media Files</small>
                                                    @if(!$campaign->getMedia('campaign_media_files')->isEmpty())
                                                        @foreach($campaign->getMedia('campaign_media_files') as $media)
                                                            <a href="{{asset($media->getUrl())}}" class="d-flex align-items-center border-1 rounded mb-0 p-8pt" target="_blank" download>
                                                <span class="mr-8pt p-8pt bg-secondary rounded" style="width: 40px; height: 40px;">
                                                    <i class="material-icons icon-24pt text-white">file_download</i>
                                                </span>
                                                                <span class="flex d-flex flex-column">
                                                    <span class="text-100">{{$media->file_name}}</span>
                                                </span>
                                                            </a>
                                                        @endforeach
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                        <!-- // Start List all the deliverables -->
                                        <div class="page-separator">
                                            <div class="page-separator__text">Deliverables </div>
                                        </div>

                                        <div class="row">
                                            @if($campaign->campaign_duration == "day")
                                                <div class="col-md-4">

                                                    <div class="row">
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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                            <small class="text-50 lh-24pt"><strong>Qty => {{$campaign->daily_instagram_post ?? 0}}</strong></small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Story</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_instagram_story_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Reel</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_instagram_reel ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_instagram_live ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // instagram deliverables ends   -->

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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_fb_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Story</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_fb_story_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Reel</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_fb_reel ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_fb_live ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // End FB deliverables  -->
                                                    </div>

                                                </div>
                                                <div class="col-md-4">

                                                    <div class="row">
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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_tiktok_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video 15s</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_tiktok_video_15_s ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video 60s</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_tiktok_video_60_s ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video 10m</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_tiktok_video_10_m ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // TK deliverables ends   -->

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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_youtube_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_youtube_video ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Short</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_youtube_short ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_youtube_live ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // End YT deliverables  -->
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="row">
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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Tweet</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_twitter_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>poll</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_twitter_poll ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>space</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_twitter_space ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // Twitter deliverables ends   -->

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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Snap</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_snapchat_story ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->daily_snapchat_video ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // End FB deliverables  -->
                                                    </div>
                                                </div>
                                            @else
                                                <div class="col-md-4">

                                                    <div class="row">
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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                            <small class="text-50 lh-24pt"><strong>Qty => {{$campaign->weekly_instagram_post ?? 0}}</strong></small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Story</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_instagram_story_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Reel</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_instagram_reel ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_instagram_live ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // instagram deliverables ends   -->

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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_fb_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Story</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_fb_story_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Reel</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_fb_reel ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_fb_live ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // End FB deliverables  -->
                                                    </div>

                                                </div>
                                                <div class="col-md-4">

                                                    <div class="row">
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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_tiktok_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video 15s</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_tiktok_video_15_s ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video 60s</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_tiktok_video_60_s ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video 10m</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_tiktok_video_10_m ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // TK deliverables ends   -->

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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Post</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_youtube_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_youtube_video ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Short</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_youtube_short ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Live</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_youtube_live ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 80%;" aria-valuenow="1000" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // End YT deliverables  -->
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="row">
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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Tweet</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_twitter_post ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>poll</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_twitter_poll ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>space</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_twitter_space ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 60%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // Twitter deliverables ends   -->

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
                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Snap</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_snapchat_story ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="mb-4pt">
                                                                        <p class="d-flex align-items-center mb-0">
                                                                            <small class="flex lh-24pt"><strong>Video</strong></small>
                                                                            <small class="text-50 lh-24pt">Qty => {{$campaign->weekly_snapchat_video ?? 0}}</small>
                                                                        </p>
                                                                        <div class="progress" style="height: 4px;">
                                                                            <div class="progress-bar bg-accent" role="progressbar" style="width: 40%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- // End FB deliverables  -->
                                                    </div>
                                                </div>
                                            @endif
                                        </div>
                                        <!-- // End List all the deliverables -->
                                        <div class="page-separator">
                                            <div class="page-separator__text">Campaign Description </div>
                                        </div>

                                        <div class="card card-body">
                                            <div class="d-flex">
                                                <div class="flex">
                                                    <p class="d-flex align-items-center mb-2">
                                                        <small class="form-text text-muted">Details your campaign information</small>
                                                    </p>
                                                    <p class="text-justify p-1" style="line-height: 2rem;">{{$campaign->description}}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="page-separator">
                                            <div class="page-separator__text">Campaign KPI's </div>
                                        </div>

                                        <div class="card card-body">
                                            <div class="d-flex">

                                                <div class="flex">
                                                    <p class="d-flex align-items-center mb-2">
                                                        <small class="form-text text-muted">Your KPI's </small>
                                                    </p>
                                                    <p class="text-justify p-1" style="line-height: 2rem;">{{$campaign->kpis}}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="page-separator">
                                            <div class="page-separator__text">Post Caption/Text </div>
                                        </div>

                                        <div class="card card-body">
                                            <div class="d-flex">

                                                <div class="flex">
                                                    <p class="d-flex align-items-center mb-2">
                                                        <small class="form-text text-muted">You must us this text exactly as it is in you post.</small>
                                                    </p>
                                                    <p class="text-justify p-1" style="line-height: 2rem;">{{$campaign->post_caption_text}}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="page-separator">
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

                                @if($check_status &&  $check_status->status == \App\Models\Campaign::ACTIVE)
                                    <div class="tab-pane" id="Submission">
                                        <div class="page-separator">
                                            <div class="page-separator__text">Submissions</div>
                                        </div>
                                        <div class="card mb-32pt">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-lg-4">
                                                        <h6 class="card-title mb-0">Drag & Drop Screenshots</h6>
                                                        <small class="form-text text-muted">Note: JPG, JPEG, PNG supported.</small>
                                                    </div>
                                                    <div class="col-lg-8 align-items-center">
                                                        <div class="input-images w-100" ></div>
                                                        <span class="screen_shots-feedback text-danger" role="alert">
                                                          </span>
                                                    </div>
                                                    <div class="col-12 text-center mt-3">
                                                        <button type="submit" class="btn btn-primary btn-sm upload_screenshots" data-action="{{route('upload_campaign_screenshot',$campaign)}}">Upload</button>
                                                    </div>
                                                </div>
                                                <div class="row mt-4">
                                                    <div class="col-12">
                                                        <ul class="dz-preview dz-preview-multiple list-group list-group-flush">
                                                            @foreach($campaign_screenshot as $screenshot)
                                                                <li class="list-group-item">
                                                                    <div class="form-row align-items-center">
                                                                        @foreach(explode(',',$screenshot->screenshot_image) as $image)
                                                                            <div class="col-auto">
                                                                                <div class="avatar">
                                                                                    <img src="{{asset('storage/screen_shots/'.$image)}}" class="avatar-img rounded">
                                                                                </div>
                                                                            </div>
                                                                        @endforeach
                                                                        <div class="col">
                                                                            <p class="small text-muted mb-0">{{\Carbon\Carbon::parse($screenshot->created_at)->toDateString()}}</p>
                                                                            <small class="text-50 submission_view" data-url="{{route('update_screenshot_views',$screenshot)}}" data-views="{{$screenshot->views}}" style="cursor: pointer">&nbsp;
                                                                                <i class="material-icons text-success icon-16pt mr-1">remove_red_eye</i> <strong>Views: {{$screenshot->views}}</strong>
                                                                            </small>
                                                                            <small class="text-50 submission_likes" data-url="{{route('update_screenshot_likes',$screenshot)}}"  data-likes="{{$screenshot->likes}}" style="cursor: pointer">&nbsp;
                                                                                <i class="material-icons text-success icon-16pt mr-1">thumb_up_alt</i> <strong>Likes: {{$screenshot->likes}}</strong>
                                                                            </small>
                                                                        </div>
                                                                        <div class="col">
                                                                            @if($screenshot->status == \App\Models\CampaignSubmission::REVIEW)
                                                                                <div class="badge badge-warning">
                                                                                    REVIEW
                                                                                </div>
                                                                            @endif
                                                                            @if($screenshot->status == \App\Models\CampaignSubmission::APPROVED)
                                                                                <div class="badge badge-primary">
                                                                                    APPROVED
                                                                                </div>
                                                                            @endif
                                                                            @if($screenshot->status == \App\Models\CampaignSubmission::REJECT)
                                                                                <div class="badge badge-danger">
                                                                                    REJECTED
                                                                                </div>
                                                                            @endif
                                                                        </div>
                                                                        @if($screenshot->status == \App\Models\CampaignSubmission::REVIEW)
                                                                            <div class="col-auto">
                                                                                <a href="#" class="text-muted-light campaign_submission" data-url="{{route('remove_campaign_submission',$screenshot)}}">
                                                                                    <i class="material-icons">close</i>
                                                                                </a>
                                                                            </div>
                                                                        @endif
                                                                    </div>
                                                                </li>
                                                            @endforeach
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection

@push('modal')
    <!-- Modal -->
    <div class="modal fade" id="view_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Screenshot Views</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="views_form">
                        @csrf
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="views">Views</label>
                                    <input type="number" class="form-control" name="views" id="views" placeholder="screenshot views">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="likes_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Screenshot Likes</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="likes_form">
                        @csrf
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="likes">Likes</label>
                                    <input type="number" class="form-control" name="likes" id="likes" placeholder="screenshot likes">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endpush

@push('page-scripts')
    <script src="{{asset('js/image-uploader.js')}}"></script>
    <script>
        $('.input-images').imageUploader({
            imagesInputName: 'screen_shots',
            label: 'Drop files here to upload',
            extensions:['.jpg', '.jpeg', '.png']
        });
        $(".upload_screenshots").click(function(e){
            e.preventDefault();
            const path = $(this).attr("data-action");
            const screen_shot_input_id = $(".image-uploader input").attr("id");
            var total_files = document.getElementById(screen_shot_input_id).files.length;
            let form_data  = new FormData();
            for (let index = 0; index < total_files; index++) {
                form_data.append("screen_shots[]", document.getElementById(screen_shot_input_id).files[index]);
            }
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                url: path,
                method: 'post',
                data: form_data,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: () => {
                    $(this).attr("disabled", true);
                },
                success: (data) => {
                    $(this).attr("disabled", false);
                    if (data.error && data.form) {
                        let messages = data.messages;
                        Object.keys(messages).forEach(function (key) {
                            $("#" + key).addClass("is-invalid");
                            $("." + key + "-feedback").text(messages[key]);
                        });
                    }else if(data.error){
                        Swal.fire(
                            'Alert!',
                            data.message,
                            'error'
                        )
                    }else {
                        window.location = data.redirect_url
                    }
                },
            });


        });
        $( ".campaign_submission" ).click(function(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Are you sure ?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const path = $(this).data('url');
                    $.ajax({
                        url: path,
                        type: "GET",
                        success: function (data) {
                            Swal.fire(
                                'Deleted!',
                                'Screenshot Deleted.',
                                'success'
                            )
                            window.location.reload()
                        }
                    });
                }
            })
        });
        $( ".submission_view" ).click(function(e) {
            e.preventDefault();
            const update_url = $(this).attr("data-url");
            const views = $(this).attr("data-views");
            $('#views').val(views);
            $('#views_form').attr('action', update_url);
            $('#view_modal').modal('show');
        });
        $( ".submission_likes" ).click(function(e) {
            e.preventDefault();
            const update_url = $(this).attr("data-url");
            const likes = $(this).attr("data-likes");
            $('#likes').val(likes);
            $('#likes_form').attr('action', update_url);
            $('#likes_modal').modal('show');
        });
    </script>
@endpush

