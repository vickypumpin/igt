@extends('creators.layout.app')
@section('title','Rate Review')
@section('page_title','Rate Review')
@section('page_route','Account / Rate Review')
@section('content')
    <div class="container-fluid page__container">
        <form method="Post" action="{{route('creator_save_rates')}}" >
            @csrf
            <div class="row">
                <div class="col-lg-9 pr-lg-0">
                    <div class="page-section">
                        <h4>Rate Review</h4>
                        <div class="card card-group-row__card">
                            <div class="card-header d-flex align-items-center">
                                <strong class="flex">Deliverables - Social platform(s)</strong>
                                <small class="flex">Duration(stays): Daily- 1 day /Weekly- 7 days.</small>
                            </div>
                            <div class="progress rounded-0" style="height: 4px;">
                                <div class="progress-bar bg-primary" role="progressbar" style="width: 40%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>

                            <div class="card-body ">

                                @if(!is_null(auth()->user()->creator_category))
                                    <div class="row">
                                        <div class="col-12 mb-3">
                                            <label class="form-label" for="content_creator_rate">Content Creator Rate</label>
                                            <div class="input-group input-group-merge">
                                                <input type="text" class="form-control form-control-prepended"
                                                       id="content_creator_rate" name="content_creator_rate" placeholder="rate"
                                                       value="{{auth()->user()->content_creator_rate ?? 0}}"
                                                       required>
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                        <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="invalid-feedback">Please provide weekly rate.</div>
                                            <div class="valid-feedback">Looks good!</div>
                                        </div>
                                    </div>
                                @endif


                                <ul class="nav nav-tabs nav-tabs-card">
                                    <li class="nav-item">
                                        <a class="nav-link active" href="#insta" data-toggle="tab"><img src="{{asset('images/instagram.png')}}" width="24" height="24" alt="INSTA"></a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="#fb" data-toggle="tab"><img src="{{asset('images/facebook.png')}}" width="24" height="24" alt="FB"></a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="#tk" data-toggle="tab"><img src="{{asset('images/tiktok.png')}}" width="24" height="24" alt="TK"></a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="#yt" data-toggle="tab"><img src="{{asset('images/youtube.png')}}" width="24" height="24" alt="YT"></a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="#twitter" data-toggle="tab"><img src="{{asset('images/twitter.png')}}" width="24" height="24" alt="Twitter"></a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="#snap" data-toggle="tab"><img src="{{asset('images/snapchat.png')}}" width="24" height="24" alt="SNAP"></a>
                                    </li>
                                </ul>
                                <div class="card-body tab-content text-70">
                                    <div class="tab-pane active " id="insta">
                                        <h6>Instagram</h6>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="instagram_day_post_price">Post (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="instagram_day_post_price" name="instagram_day_post_price" value="{{auth()->user()->instagram_day_post_price}}" @if(is_null(auth()->user()->instagram_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="instagram_week_post_price">Post (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="instagram_week_post_price" name="instagram_week_post_price" value="{{auth()->user()->instagram_week_post_price}}" @if(is_null(auth()->user()->instagram_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src=" {{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="instagram_day_story_price">Story (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="instagram_day_story_price" name="instagram_day_story_price"  value="{{auth()->user()->instagram_day_story_price}}" @if(is_null(auth()->user()->instagram_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="instagram_week_story_price">Story (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="instagram_week_story_price" name="instagram_week_story_price"  value="{{auth()->user()->instagram_week_story_price}}" @if(is_null(auth()->user()->instagram_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="instagram_day_reel_price">Reels (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="instagram_day_reel_price" name="instagram_day_reel_price"  value="{{auth()->user()->instagram_day_reel_price}}" @if(is_null(auth()->user()->instagram_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="instagram_week_reel_price">Reels (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="instagram_week_reel_price" name="instagram_week_reel_price"  value="{{auth()->user()->instagram_week_reel_price}}" @if(is_null(auth()->user()->instagram_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="instagram_day_live_price">Live (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="instagram_day_live_price" name="instagram_day_live_price"  value="{{auth()->user()->instagram_day_live_price}}" @if(is_null(auth()->user()->instagram_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="instagram_week_live_price">Live (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="instagram_week_live_price" name="instagram_week_live_price"  value="{{auth()->user()->instagram_week_live_price}}" @if(is_null(auth()->user()->instagram_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="fb">
                                        <h6>Facebook</h6>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="fb_day_post_price">Post (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="fb_day_post_price" name="fb_day_post_price" value="{{auth()->user()->fb_day_post_price}}" @if(is_null(auth()->user()->facebook_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="fb_week_post_price">Post (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="fb_week_post_price" name="fb_week_post_price"  value="{{auth()->user()->fb_week_post_price}}" @if(is_null(auth()->user()->facebook_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="fb_day_story_price">Story (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="fb_day_story_price" name="fb_day_story_price"  value="{{auth()->user()->fb_day_story_price}}" @if(is_null(auth()->user()->facebook_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="fb_week_story_price">Story (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="fb_week_story_price" name="fb_week_story_price" value="{{auth()->user()->fb_week_story_price}}" @if(is_null(auth()->user()->facebook_profile)) disabled @endif  >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="fb_day_reel_price">Reels (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="fb_day_reel_price" name="fb_day_reel_price" value="{{auth()->user()->fb_day_reel_price}}" @if(is_null(auth()->user()->facebook_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="fb_week_reel_price">Reels (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="fb_week_reel_price" name="fb_week_reel_price" value="{{auth()->user()->fb_week_reel_price}}" @if(is_null(auth()->user()->facebook_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="fb_day_live_price">Live (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="fb_day_live_price" name="fb_day_live_price" value="{{auth()->user()->fb_day_live_price}}" @if(is_null(auth()->user()->facebook_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="fb_week_live_price">Live (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="fb_week_live_price" name="fb_week_live_price" value="{{auth()->user()->fb_week_live_price}}" @if(is_null(auth()->user()->facebook_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="tk">
                                        <h6>Tiktok</h6>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="tiktok_day_post_price">Post (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="tiktok_day_post_price" name="tiktok_day_post_price" value="{{auth()->user()->tiktok_day_post_price}}" @if(is_null(auth()->user()->tiktok_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="tiktok_week_post_price">Post (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="tiktok_week_post_price" name="tiktok_week_post_price" value="{{auth()->user()->tiktok_week_post_price}}" @if(is_null(auth()->user()->tiktok_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="tiktok_day_video_15_seconds">Video 15 Seconds (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="tiktok_day_video_15_seconds" name="tiktok_day_video_15_seconds" value="{{auth()->user()->tiktok_day_video_15_seconds}}" @if(is_null(auth()->user()->tiktok_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="tiktok_week_video_15_seconds">Video 15 Seconds (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="tiktok_week_video_15_seconds" name="tiktok_week_video_15_seconds" value="{{auth()->user()->tiktok_week_video_15_seconds}}" @if(is_null(auth()->user()->tiktok_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="tiktok_day_video_60_seconds">Video 60 Seconds (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="tiktok_day_video_60_seconds" name="tiktok_day_video_60_seconds" value="{{auth()->user()->tiktok_day_video_60_seconds}}" @if(is_null(auth()->user()->tiktok_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="tiktok_week_video_60_seconds">Video 60 Seconds (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="tiktok_week_video_60_seconds" name="tiktok_week_video_60_seconds" value="{{auth()->user()->tiktok_week_video_60_seconds}}" @if(is_null(auth()->user()->tiktok_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="tiktok_day_video_10_minutes">Video 10 minutes (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="tiktok_day_video_10_minutes" name="tiktok_day_video_10_minutes" value="{{auth()->user()->tiktok_day_video_10_minutes}}" @if(is_null(auth()->user()->tiktok_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="tiktok_week_video_10_minutes">Video 10 minutes (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="tiktok_week_video_10_minutes" name="tiktok_week_video_10_minutes" value="{{auth()->user()->tiktok_week_video_10_minutes}}" @if(is_null(auth()->user()->tiktok_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="yt">
                                        <h6>Youtube</h6>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="youtube_day_post_price">Post (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="youtube_day_post_price" name="youtube_day_post_price" value="{{auth()->user()->youtube_day_post_price}}" @if(is_null(auth()->user()->youtube_profile)) disabled @endif>
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="youtube_week_post_price">Post (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="youtube_week_post_price" name="youtube_week_post_price" value="{{auth()->user()->youtube_week_post_price}}" @if(is_null(auth()->user()->youtube_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="youtube_day_video_price">Video (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="youtube_day_video_price" name="youtube_day_video_price" value="{{auth()->user()->youtube_day_video_price}}" @if(is_null(auth()->user()->youtube_profile)) disabled @endif>
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="youtube_week_video_price">Video (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="youtube_week_video_price" name="youtube_week_video_price" value="{{auth()->user()->youtube_week_video_price}}" @if(is_null(auth()->user()->youtube_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="youtube_day_short_price">Short (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="youtube_day_short_price" name="youtube_day_short_price" value="{{auth()->user()->youtube_day_short_price}}" @if(is_null(auth()->user()->youtube_profile)) disabled @endif>
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="youtube_week_short_price">Short (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="youtube_week_short_price" name="youtube_week_short_price" value="{{auth()->user()->youtube_week_short_price}}" @if(is_null(auth()->user()->youtube_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="youtube_day_live_price">Live (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="youtube_day_live_price" name="youtube_day_live_price" value="{{auth()->user()->youtube_day_live_price}}" @if(is_null(auth()->user()->youtube_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="youtube_week_live_price">Live (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="youtube_week_live_price" name="youtube_week_live_price" value="{{auth()->user()->youtube_week_live_price}}" @if(is_null(auth()->user()->youtube_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="tab-pane" id="twitter">
                                        <h6>Twitter</h6>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="twitter_day_post_price">Tweet Post (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="twitter_day_post_price" name="twitter_day_post_price" value="{{auth()->user()->twitter_day_post_price}}" @if(is_null(auth()->user()->twitter_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="twitter_week_post_price">Tweet Post (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="twitter_week_post_price" name="twitter_week_post_price" value="{{auth()->user()->twitter_week_post_price}}" @if(is_null(auth()->user()->twitter_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="twitter_day_poll_price">Poll (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="twitter_day_poll_price" name="twitter_day_poll_price" value="{{auth()->user()->twitter_day_poll_price}}" @if(is_null(auth()->user()->twitter_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="twitter_week_poll_price">Poll (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="twitter_week_poll_price" name="twitter_week_poll_price" value="{{auth()->user()->twitter_week_poll_price}}" @if(is_null(auth()->user()->twitter_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="twitter_day_space_price">Space (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="twitter_day_space_price" name="twitter_day_space_price" value="{{auth()->user()->twitter_day_space_price}}" @if(is_null(auth()->user()->twitter_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="twitter_week_space_price">Space (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="twitter_week_space_price" name="twitter_week_space_price" value="{{auth()->user()->twitter_week_space_price}}" @if(is_null(auth()->user()->twitter_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="snap">
                                        <h6>Snapchat</h6>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="snapchat_day_story_price">Story (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="snapchat_day_story_price" name="snapchat_day_story_price"  value="{{auth()->user()->snapchat_day_story_price}}" @if(is_null(auth()->user()->snapchat_profile)) disabled @endif >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="snapchat_week_story_price">Story (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="snapchat_week_story_price" name="snapchat_week_story_price" value="{{auth()->user()->snapchat_week_story_price}}"  @if(is_null(auth()->user()->snapchat_profile)) disabled @endif  >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="snapchat_day_video_price">Video (day)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="snapchat_day_video_price" name="snapchat_day_video_price"  value="{{auth()->user()->snapchat_day_video_price}}" @if(is_null(auth()->user()->snapchat_profile)) disabled @endif  >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 mb-3">
                                                <label class="form-label" for="snapchat_week_video_price">Video (weekly)</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="number" class="form-control form-control-prepended" id="snapchat_week_video_price" name="snapchat_week_video_price" value="{{auth()->user()->snapchat_week_video_price}}" @if(is_null(auth()->user()->snapchat_profile)) disabled @endif  >
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <button type="submit"  class="btn btn-accent ">Update All</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 page-nav">
                    <div class="page-section pt-lg-112pt">
                        <nav class="nav page-nav__menu">
                            <a class="nav-link {{active_class('creator_billing')}}" href="{{route('creator_billing')}}">Payment Information</a>
                            <a class="nav-link {{active_class('creator_payment_history')}}" href="{{route('creator_payment_history')}}">Payment History</a>
                            <a class="nav-link {{active_class('creator_rate_info')}}" href="{{route('creator_rate_info')}}">Rate Review</a>
                        </nav>
                    </div>
                </div>
            </div>
        </form>
    </div>

@endsection
@push('page-scripts')

@endpush
