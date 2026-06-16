<div class="row mb-lg-8pt">
    <div class="col-md-6">

        <div class="page-separator">
            <div class="page-separator__text">Trender's Information</div>
        </div>

        <div class="card card-group-row__card text-center o-hidden ">
            <div class="card-body d-flex flex-column">
                <div class="flex-grow mb-16pt">
                    <div class="avatar avatar-xl mr-6">
                        <img src="{{{get_user_image($user->id)}}}" alt="Avatar" class="avatar-img rounded-circle">
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
            <div class="card-footer">
                @if($exist_user)
                    <a href="{{route('removeCampaignUser',[$user,$campaign])}}" class="btn btn-sm btn-light" >
                        <i class="material-icons icon--left">remove_circle</i> Remove
                    </a>
                @else
                    <a href="{{route('addCampaignUser',[$user,$campaign])}}" class="btn btn-sm btn-secondary text-white">
                        <i class="material-icons icon--left">add_circle</i> Add / Invite
                    </a>
                @endif
            </div>
        </div>
    </div>

    <div class="col-md-6">

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

{{--<div class="card-group border-left-4 border-left-accent mb-32pt">--}}
{{--    <div class="card">--}}
{{--        <div class="card-body">--}}

{{--            <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
{{--                <div class="avatar avatar-xl mr-6">--}}
{{--                    <img src="{{{get_user_image($user->id)}}}" alt="Avatar" class="avatar-img rounded-circle">--}}
{{--                </div>--}}
{{--                <div class="media-body">--}}
{{--                    <div class="posts-card__title flex d-flex flex-column">--}}
{{--                        <h6 class="card-title m-0">&nbsp;IGT:  @ {{$user->user_name}}</h6>--}}
{{--                        <small class="text-50">&nbsp;<i class="material-icons text-success icon-16pt mr-1">verified_user</i>--}}
{{--                            @if(is_null($user->creator_category))--}}
{{--                                <strong>Influencer</strong>--}}
{{--                            @else--}}
{{--                                <strong>Creator</strong>--}}
{{--                            @endif&nbsp;          &nbsp;--}}
{{--                            ({{$user->badge}})--}}
{{--                        </small>--}}
{{--                        <small class="text-50">&nbsp;<i class="material-icons text-success icon-16pt mr-1">location_on</i>--}}
{{--                            <strong>{{$user->country->name}}, {{$user->state->name}}</strong>--}}
{{--                        </small>--}}
{{--                        <small class="text-50">&nbsp;<i class="material-icons text-success icon-16pt mr-1">person</i>--}}
{{--                            <strong>{{calculate_age($user)}}</strong>&nbsp; / {{\App\Models\User::get_user_level($user)}}<i class="material-icons text-accent ml-4pt icon-16pt">star</i>--}}
{{--                        </small>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--            <p class="m-0 align-items-center">{{$user->first_name}} {{$user->last_name}}</p>--}}
{{--            @if(is_null($user->creator_category))--}}
{{--                @if($user->content_category_name)--}}
{{--                    <div class="text-muted flex">--}}
{{--                        @foreach($user->content_category_name as $name)--}}
{{--                            <span class="badge badge-primary">{{$name}}</span>--}}
{{--                        @endforeach--}}
{{--                    </div>--}}
{{--                @endif--}}
{{--            @else--}}
{{--                @if($user->creator_category_name)--}}
{{--                    <div class="text-muted flex">--}}
{{--                        @foreach($user->creator_category_name as $name)--}}
{{--                            <span class="badge badge-primary">{{$name}}</span>--}}
{{--                        @endforeach--}}
{{--                    </div>--}}
{{--                @endif--}}
{{--            @endif--}}
{{--            <div class="page-separator"></div>--}}

{{--            @if($exist_user)--}}
{{--                <a href="{{route('adminRemoveCampaignUser',[$user,$campaign])}}" class="btn btn-sm btn-light" >--}}
{{--                    <i class="material-icons icon--left">remove_circle</i> Remove--}}
{{--                </a>--}}
{{--            @else--}}
{{--                <a href="{{route('adminAddCampaignUser',[$user,$campaign])}}" class="btn btn-sm btn-secondary text-white">--}}
{{--                    <i class="material-icons icon--left">add_circle</i> Add / Invite--}}
{{--                </a>--}}
{{--            @endif--}}
{{--        </div>--}}
{{--    </div>--}}
{{--    <div class="card card--raised">--}}
{{--        <div class="card-body">--}}
{{--            @if($user->instagram_profile)--}}
{{--                <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
{{--                    <div class="avatar avatar-32pt mr-8pt">--}}
{{--                        <img src="{{asset('images/instagram.png')}}" alt="INS" class="avatar-img rounded-circle">--}}
{{--                    </div>--}}
{{--                    <div class="media-body">--}}
{{--                        <div class="d-flex align-items-center">--}}
{{--                            <table class="flex d-flex flex-column">--}}
{{--                                <tr>--}}
{{--                                    <td>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
{{--                                            <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{$user->instagram_followers ?? '0'}}</span>--}}
{{--                                            <span class="mx-3 align-items-left">Post: N{{ number_format($user->instagram_post,3,'.',',') }}</span>--}}
{{--                                            <span class="d-flex align-items-center">--}}
{{--                                                <i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>{{$user->instagram_friends ?? '0'}}--}}
{{--                                            </span>--}}
{{--                                        </small>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted">--}}
{{--                                            <span class="flex text-body">Followers</span>--}}
{{--                                            <span class="mx-3 align-items-left">Story: N{{ number_format($user->instagram_story,3,'.',',') }}</span>--}}
{{--                                            <span class="d-flex align-items-center">--}}
{{--                                                <i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>--}}
{{--                                                {{number_format($user->instagram_like_percentage,1)}}%--}}
{{--                                            </span>--}}
{{--                                        </small>--}}
{{--                                    </td>--}}
{{--                                </tr>--}}
{{--                            </table>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--                <div class="page-separator"></div>--}}
{{--            @endif--}}
{{--            @if($user->facebook_profile)--}}
{{--                <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
{{--                    <div class="avatar avatar-32pt mr-8pt">--}}
{{--                        <img src="{{asset('images/facebook.png')}}" alt="FB" class="avatar-img rounded-circle">--}}
{{--                    </div>--}}
{{--                    <div class="media-body">--}}
{{--                        <div class="d-flex align-items-center">--}}
{{--                            <table class="flex d-flex flex-column">--}}
{{--                                <tr>--}}
{{--                                    <td>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
{{--                                            <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{$user->facebook_followers ?? 0}}</span>--}}
{{--                                            <span class="mx-3 align-items-left">Post: N{{ number_format($user->facebook_post,3,'.',',') }}</span>--}}
{{--                                            <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>{{$user->facebook_friends ?? 0}}</span>--}}
{{--                                        </small>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted">--}}
{{--                                            <span class="flex text-body">Followers</span>--}}
{{--                                            <span class="mx-3 align-items-left">Story: N{{ number_format($user->facebook_story,3,'.',',') }}</span>--}}
{{--                                            <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>--}}
{{--                                              {{number_format($user->facebook_like_percentage,1)}}%--}}
{{--                                            </span>--}}
{{--                                        </small>--}}
{{--                                    </td>--}}
{{--                                </tr>--}}
{{--                            </table>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--                <div class="page-separator"></div>--}}
{{--            @endif--}}
{{--            @if($user->snapchat_profile)--}}
{{--                <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
{{--                    <div class="avatar avatar-32pt mr-8pt">--}}
{{--                        <img src="{{asset('images/snapchat.png')}}" alt="SC" class="avatar-img rounded-circle">--}}
{{--                    </div>--}}
{{--                    <div class="media-body">--}}
{{--                        <div class="d-flex align-items-center">--}}
{{--                            <table class="flex d-flex flex-column">--}}
{{--                                <tr>--}}
{{--                                    <td>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
{{--                                            <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{$user->snapchat_followers ?? 0}}</span>--}}
{{--                                            <span class="mx-3 align-items-left">Post: N{{ number_format($user->snapchat_post,3,'.',',') }}</span>--}}
{{--                                            <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i> {{$user->snapchat_friends ?? 0}}</span>--}}
{{--                                        </small>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted">--}}
{{--                                            <span class="flex text-body">Followers</span>--}}
{{--                                            <span class="mx-3 align-items-left">Story: N{{ number_format($user->snapchat_story,3,'.',',') }}</span>--}}
{{--                                            <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>--}}
{{--                                                {{number_format($user->snapchat_like_percentage,1)}}%--}}
{{--                                            </span>--}}
{{--                                        </small>--}}
{{--                                    </td>--}}
{{--                                </tr>--}}
{{--                            </table>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--                <div class="page-separator"></div>--}}
{{--            @endif--}}
{{--        </div>--}}
{{--    </div>--}}
{{--    @if($user->youtube_profile || $user->tiktok_profile || $user->twitter_profile )--}}
{{--    <div class="card">--}}
{{--        <div class="card-body">--}}
{{--            @if($user->youtube_profile)--}}
{{--                <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
{{--                    <div class="avatar avatar-32pt mr-8pt">--}}
{{--                        <img src="{{asset('images/youtube.png')}}" alt="YT" class="avatar-img rounded-circle">--}}
{{--                    </div>--}}
{{--                    <div class="media-body">--}}
{{--                        <div class="d-flex align-items-center">--}}
{{--                            <table class="flex d-flex flex-column">--}}
{{--                                <tr>--}}
{{--                                    <td>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
{{--                                            <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{$user->youtube_followers ?? 0}}</span>--}}
{{--                                            <span class="mx-3">Post: N{{number_format($user->youtube_post,3,'.',',') }}</span>--}}
{{--                                        </small>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted">--}}
{{--                                            <span class="flex text-body">Followers</span>--}}
{{--                                            <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>{{$user->youtube_friends ?? 0}}</span>--}}
{{--                                            <span class="d-flex align-items-center"><i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>--}}
{{--                                             {{number_format($user->youtube_like_percentage,1)}}%--}}
{{--                                            </span>--}}
{{--                                        </small>--}}
{{--                                    </td>--}}
{{--                                </tr>--}}
{{--                            </table>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--                <div class="page-separator"></div>--}}
{{--            @endif--}}
{{--            @if($user->tiktok_profile)--}}
{{--                <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
{{--                    <div class="avatar avatar-32pt mr-8pt">--}}
{{--                        <img src="{{asset('images/tiktok.png')}}" alt="TK" class="avatar-img rounded-circle">--}}
{{--                    </div>--}}
{{--                    <div class="media-body">--}}
{{--                        <div class="d-flex align-items-center">--}}
{{--                            <table class="flex d-flex flex-column">--}}
{{--                                <tr>--}}
{{--                                    <td>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
{{--                                            <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{$user->tiktok_followers ?? 0}}</span>--}}
{{--                                            <span class="mx-3">Post: N{{number_format($user->tiktok_post,3,'.',',') }}</span>--}}
{{--                                        </small>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted">--}}
{{--                                            <span class="flex text-body">Followers</span>--}}
{{--                                            <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i>{{$user->tiktok_friends ?? 0}}</span>--}}
{{--                                            <span class="d-flex align-items-center"> <i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>--}}
{{--                                                {{number_format($user->tiktok_like_percentage,1)}}%--}}
{{--                                            </span>--}}
{{--                                        </small>--}}
{{--                                    </td>--}}
{{--                                </tr>--}}
{{--                            </table>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--                <div class="page-separator"></div>--}}
{{--            @endif--}}
{{--            @if($user->twitter_profile)--}}
{{--                <div class="media flex-nowrap align-items-center" style="white-space: nowrap;">--}}
{{--                    <div class="avatar avatar-32pt mr-8pt">--}}
{{--                        <img src="{{asset('images/twitter.png')}}" alt="TW" class="avatar-img rounded-circle">--}}
{{--                    </div>--}}
{{--                    <div class="media-body">--}}
{{--                        <div class="d-flex align-items-center">--}}
{{--                            <table class="flex d-flex flex-column">--}}
{{--                                <tr>--}}
{{--                                    <td>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted mb-1">--}}
{{--                                            <span class="flex text-body"><i class="material-icons text-success icon-16pt mr-1">person</i>{{$user->twitter_followers ?? 0}}</span>--}}
{{--                                            <span class="mx-3">Post: N{{number_format($user->twitter_post,3,'.',',') }}</span>--}}
{{--                                        </small>--}}
{{--                                        <small class="d-flex align-items-center font-weight-bold text-muted">--}}
{{--                                            <span class="flex text-body">Followers</span>--}}
{{--                                            <span class="mx-3"><i class="material-icons text-primary icon-16pt mr-1">supervised_user_circle</i> {{$user->twitter_friends ?? 0}}</span>--}}
{{--                                            <span class="d-flex align-items-center"> <i class="material-icons text-primary icon-16pt mr-1">thumb_up_alt</i>--}}
{{--                                                {{number_format($user->twitter_like_percentage,1)}}%--}}
{{--                                            </span>--}}
{{--                                        </small>--}}
{{--                                    </td>--}}
{{--                                </tr>--}}
{{--                            </table>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--                <div class="page-separator"></div>--}}
{{--            @endif--}}
{{--        </div>--}}
{{--    </div>--}}
{{--    @endif--}}
{{--</div>--}}
