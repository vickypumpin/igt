@extends('layouts.app')
@section('title','Trender Profile')
@push('css')
    <link href="https://cdnjs.cloudflare.com/ajax/libs/ekko-lightbox/5.3.0/ekko-lightbox.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style type="text/css">

        table{
            display: flex !important;
            font-size: 16px;
            margin-left: 12px;

        }
        .page-separator {
            position: relative;
            color: #868e96;
            display: -webkit-box;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: start;
            justify-content: start;
            z-index: 0;
            margin-bottom: 1rem;
        }

        .page-separator:before {
            content: "";
            height: 1px;
            background-color: rgba(0,0,0,.1);
            width: 100%;
            top: 50%;
            left: 0;
            position: absolute;
            z-index: -1;
        }
    </style>
@endpush
@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-1 order-md-1"></div>
            <div class="col-md-10 order-md-1 mt-5">
                <div class="row mb-lg-8pt">
                    <div class="col-md-4">
                        <div class="page-separator">
                            <div class="page-separator__text">Trender's Information</div>
                        </div>

                        <div class="card card-group-row__card text-center o-hidden ">
                            <div class="card-body d-flex flex-column">
                                <div class="flex-grow mb-16pt">
                                    <div class="avatar avatar-xl">
                                        <img src="{{{get_user_image($user->id)}}}" alt="Avatar" class="avatar-img rounded-circle img-fluid">
                                    </div>
                                    <h4 class="mb-8pt">&nbsp;IGT:  {{'@'.$user->user_name}}</h4>
                                    <p class="text-70 mb-0">&nbsp;<i class="material-icons text-success icon-16pt mr-1">verified_user</i>
                                        <strong> @if(is_null($user->creator_category))
                                                <strong>Influencer</strong>
                                            @else
                                                <strong>Creator</strong>
                                            @endif&nbsp;
                                        </strong>&nbsp;@if($user->badge) ({{$user->badge}})@endif
                                    </p>
                                    <p class="text-70 mb-0">&nbsp;<i class="material-icons text-success icon-16pt mr-1">location_on</i>
                                        <strong>{{$user->country->name}}, {{$user->state->name}}</strong>
                                    </p>
                                    <p class="text-70 mb-0">&nbsp;<i class="material-icons text-success icon-16pt mr-1">person</i>
                                        <strong>{{calculate_age($user)}}</strong>&nbsp; / {{\App\Models\User::get_user_level($user)}}
                                        <i class="material-icons text-accent ml-4pt icon-16pt">star</i>
                                    </p>
                                </div>
                                <p class="d-flex justify-content-center align-items-center m-0">
                                    <span class="h4 m-0 font-weight-normal">{{$user->first_name}} {{$user->last_name}}</span>
                                </p>
                                <p class="lh-1 text-muted mb-0"></p>
                                <span>Content Category</span>
                                @if($user->content_category_name)
                                    <div class="text-muted flex">
                                        @foreach($user->content_category_name as $name)
                                            <span class="badge badge-primary">{{$name}}</span>
                                        @endforeach
                                    </div>
                                @endif
                                @if(!is_null($user->creator_category))
                                    <span>Creator Category</span>
                                    @if($user->creator_category_name)
                                        <div class="text-muted flex">
                                            @foreach($user->creator_category_name as $name)
                                                <span class="badge badge-primary">{{$name}}</span>
                                            @endforeach
                                        </div>
                                    @endif
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">

                        <div class="page-separator">
                            <div class="page-separator__text">Packages / Fees</div>
                        </div>

                        <div class="col-lg card-group-row__col">
                            <div class="card card-group-row__card">
                                <div class="card-header d-flex align-items-center">
                                    <strong class="flex">Platform / Rate</strong>
                                </div>
                                <div class="progress rounded-0" style="height: 4px;">
                                    <div class="progress-bar bg-primary" role="progressbar" style="width: 40%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                                <div class="card-body ">
                                    <ul class="nav nav-tabs nav-tabs-card">
                                        <li class="nav-item">
                                            <a class="nav-link active" href="#insta" data-toggle="tab">
                                                <img src="{{asset('images/instagram.png')}}" width="24" height="24" alt="INSTA">
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#fb" data-toggle="tab">
                                                <img src="{{asset('images/facebook.png')}}" width="24" height="24" alt="FB">
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#tk" data-toggle="tab">
                                                <img src="{{asset('images/tiktok.png')}}" width="24" height="24" alt="TK">
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#yt" data-toggle="tab">
                                                <img src="{{asset('images/youtube.png')}}" width="24" height="24" alt="YT">
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#twitter" data-toggle="tab">
                                                <img src="{{asset('images/twitter.png')}}" width="24" height="24" alt="Twitter">
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#snap" data-toggle="tab">
                                                <img src="{{asset('images/snapchat.png')}}" width="24" height="24" alt="SNAP">
                                            </a>
                                        </li>
                                        @if(!is_null($user->creator_category))
                                            <li class="nav-item">
                                                <a class="nav-link" href="#creator" data-toggle="tab"><i class="icon--right material-icons">lightbulb</i>Creator</a>
                                            </li>
                                        @endif

                                    </ul>
                                    <div class="card-body tab-content text-70">
                                        <! -- Instagram starts -->
                                        <div class="tab-pane active" id="insta">
                                            <div class="card card-group-row__card text-muted">

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Post (DAY) / Post (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->instagram_day_post_price ?? 0}}
                                                                / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->instagram_week_post_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Story (DAY) / Story (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->instagram_day_story_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->instagram_week_story_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Reels (DAY) / Reels (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->instagram_day_reel_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->instagram_week_reel_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Live (DAY) / Live (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->instagram_day_live_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->instagram_week_live_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="progress" style="height: 3px;">
                                                    <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                            <div>
                                                    <span class="flex d-flex">
                                                        <span class="text-body"><strong>Instagram</strong></span>
                                                    </span>
                                                <small class="d-flex align-items-start font-weight-bold  mb-2">
                                                    <span class="mx-3"><i class="material-icons text-success icon-16pt mr-1">person</i>Followers: {{$user->instagram_followers}}</span>
                                                    <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>Reach: {{$total_reach}}</span>
                                                    <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>Engagement: {{$total_engagement}}</span>
                                                </small>
                                            </div>
                                        </div>
                                        <! -- Instagram Ends -->

                                        <! -- FB Starts -->
                                        <div class="tab-pane" id="fb">
                                            <div class="card card-group-row__card text-muted">

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Post (DAY) / Post (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->fb_day_post_price ?? 0}}
                                                                / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->fb_week_post_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Story (DAY) / Story (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->fb_day_story_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->fb_week_story_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Reels (DAY) / Reels (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->fb_day_reel_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->fb_week_reel_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Live (DAY) / Live (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->fb_day_live_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->fb_week_live_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="progress" style="height: 3px;">
                                                    <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                            <div>
                                                    <span class="flex d-flex">
                                                        <span class="text-body"><strong>Facebook</strong></span>
                                                    </span>
                                                <small class="d-flex align-items-start font-weight-bold  mb-2">
                                                    <span class="mx-3"><i class="material-icons text-success icon-16pt mr-1">person</i>Friends: {{$user->facebook_friends}}</span>
                                                    <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>Reach: {{$total_reach}}</span>
                                                    <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>Engagement: {{$total_engagement}}</span>
                                                </small>
                                            </div>

                                        </div>
                                        <!-- FB Ends -->

                                        <!-- Tiktok Starts -->
                                        <div class="tab-pane" id="tk">
                                            <div class="card card-group-row__card text-muted">

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Post (DAY) / Post (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->tiktok_day_post_price ?? 0}}
                                                                / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->tiktok_week_post_price ?? 0}}0
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Video 15sec (DAY) / Video 15sec (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->tiktok_day_video_15_seconds ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->tiktok_week_video_15_seconds ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Video 60sec (DAY) / Video 60sec (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->tiktok_day_video_60_seconds ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->tiktok_week_video_60_seconds ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Video 10min (DAY) / Video 10min (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->tiktok_day_video_10_minutes ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->tiktok_day_video_10_minutes ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="progress" style="height: 3px;">
                                                    <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>

                                            <div>
                                                    <span class="flex d-flex">
                                                        <span class="text-body"><strong>Tiktok</strong></span>
                                                    </span>
                                                <small class="d-flex align-items-start font-weight-bold  mb-2">
                                                    <span class="mx-3"><i class="material-icons text-success icon-16pt mr-1">person</i>Followers: {{$user->tiktok_followers}}</span>
                                                    <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>Reach: {{$total_reach}}</span>
                                                    <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>Engagement: {{$total_engagement}}</span>
                                                </small>
                                            </div>
                                        </div>
                                        <!-- Tiktok Ends -->

                                        <! -- Youtube Starts  -->
                                        <div class="tab-pane" id="yt">
                                            <div class="card card-group-row__card text-muted">

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Post (DAY) / Post (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->youtube_day_post_price ?? 0}}
                                                                / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->youtube_week_post_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Video (DAY) / Video (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->youtube_day_video_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->youtube_week_video_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Short (DAY) / Short (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->youtube_day_short_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->youtube_week_short_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Live (DAY) / Live (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->youtube_day_live_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->youtube_week_live_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="progress" style="height: 3px;">
                                                    <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>

                                            <div>
                                                    <span class="flex d-flex">
                                                        <span class="text-body"><strong>Youtube</strong></span>
                                                    </span>
                                                <small class="d-flex align-items-start font-weight-bold  mb-2">
                                                    <span class="mx-3"><i class="material-icons text-success icon-16pt mr-1">person</i>Followers: {{$user->youtube_followers}}</span>
                                                    <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>Reach: {{$total_reach}}</span>
                                                    <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>Engagement: {{$total_engagement}}</span>
                                                </small>
                                            </div>
                                        </div>
                                        <!-- Youtube Ends -->

                                        <!-- Twitter Starts  -->
                                        <div class="tab-pane" id="twitter">
                                            <div class="card card-group-row__card text-muted">

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Post (DAY) / Post (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->twitter_day_post_price ?? 0}}
                                                                / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->twitter_week_post_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Poll (DAY) / Poll (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->twitter_day_poll_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->twitter_week_poll_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Space (DAY) / Space (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->twitter_day_space_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->twitter_week_space_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="progress" style="height: 3px;">
                                                    <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>

                                            <div>
                                                    <span class="flex d-flex">
                                                        <span class="text-body"><strong>Twitter</strong></span>
                                                    </span>
                                                <small class="d-flex align-items-start font-weight-bold  mb-2">
                                                    <span class="mx-3"><i class="material-icons text-success icon-16pt mr-1">person</i>Followers: {{$user->twitter_followers}}</span>
                                                    <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>Reach: {{$total_reach}}</span>
                                                    <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>Engagement: {{$total_engagement}}</span>
                                                </small>
                                            </div>
                                        </div>
                                        <!-- Twitter Ends  -->

                                        <!-- Snapchat Starts  -->
                                        <div class="tab-pane" id="snap">
                                            <div class="card card-group-row__card text-muted">

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Story (DAY) / Story (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->snapchat_day_story_price ?? 0}}
                                                                / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->snapchat_week_story_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="card-body d-flex flex-row align-items-center">

                                                    <div class="flex">
                                                        <p class="d-flex align-items-center mb-0">
                                                            <strong>Video (DAY) / Video (WEEKLY)</strong>
                                                            <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                        </p>
                                                        <span class="h6 m-0">
                                                            <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->snapchat_day_video_price ?? 0}}
                                                                 / <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->snapchat_day_video_price ?? 0}}
                                                            </span>
                                                    </div>

                                                    <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                </div>

                                                <div class="progress" style="height: 3px;">
                                                    <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>

                                            <div>
                                                    <span class="flex d-flex">
                                                        <span class="text-body"><strong>Snapchat</strong></span>
                                                    </span>
                                                <small class="d-flex align-items-start font-weight-bold  mb-2">
                                                    <span class="mx-3"><i class="material-icons text-success icon-16pt mr-1">person</i>Followers: {{$user->snapchat_followers}}</span>
                                                    <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>Reach: {{$total_reach}}</span>
                                                    <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>Engagement: {{$total_engagement}}</span>
                                                </small>
                                            </div>
                                        </div>
                                        @if(!is_null($user->creator_category))
                                            <div class="tab-pane" id="creator">
                                                <div class="card card-group-row__card">
                                                    <div class="card-body d-flex flex-row align-items-center">
                                                        <div class="flex">
                                                            <p class="d-flex align-items-center mb-0">
                                                                <strong>Creator Fee </strong>
                                                                <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                            </p>
                                                            <span class="h2 m-0">
                                                  <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> {{$user->content_creator_rate ?? 0}}
                                            </span>
                                                        </div>
                                                        <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                                                    </div>
                                                    <div class="progress" style="height: 3px;">
                                                        <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <span class="flex d-flex">
                                                        <span class="text-body"><strong>{{ implode(',',$user->creator_category_name->toArray())  }}</strong></span>
                                                    </span>
                                                    <small class="d-flex align-items-start font-weight-bold  mb-2">
                                                        <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>Reach: {{$total_reach}}</span>
                                                        <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>Engagement: {{$total_engagement}}</span>
                                                    </small>
                                                    <small class="d-flex align-items-start font-weight-bold  mb-2">
                                                        <span class="flex d-flex flex-column">
                                                            <span class="text-body">Insights </span>
                                                        </span>
                                                        @if(\App\Models\User::get_user_level($user) != '')
                                                            <span class="mx-3">Level: <i class="material-icons text-success icon-16pt mr-1">filter_{{\App\Models\User::get_user_level($user)}}</i></span>
                                                        @endif
                                                        <span class="d-flex align-items-center">Ratings: {{$rating}} <i class="material-icons text-primary icon-16pt mr-1">star</i></span>
                                                    </small>
                                                </div>
                                            </div>
                                        @endif

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                {{--                <div class="card-group border-left-4 border-left-accent mb-32pt">--}}
                {{--                    <div class="card">--}}
                {{--                        <div class="card-body">--}}

                {{--                            <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
                {{--                                <div class="avatar avatar-xl mr-6">--}}
                {{--                                    <img src="{{get_user_image($user->id)}}" alt="Avatar" class="avatar-img rounded-circle" style="width:92px !important">--}}
                {{--                                </div>--}}
                {{--                                <div class="media-body">--}}
                {{--                                    <div class="posts-card__title flex d-flex flex-column">--}}
                {{--                                        <h6 class="card-title m-0">&nbsp;IGT:  @ {{$user->user_name}}</h6>--}}
                {{--                                        <small class="text-50">&nbsp;--}}
                {{--                                            <i class="material-icons text-success icon-16pt mr-1">verified_user</i>--}}
                {{--                                            @if(is_null($user->creator_category))--}}
                {{--                                                <strong>Influencer</strong>&nbsp;({{$user->badge}})</small>--}}
                {{--                                        @else--}}
                {{--                                            <strong>Creator</strong>&nbsp;({{$user->badge}})</small>--}}
                {{--                                        @endif--}}

                {{--                                        <small class="text-50">&nbsp;--}}
                {{--                                            <i class="material-icons text-success icon-16pt mr-1">location_on</i>--}}
                {{--                                            <strong>{{$user->country->name}} , {{$user->state->name}}</strong>--}}
                {{--                                        </small>--}}
                {{--                                        <small class="text-50">&nbsp;<i class="material-icons text-success icon-16pt mr-1">person</i>--}}
                {{--                                            <strong>{{calculate_age($user)}}</strong>&nbsp; / {{\App\Models\User::get_user_level($user)}} <i class="material-icons text-accent ml-4pt icon-16pt">star</i></small>--}}
                {{--                                    </div>--}}
                {{--                                </div>--}}
                {{--                            </div>--}}
                {{--                            <p class="m-0 align-items-center">{{$user->first_name}} {{$user->last_name}}</p>--}}
                {{--                            @php--}}
                {{--                                $categories =   $user->content_category_name;--}}
                {{--                            @endphp--}}
                {{--                            <div class="text-muted flex">--}}
                {{--                                @foreach($categories as $val)--}}
                {{--                                    <span class="badge badge-primary">{{$val}}</span>--}}
                {{--                                @endforeach--}}
                {{--                            </div>--}}
                {{--                            <div class="page-separator"></div>--}}

                {{--                            --}}{{--                            @if($user->role == \App\Models\User::BRAND)--}}
                {{--                            <a href="#" class="btn btn-sm btn-secondary" id="hire_trender">--}}
                {{--                                Hire Trender--}}
                {{--                            </a>--}}
                {{--                            --}}{{--                            @else--}}
                {{--                            --}}{{--                                <button type="button" class="btn btn-sm btn-secondary"--}}
                {{--                            --}}{{--                                        data-toggle="swal" data-swal-title="Good job!"--}}
                {{--                            --}}{{--                                        data-swal-text="You must login as brand to hire Trender"--}}
                {{--                            --}}{{--                                        data-swal-type="error">--}}
                {{--                            --}}{{--                                    Hire Trender--}}
                {{--                            --}}{{--                                </button>--}}
                {{--                            --}}{{--                            @endif--}}
                {{--                        </div>--}}
                {{--                    </div>--}}
                {{--                    <div class="card card--raised">--}}

                {{--                        <div class="card-body">--}}
                {{--                            @if($user->instagram_profile)--}}
                {{--                                <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
                {{--                                    <div class="avatar avatar-32pt mr-8pt">--}}
                {{--                                        <img src="{{asset('images/instagram.png')}}" alt="INS" class="avatar-img rounded-circle">--}}
                {{--                                    </div>--}}
                {{--                                    <div class="media-body">--}}
                {{--                                        <div class="d-flex align-items-center">--}}
                {{--                                            <table class="flex d-flex flex-column">--}}
                {{--                                                <tr>--}}
                {{--                                                    <td>--}}
                {{--                                                        <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
                {{--                                                            <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{ $user->instagram_followers}}</span>--}}
                {{--                                                            <span class="mx-3 align-items-left">Post D / W: N {{number_format($user->instagram_day_post_price,2)}} / N {{number_format($user->instagram_week_post_price,2)}}</span>--}}
                {{--                                                        </small>--}}
                {{--                                                        <small class="d-flex align-items-center font-weight-bold text-muted">--}}
                {{--                                                            <span class="flex text-body">Followers</span>--}}
                {{--                                                            <span class="mx-3 align-items-left">Story D / W: N {{number_format($user->instagram_day_story_price,2)}} / N {{number_format($user->instagram_week_story_price,2)}}</span>--}}

                {{--                                                        </small>--}}
                {{--                                                    </td>--}}
                {{--                                                </tr>--}}
                {{--                                            </table>--}}
                {{--                                        </div>--}}
                {{--                                    </div>--}}
                {{--                                </div>--}}
                {{--                                <div class="page-separator"></div>--}}
                {{--                            @endif--}}
                {{--                            <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
                {{--                                <div class="avatar avatar-32pt mr-8pt">--}}
                {{--                                    <img src="{{asset('images/facebook.png')}}" alt="FB" class="avatar-img rounded-circle">--}}
                {{--                                </div>--}}
                {{--                                <div class="media-body">--}}
                {{--                                    <div class="d-flex align-items-center">--}}
                {{--                                        <table class="flex d-flex flex-column">--}}
                {{--                                            <tr>--}}
                {{--                                                <td>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
                {{--                                                        <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{ $user->facebook_followers }}</span>--}}
                {{--                                                        <span class="mx-3 align-items-left">Post D / W: N {{number_format($user->fb_day_post_price,2)}} / N {{number_format($user->fb_week_post_price,2)}}</span>--}}
                {{--                                                    </small>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted">--}}
                {{--                                                        <span class="flex text-body">Followers</span>--}}
                {{--                                                        <span class="mx-3 align-items-left">Story D / W: N {{number_format($user->fb_day_story_price,2)}} / N {{number_format($user->fb_week_story_price,2)}}</span>--}}

                {{--                                                    </small>--}}
                {{--                                                </td>--}}
                {{--                                            </tr>--}}
                {{--                                        </table>--}}
                {{--                                    </div>--}}
                {{--                                </div>--}}
                {{--                            </div>--}}
                {{--                            <div class="page-separator"></div>--}}
                {{--                            <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
                {{--                                <div class="avatar avatar-32pt mr-8pt">--}}
                {{--                                    <img src="{{asset('images/snapchat.png')}}" alt="SC" class="avatar-img rounded-circle">--}}
                {{--                                </div>--}}
                {{--                                <div class="media-body">--}}
                {{--                                    <div class="d-flex align-items-center">--}}
                {{--                                        <table class="flex d-flex flex-column">--}}
                {{--                                            <tr>--}}
                {{--                                                <td>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
                {{--                                                        <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{ $user->snapchat_followers }}</span>--}}
                {{--                                                        <span class="mx-3 align-items-left">Story D / W: N {{number_format($user->snapchat_day_story_price,2)}} / N {{number_format($user->snapchat_week_story_price,2)}}</span>--}}
                {{--                                                    </small>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted">--}}
                {{--                                                        <span class="flex text-body">Followers</span>--}}
                {{--                                                    </small>--}}
                {{--                                                </td>--}}
                {{--                                            </tr>--}}
                {{--                                        </table>--}}
                {{--                                    </div>--}}
                {{--                                </div>--}}
                {{--                            </div>--}}
                {{--                            <div class="page-separator"></div>--}}
                {{--                        </div>--}}
                {{--                    </div>--}}

                {{--                    <div class="card">--}}
                {{--                        <div class="card-body">--}}
                {{--                            <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
                {{--                                <div class="avatar avatar-32pt mr-8pt">--}}
                {{--                                    <img src="{{asset('images/youtube.png')}}" alt="YT" class="avatar-img rounded-circle">--}}
                {{--                                </div>--}}
                {{--                                <div class="media-body">--}}
                {{--                                    <div class="d-flex align-items-center">--}}
                {{--                                        <table class="flex d-flex flex-column">--}}
                {{--                                            <tr>--}}
                {{--                                                <td>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
                {{--                                                        <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{ $user->youtube_followers }}</span>--}}
                {{--                                                        <span class="mx-3">Post D / W: N {{number_format($user->youtube_day_post_price,2)}} / N {{number_format($user->youtube_week_post_price,2)}}</span>--}}
                {{--                                                    </small>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted">--}}
                {{--                                                        <span class="flex text-body">Followers</span>--}}
                {{--                                                    </small>--}}
                {{--                                                </td>--}}
                {{--                                            </tr>--}}
                {{--                                        </table>--}}
                {{--                                    </div>--}}
                {{--                                </div>--}}
                {{--                            </div>--}}

                {{--                            <div class="page-separator"></div>--}}

                {{--                            <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
                {{--                                <div class="avatar avatar-32pt mr-8pt">--}}
                {{--                                    <img src="{{asset('images/tiktok.png')}}" alt="TK" class="avatar-img rounded-circle">--}}
                {{--                                </div>--}}
                {{--                                <div class="media-body">--}}
                {{--                                    <div class="d-flex align-items-center">--}}
                {{--                                        <table class="flex d-flex flex-column">--}}
                {{--                                            <tr>--}}
                {{--                                                <td>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
                {{--                                                        <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i> {{ $user->tiktok_followers }} </span>--}}
                {{--                                                        <span class="mx-3">Post D / W: {{number_format($user->tiktok_day_post_price,2)}} / N {{number_format($user->tiktok_week_post_price,2)}}</span>--}}
                {{--                                                    </small>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted">--}}
                {{--                                                        <span class="flex text-body">Followers</span>--}}
                {{--                                                    </small>--}}
                {{--                                                </td>--}}
                {{--                                            </tr>--}}
                {{--                                        </table>--}}
                {{--                                    </div>--}}
                {{--                                </div>--}}
                {{--                            </div>--}}

                {{--                            <div class="page-separator"></div>--}}

                {{--                            <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
                {{--                                <div class="avatar avatar-32pt mr-8pt">--}}
                {{--                                    <img src="{{asset('images/twitter.png')}}" alt="TW" class="avatar-img rounded-circle">--}}
                {{--                                </div>--}}
                {{--                                <div class="media-body">--}}
                {{--                                    <div class="d-flex align-items-center">--}}
                {{--                                        <table class="flex d-flex flex-column">--}}
                {{--                                            <tr>--}}
                {{--                                                <td>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
                {{--                                                        <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>450k</span>--}}
                {{--                                                        <span class="mx-3">Post D / W: N{{number_format($user->twitter_day_post_price,2)}} / N {{number_format($user->twitter_week_post_price,2)}}</span>--}}
                {{--                                                    </small>--}}
                {{--                                                    <small class="d-flex align-items-center font-weight-bold text-muted">--}}
                {{--                                                        <span class="flex text-body">Followers</span>--}}
                {{--                                                    </small>--}}
                {{--                                                </td>--}}
                {{--                                            </tr>--}}
                {{--                                        </table>--}}
                {{--                                    </div>--}}
                {{--                                </div>--}}
                {{--                            </div>--}}


                {{--                        </div>--}}

                {{--                    </div>--}}
                {{--                </div>--}}
            </div>
        </div>
    </div>
    <div class="container">
        <div class="py-5 text-center">
            <img class="d-block mx-auto mb-4" src="{{asset('images/diamond.png')}}" alt="" width="72" height="72">
            <h2>Support your Influencer with GEM(S)!</h2>
            <p class="lead">Here is where you show your Trenders love and support their infleunce, by buying them Trender's GEM which is automatically converted and delivered into their account! </p>
        </div>

        <div class="row">
            <div class="col-md-4 order-md-2 mb-4">

                <h4 class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted">Your Transaction</span>
                </h4>
                <ul class="list-group mb-3">
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 class="my-0">Trenders' Gem</h6>
                            <small class="text-muted">1 Gem = {{ number_format($settings->gem_price,2) }} Naira</small>
                        </div>

                    </li>
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 class="my-0">You are buying</h6>
                            <small class="text-muted"><span id="total_gems">0</span> Gems</small>
                        </div>
                        <span class="text-muted">N <span id="total_gems_price">0</span></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 class="my-0">Service Fee</h6>
                            <small class="text-muted">+ Tax ({{ $settings->gem_service_fee }} %)</small>
                        </div>
                        <span class="text-muted">N <span id="total_percentage_price">0</span></span>
                    </li>

                    <li class="list-group-item d-flex justify-content-between">
                        <span>Total (Naira)</span>
                        <strong>N <span id="final_price">0</span></strong>
                    </li>
                </ul>

            </div>
            <div class="col-md-8 order-md-1">
                <h4 class="mb-3">Supporter's Information</h4>
                <form method="post" action="{{route('send_user_gem')}}" >
                    @csrf
                    <input type="hidden" name="trender_id" value="{{$user->id}}">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="firstName">First name</label>
                            <input type="text" class="form-control   @error('first_name') is-invalid  @enderror" id="firstName" name="first_name" placeholder="first name" value="{{old('first_name')}}" required>
                            @error('first_name')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                            @enderror
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="lastName">Last name</label>
                            <input type="text" class="form-control @error('first_name') is-invalid  @enderror" id="lastName" name="last_name" placeholder="last name" value="" required>
                            @error('last_name')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                            @enderror
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="email">Email <span class="text-muted"></span></label>
                        <input type="email" class="form-control @error('email') is-invalid  @enderror" id="email" name="email" placeholder="you@example.com">
                        @error('email')
                        <div class="invalid-feedback">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                    <hr class="mb-4">

                    <div class="mb-3">
                        <label for="Gems">GEMS</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">GEMS</span>
                            </div>
                            <input type="number" class="form-control @error('gem') is-invalid  @enderror" id="gem" name="gem" placeholder="gems" required>
                            @error('gem')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                            @enderror
                        </div>
                    </div>
                    <h4 class="mb-3">Payment</h4>

                    {{--                    <hr class="mb-4">--}}
                    {{--                    <div class="d-block my-3">--}}
                    {{--                        <div class="custom-control custom-radio">--}}
                    {{--                            <input id="credit" name="paymentMethod" type="radio" class="custom-control-input" checked required>--}}
                    {{--                            <label class="custom-control-label" for="credit">Credit card</label>--}}
                    {{--                        </div>--}}
                    {{--                        <div class="custom-control custom-radio">--}}
                    {{--                            <input id="debit" name="paymentMethod" type="radio" class="custom-control-input" required>--}}
                    {{--                            <label class="custom-control-label" for="debit">Debit card</label>--}}
                    {{--                        </div>--}}
                    {{--                        <div class="custom-control custom-radio">--}}
                    {{--                            <input id="paypal" name="paymentMethod" type="radio" class="custom-control-input" required>--}}
                    {{--                            <label class="custom-control-label" for="paypal">Paypal</label>--}}
                    {{--                        </div>--}}
                    {{--                    </div>--}}
                    <hr class="mb-4">
                    <button class="btn btn-secondary btn-lg btn-block" type="submit">Buy Now!</button>
                </form>
            </div>
        </div>

    </div>
    <br>
    <br>

    <!-- Modal -->
    <div class="modal fade" id="campaigns_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Select Campaign</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form method="post" action="{{route('hire_trender',$user)}}">
                    @csrf
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="campaign">Campaigns</label>
                            <select class="form-control" id="campaign" name="campaign" required>
                                <option value="" selected>Select Campaign</option>
                                @foreach($campaigns as $campaign)
                                    <option value="{{$campaign->id}}">{{$campaign->name}}</option>
                                @endforeach
                            </select>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Hire</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
@push('js')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ekko-lightbox/5.3.0/ekko-lightbox.js"></script>

    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js"></script>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" id="theme-styles">

    @include('admin.includes.messages')

    <script>
        $(document).on("click", '[data-toggle="lightbox"]', function(event) {
            event.preventDefault();
            $(this).ekkoLightbox();
        });
    </script>

    <script>
        $('#gem').on('change', function(e) {
            let gems = $(this).val()
            $('#total_gems').text(gems);
            const per_gem_price = '{{$settings->gem_price}}';
            const gem_service_percentage = '{{$settings->gem_service_fee}}';
            const total_pay_amount = per_gem_price * gems;
            const percentage_amount = gem_service_percentage / 100 * total_pay_amount;
            const total_pay_with_percentage = total_pay_amount + percentage_amount;
            $('#total_percentage_price').text(percentage_amount);
            $('#total_gems_price').text(total_pay_amount);
            $('#final_price').text(total_pay_with_percentage);
        });

        $('#hire_trender').on('click', function(e) {
            e.preventDefault();
            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
            });

            @auth
            @if(\Illuminate\Support\Facades\Auth::user()->role == \App\Models\User::BRAND)
            $('#campaigns_modal').modal('show');

            @else

            Toast.fire({
                icon: 'error',
                title: 'You Must Login as brand to  hire Trender'
            })

            @endif
                @endauth

                @guest
                window.location = "{{route('register')}}"
            @endguest

        });
    </script>
@endpush
