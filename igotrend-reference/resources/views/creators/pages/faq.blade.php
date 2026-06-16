@extends('creators.layout.app')
@section('title','FAQ')
@section('page_title','FAQ')
@section('page_route','FAQ')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="container-fluid page__container">
                <div class="row card-group-row mb-lg-8pt">
{{--                    <div class="col-lg card-group-row__col">--}}
{{--                        <div class="card card-group-row__card">--}}
{{--                            <div class="card-header d-flex align-items-center">--}}
{{--                                <strong class="flex">Rate Checklist - Choose a platform</strong>--}}
{{--                            </div>--}}
{{--                            <div class="progress rounded-0" style="height: 4px;">--}}
{{--                                <div class="progress-bar bg-primary" role="progressbar" style="width: 40%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>--}}
{{--                            </div>--}}
{{--                            <div class="card-body ">--}}
{{--                                <form method="Post" action="{{route('creator_save_rates')}}" >--}}
{{--                                    @csrf--}}
{{--                                    <ul class="nav nav-tabs nav-tabs-card">--}}
{{--                                        <li class="nav-item">--}}
{{--                                            <a class="nav-link active" href="#insta" data-toggle="tab"><img src="{{asset('images/instagram.png')}}" width="24" height="24" alt="INSTA"></a>--}}
{{--                                        </li>--}}
{{--                                        <li class="nav-item">--}}
{{--                                            <a class="nav-link" href="#fb" data-toggle="tab"><img src="{{asset('images/facebook.png')}}" width="24" height="24" alt="FB"></a>--}}
{{--                                        </li>--}}
{{--                                        <li class="nav-item">--}}
{{--                                            <a class="nav-link" href="#tk" data-toggle="tab"><img src="{{asset('images/tiktok.png')}}" width="24" height="24" alt="TK"></a>--}}
{{--                                        </li>--}}
{{--                                        <li class="nav-item">--}}
{{--                                            <a class="nav-link" href="#yt" data-toggle="tab"><img src="{{asset('images/youtube.png')}}" width="24" height="24" alt="YT"></a>--}}
{{--                                        </li>--}}
{{--                                        <li class="nav-item">--}}
{{--                                            <a class="nav-link" href="#twitter" data-toggle="tab"><img src="{{asset('images/twitter.png')}}" width="24" height="24" alt="Twitter"></a>--}}
{{--                                        </li>--}}
{{--                                        <li class="nav-item">--}}
{{--                                            <a class="nav-link" href="#snap" data-toggle="tab"><img src="{{asset('images/snapchat.png')}}" width="24" height="24" alt="SNAP"></a>--}}
{{--                                        </li>--}}
{{--                                    </ul>--}}
{{--                                    <div class="card-body tab-content text-70">--}}
{{--                                        <div class="tab-pane active " id="insta">--}}
{{--                                            <h6>Instagram</h6>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="instagram_day_post_price">Post (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="instagram_day_post_price" name="instagram_day_post_price" value="{{auth()->user()->instagram_day_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="instagram_week_post_price">Post (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="instagram_week_post_price" name="instagram_week_post_price" value="{{auth()->user()->instagram_week_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src=" {{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}

{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="instagram_day_story_price">Story (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="instagram_day_story_price" name="instagram_day_story_price"  value="{{auth()->user()->instagram_day_story_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="instagram_week_story_price">Story (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="instagram_week_story_price" name="instagram_week_story_price"  value="{{auth()->user()->instagram_week_story_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="instagram_day_reel_price">Reels (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="instagram_day_reel_price" name="instagram_day_reel_price"  value="{{auth()->user()->instagram_day_reel_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="instagram_week_reel_price">Reels (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="instagram_week_reel_price" name="instagram_week_reel_price"  value="{{auth()->user()->instagram_week_reel_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                        </div>--}}
{{--                                        <div class="tab-pane" id="fb">--}}
{{--                                            <h6>Facebook</h6>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="fb_day_post_price">Post (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="fb_day_post_price" name="fb_day_post_price" value="{{auth()->user()->fb_day_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="fb_week_post_price">Post (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="fb_week_post_price" name="fb_week_post_price"  value="{{auth()->user()->fb_week_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="fb_day_story_price">Story (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="fb_day_story_price" name="fb_day_story_price"  value="{{auth()->user()->fb_day_story_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="fb_week_story_price">Story (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="fb_week_story_price" name="fb_week_story_price" value="{{auth()->user()->fb_week_story_price}}"  >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="fb_day_reel_price">Reels (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="fb_day_reel_price" name="fb_day_reel_price" value="{{auth()->user()->fb_day_reel_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="fb_week_reel_price">Reels (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="fb_week_reel_price" name="fb_week_reel_price" value="{{auth()->user()->fb_week_reel_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                        </div>--}}
{{--                                        <div class="tab-pane" id="tk">--}}
{{--                                            <h6>Tiktok</h6>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="tiktok_day_post_price">Post (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="tiktok_day_post_price" name="tiktok_day_post_price" value="{{auth()->user()->tiktok_day_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="tiktok_week_post_price">Post (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="tiktok_week_post_price" name="tiktok_week_post_price" value="{{auth()->user()->tiktok_week_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                        </div>--}}
{{--                                        <div class="tab-pane" id="yt">--}}
{{--                                            <h6>Youtube</h6>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="youtube_day_post_price">Post (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="youtube_day_post_price" name="youtube_day_post_price" value="{{auth()->user()->youtube_day_post_price}}">--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="youtube_week_post_price">Post (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="youtube_week_post_price" name="youtube_week_post_price" value="{{auth()->user()->youtube_week_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                        </div>--}}
{{--                                        <div class="tab-pane" id="twitter">--}}
{{--                                            <h6>Twitter</h6>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="twitter_day_post_price">Post (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="twitter_day_post_price" name="twitter_day_post_price" value="{{auth()->user()->twitter_day_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="twitter_week_post_price">Post (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="twitter_week_post_price" name="twitter_week_post_price" value="{{auth()->user()->twitter_week_post_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}

{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="twitter_day_fleet_price">Fleet (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="twitter_day_fleet_price" name="twitter_day_fleet_price" value="{{auth()->user()->twitter_day_fleet_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="twitter_week_fleet_price">Fleet (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="twitter_week_fleet_price" name="twitter_week_fleet_price" value="{{auth()->user()->twitter_week_fleet_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                        </div>--}}
{{--                                        <div class="tab-pane" id="snap">--}}
{{--                                            <h6>Snapchat</h6>--}}
{{--                                            <div class="form-row">--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="snapchat_day_story_price">Story (day)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="snapchat_day_story_price" name="snapchat_day_story_price"  value="{{auth()->user()->snapchat_day_story_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                                <div class="col-12 col-md-6 mb-3">--}}
{{--                                                    <label class="form-label" for="snapchat_week_story_price">Story (weekly)</label>--}}
{{--                                                    <div class="input-group input-group-merge">--}}
{{--                                                        <input type="number" class="form-control form-control-prepended" id="snapchat_week_story_price" name="snapchat_week_story_price" value="{{auth()->user()->snapchat_week_story_price}}" >--}}
{{--                                                        <div class="input-group-prepend">--}}
{{--                                                            <div class="input-group-text">--}}
{{--                                                                <img src="{{asset('images/nairalogo.png')}}" width="18" height="18" alt="N">--}}
{{--                                                            </div>--}}
{{--                                                        </div>--}}
{{--                                                    </div>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                        </div>--}}
{{--                                        <div class="d-flex justify-content-end">--}}
{{--                                            <button type="submit"  class="btn btn-accent ">Update All</button>--}}
{{--                                        </div>--}}
{{--                                    </div>--}}
{{--                                </form>--}}
{{--                            </div>--}}

{{--                        </div>--}}
{{--                    </div>--}}
                    <div class="col-lg card-group-row__col">
                        <div class="card card-group-row__card">
                            <div class="card-header d-flex align-items-center">
                                <strong class="flex">Badges</strong>
                                <strong class="flex">Influencers</strong>
                                <strong class="flex">&nbsp;&nbsp;Creators</strong>
                                <div> <strong>Levels</strong></div>
                            </div>
                            <div class="card-body d-flex flex-column align-items-left justify-content-left">
                                <ul class="list-unstyled list-skills w-55">
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Nano</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>5k - 10k</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>1k - 10k</strong></div>
                                        </div>
                                        <div class="text-70"><strong>1</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Micro</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>10k - 50k</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>10k - 25k</strong></div>
                                        </div>
                                        <div class="text-70"><strong>2</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Mid-tier</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>50k - 500k</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>25k - 100k</strong></div>
                                        </div>
                                        <div class="text-70"><strong>3</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Macro</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>500k - 1M</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>100k - 1M</strong></div>
                                        </div>
                                        <div class="text-70"><strong>4</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Mega</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>1M - 5M</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>1M+ </strong></div>
                                        </div>
                                        <div class="text-70"><strong>5</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Elite</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>Celebrity</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>Celebrity</strong></div>
                                        </div>
                                        <div class="text-70"><strong>6</strong></div>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="page-separator"></div>

                <div class="row card-group-row">
                    @foreach($faqs as $faq)
                        <div class="col-md-6 card-group-row__col">

                            <div class="card card--elevated card-group-row__card">
                                <div class="card-body d-flex">
                                    <span class="icon-holder icon-holder--outline-muted rounded-circle d-inline-flex mr-16pt">
                                        <i class="material-icons">question_answer</i>
                                    </span>
                                    <div class="flex">
                                        <a class="card-title mb-4pt" href="">{{$faq->question}}</a>
                                        <p class="text-70 mb-0 text-justify">{{$faq->answer}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

            </div>
        </div>
    </div>
@endsection
