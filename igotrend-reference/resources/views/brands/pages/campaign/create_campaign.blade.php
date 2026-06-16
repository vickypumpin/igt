@extends('brands.layout.app')
@section('title','Create Campaign')
@section('page_title','Create Campaigns')
@section('page_route','Campaign Mgt / Create Campaign')
@push('css')
    <link type="text/css" href="{{asset('css/image-uploader.css')}}" rel="stylesheet">
    <style>
        #upload {
            opacity: 0;
        }
        #upload-label {
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
        }
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

    <div class="container-fluid page__container">
        <div class="py-32pt navbar-submenu">
            <div class="container-fluid page__container">
                <div class="progression-bar progression-bar--active-accent">
                    <a href="{{route('create_campaign')}}" class="progression-bar__item progression-bar__item--complete progression-bar__item--active">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon">edit</i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Campaign Info</span>
                            </span>
                    </a>
                    <a href="#" class="progression-bar__item">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon"></i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Campaign Brief</span>
                            </span>
                    </a>
                    <a href="#" class="progression-bar__item">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon"></i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Add Trenders</span>
                            </span>
                    </a>
                    <a href="#" class="progression-bar__item">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon"></i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Payment &amp; Review </span>
                            </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid page__container page-section">

        <div class="page-separator">
            <div class="page-separator__text">Create an Influencer Campaign</div>
        </div>

        <div class="card card-body mb-32pt">
            <div class="row">

                <div class="card-body align-items-center">
                    <form class="flex" method="post" action="{{route('create_campaign_save')}}" enctype="multipart/form-data">
                        @csrf
                        <div class="form-group">
                            <label class="form-label h6" for="sponsor">
                                Campaign Sponsor:
                            </label>
                            <input type="text" name="campaign_sponsor" class="form-control @error('campaign_sponsor') is-invalid @enderror" value="{{old('campaign_sponsor')}}" id="sponsor" placeholder="What brand are you promoting? e.g Peak Milk">
                            @error('campaign_sponsor')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label class="form-label h6" for="campaign_name">
                                Campaign Name:
                            </label>
                            <input type="text" name="campaign_name" class="form-control @error('campaign_name') is-invalid @enderror" value="{{old('campaign_name')}}" id="campaign_name" placeholder="e.g My milk Camp">
                            @error('campaign_name')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <div class="card card-body mb-32pt">
                                <div class="row">
                                    <div class="col-lg-4">
                                        <h6 class="card-title mb-0">Campaign Cover Image</h6>
                                        <small class="form-text text-muted">Note: JPG, JPEG, PNG supported.</small>
                                    </div>
                                    <div class="col-lg-8 align-items-center">
                                        <!-- Upload image input-->
                                        <div class="input-group mb-3 px-2 py-2 rounded-pill  shadow mt-2">
                                            <input id="upload" type="file" name="campaign_cover_image" class="form-control border-0" accept="image/*">
                                            <label id="upload-label" for="upload" class="font-weight-light text-muted">Choose file</label>
                                            <div class="input-group-append">
                                                <label for="upload" class="btn btn-light m-0 rounded-pill px-4">
                                                    <i class="material-icons mr-2">file_upload</i>
                                                    <small class="text-uppercase font-weight-bold text-muted">Choose file</small>
                                                </label>
                                            </div>
                                        </div>
                                        @error('campaign_cover_image')
                                        <div class="text-danger ml-3">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label h6" for="campaign_description">
                                Campaign Description:
                            </label>
                            <textarea id="campaign_description" name="campaign_description" placeholder="Enter description here ..." rows="3" class="form-control    @error('campaign_description') is-invalid  @enderror" >{{old('campaign_description')}}</textarea>
                            @error('campaign_description')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label class="form-label h6" for="campaign_kpi">
                                Campaign KPI's:
                            </label>
                            <textarea id="campaign_kpi" name="campaign_kpi" placeholder="e.g 1000 website visits ..." rows="3" class="form-control @error('campaign_kpi') is-invalid  @enderror">{{old('campaign_kpi')}}</textarea>
                            @error('campaign_kpi')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group">
                            <div class="card card-body mb-32pt">
                                <div class="row">
                                    <div class="col-lg-4">
                                        <h6 class="card-title mb-0">Drag &amp; Drop Campaign Media/files</h6>
                                        <small class="form-text text-muted">Note: JPG, JPEG, PNG supported.</small>
                                    </div>
                                    <div class="col-lg-8 align-items-center">
                                        <div class="input-images w-100" ></div>
                                        @error('media_files')
                                        <div class="text-danger text-center">{{ $message }}</div>
                                        @enderror
                                        <div class="row">
                                            <div class="col-12 col-md-8 offset-md-2">
                                                @if ($errors->has('media_files.*'))
                                                    @foreach($errors->get('media_files.*') as $key => $error)
                                                        @php
                                                            if ($key == "media_files.0"){
                                                                    $replace_index = "first media file";
                                                            }elseif ($key == "media_files.1"){
                                                                  $replace_index = "second media file";
                                                            }elseif ($key == "media_files.2"){
                                                                      $replace_index = "third media file";
                                                            }elseif ($key == "media_files.3"){
                                                                 $replace_index = "four media file";
                                                            }elseif ($key == "media_files.4"){
                                                                  $replace_index = "five media file";
                                                            }
                                                        @endphp
                                                        <div class="text-danger ">{{ str_replace($key,$replace_index,$error[0]) }}</div>
                                                    @endforeach
                                                @endif
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label d-block mb-4 h6" for="age_range">
                                Age Range:
                            </label>
                            <input id="age_range" name="age_range" type="text" data-toggle="ion-rangeslider" data-values="0,12,18,21,30,40,50,60,100" data-from="2" data-to="6" data-type="double" data-grid="true" data-prefix="Age: " data-postfix="years">
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-12 col-md-6 mb-3">
                                    <label class="form-label d-block mb-4 h6" for="campaign_type">
                                        Campaign Type :
                                    </label>
                                    <div>
                                        <select id="campaign_type" name="campaign_type" class="form-control custom-select">
                                            <option value="1"  @if(old('campaign_type') != "2") selected @endif>Influencer Campaign</option>
                                            <option value="2" @if(old('campaign_type') == "2") selected @endif>Content Creator Campaign</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mb-3">
                                    <label class="form-label d-block mb-4 h6" for="campaign_category">
                                        Campaign Category:
                                    </label>
                                    <div>
                                        <select id="campaign_category" class="form-control custom-select @error('campaign_category') is-invalid  @enderror" name="campaign_category">
                                            <option selected value="">Choose option</option>
                                            @foreach($content_categories as $category)
                                                <option value="{{$category->id}}">{{$category->name}}</option>
                                            @endforeach
                                        </select>
                                        @error('campaign_category')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mb-3  @if(old('campaign_type') == "2") @else d-none @endif" id="creator_category_div">
                                    <label class="form-label d-block mb-4 h6" for="content_category">
                                        Content Category:
                                    </label>
                                    <div>
                                        <select id="content_category" class="form-control custom-select" name="creator_category">
                                            <option selected value="">Choose option</option>
                                            @foreach($creator_categories as $category)
                                                <option value="{{$category->id}}" @if(old('creator_category') == $category->id) selected @endif>{{$category->name}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mb-3">
                                    <label class="form-label d-block mb-4 h6" for="start_date">
                                        Start Date:
                                    </label>
                                    <div>
                                        <input id="start_date" name="start_date" type="hidden" class="form-control flatpickr-input" data-toggle="flatpickr" value="{{old('start_date') ? old('start_date') : 'today' }}">
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mb-3">
                                    <label class="form-label d-block mb-4 h6" for="end_date">
                                        End Date:
                                    </label>
                                    <div>
                                        <input id="end_date" name="end_date" type="hidden" class="form-control flatpickr-input" data-toggle="flatpickr" value="{{old('start_date') ? old('end_date') : 'today' }}">
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mb-3">
                                    <div class="form-group">
                                        <label class="form-label d-block mb-4" for="no_of_trender">
                                            <h6>No of Trenders:</h6>
                                        </label>
                                        <input id="no_of_trender" name="no_of_trender" type="number" class="form-control" placeholder="no of trenders" value="{{old('no_of_trender')}}" required>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mb-3">
                                    <div class="form-group">
                                        <label class="form-label d-block mb-4" for="campaign_duration">
                                            <h6>Campaign Duration:</h6>
                                        </label>
                                        <select class="form-control @error('campaign_duration') is-invalid @enderror" name="campaign_duration" id="campaign_duration" required>
                                            <option value="" @if(old('campaign_duration') == "") selected @endif>Select campaign duration</option>
                                            <option value="day" @if(old('campaign_duration') == "day") selected @endif>Day campaign</option>
                                            <option value="weekly" @if(old('campaign_duration') == "weekly") selected @endif>Weekly campaign</option>
                                        </select>
                                        @error('campaign_duration')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body tab-content text-70">
                            <div  id="daycamp" class="d-none">
                                <div class="card card-group-row__card">
                                    <div class="form-group row align-items-center col-sm-6">
                                        <label class="form-label col-form-label col-sm-6" for="days_no">
                                            <h6 style="float:right">No of day(s)</h6>
                                        </label>
                                        <div class="col-sm-6">
                                            <input id="days_no" data-toggle="touch-spin" data-min="0" data-max="6" data-step="1" type="text" value="{{old('no_of_day') ? old('no_of_day')  : '1' }}" name="no_of_day" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="card-header d-flex align-items-center">
                                        <strong class="flex">Deliverables - Add platform(s)</strong>
                                        <small class="flex">Duration(stays): Post- 1 day / Stories- maybe less.</small>
                                    </div>
                                    <div class="progress rounded-0" style="height: 4px;">
                                        <div class="progress-bar bg-primary" role="progressbar" style="width: 40%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>

                                    <div class="card-body ">
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
                                            <div class="tab-pane active" id="insta">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="instagram_app">
                                                        <h6 style="float:right">Instagram Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="instagram_app"  data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_instagram_post') ? old('daily_instagram_post')  : '1' }}" name="daily_instagram_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for=instagram_story_post>
                                                        <h6 style="float:right">Instagram Story</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="instagram_story_post" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('daily_instagram_story_post') ? old('daily_instagram_story_post')  : '1' }}" name="daily_instagram_story_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for=daily_instagram_reel>
                                                        <h6 style="float:right">Instagram Reel</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_instagram_reel" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('daily_instagram_reel') ? old('daily_instagram_reel')  : '1' }}" name="daily_instagram_reel" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for=daily_instagram_live>
                                                        <h6 style="float:right">Instagram Live</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_instagram_live" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('daily_instagram_live') ? old('daily_instagram_live')  : '1' }}" name="daily_instagram_live" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="fb">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6 h6" for="fb_post">
                                                        <h6 style="float:right">FB Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="fb_post" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_fb_post') ? old('daily_fb_post')  : '0' }}" name="daily_fb_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="fb_story">
                                                        <h6 style="float:right">FB Story</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="fb_story" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('daily_fb_story_post') ? old('daily_fb_story_post')  : '0' }}" name="daily_fb_story_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_fb_reel">
                                                        <h6 style="float:right">FB Reel</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_fb_reel" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('daily_fb_reel') ? old('daily_fb_reel')  : '0' }}" name="daily_fb_reel" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_fb_live">
                                                        <h6 style="float:right">FB Live</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_fb_live" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('daily_fb_live') ? old('daily_fb_live')  : '0' }}" name="daily_fb_live" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="tk">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="tiktok_post">
                                                        <h6 style="float:right">TikTok Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="tiktok_post" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_tiktok_post') ? old('daily_tiktok_post')  : '0' }}" name="daily_tiktok_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_tiktok_video_15_seconds">
                                                        <h6 style="float:right">TikTok Video 15 Seconds</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_tiktok_video_15_seconds" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_tiktok_video_15_seconds') ? old('daily_tiktok_video_15_seconds')  : '0' }}" name="daily_tiktok_video_15_seconds" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_tiktok_video_60_seconds">
                                                        <h6 style="float:right">TikTok Video 60 Seconds</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_tiktok_video_60_seconds" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_tiktok_video_60_seconds') ? old('daily_tiktok_video_60_seconds')  : '0' }}" name="daily_tiktok_video_60_seconds" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_tiktok_video_10_minutes">
                                                        <h6 style="float:right">TikTok Video 10 Minutes</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_tiktok_video_10_minutes" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_tiktok_video_10_minutes') ? old('daily_tiktok_video_10_minutes')  : '0' }}" name="daily_tiktok_video_10_minutes" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="yt">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="youtube_post">
                                                        <h6 style="float:right">Youtube Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="youtube_post" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_youtube_post') ? old('daily_youtube_post')  : '0' }}" name="daily_youtube_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_youtube_video">
                                                        <h6 style="float:right">Youtube Video</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_youtube_video" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_youtube_video') ? old('daily_youtube_video')  : '0' }}" name="daily_youtube_video" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_youtube_short">
                                                        <h6 style="float:right">Youtube Short</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_youtube_short" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_youtube_short') ? old('daily_youtube_short')  : '0' }}" name="daily_youtube_short" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_youtube_live">
                                                        <h6 style="float:right">Youtube Live</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_youtube_live" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_youtube_live') ? old('daily_youtube_live')  : '0' }}" name="daily_youtube_live" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="twitter">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="twitter_post">
                                                        <h6 style="float:right">Twitter Tweet Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="twitter_post" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('daily_twitter_post') ? old('daily_twitter_post')  : '0' }}" name="daily_twitter_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_twitter_poll">
                                                        <h6 style="float:right">Twitter Poll</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_twitter_poll" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('daily_twitter_poll') ? old('daily_twitter_poll')  : '0' }}" name="daily_twitter_poll" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_twitter_space">
                                                        <h6 style="float:right">Twitter Space</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_twitter_space" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('daily_twitter_space') ? old('daily_twitter_space')  : '0' }}" name="daily_twitter_space" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="snap">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="snapchat_story">
                                                        <h6 style="float:right">SnapChat Story</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="snapchat_story" data-toggle="touch-spin" data-min="0" data-max="3" data-step="1" type="text" value="{{old('daily_snapchat_story') ? old('daily_snapchat_story')  : '0' }}" name="daily_snapchat_story" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="daily_snapchat_video">
                                                        <h6 style="float:right">SnapChat Video</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="daily_snapchat_video" data-toggle="touch-spin" data-min="0" data-max="3" data-step="1" type="text" value="{{old('daily_snapchat_video') ? old('daily_snapchat_video')  : '0' }}" name="daily_snapchat_video" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="weekcamp" class="d-none">
                                <div class="card card-group-row__card">
                                    <div class="form-group row align-items-center col-sm-6">
                                        <label class="form-label col-form-label col-sm-6" for="week_no">
                                            <h6 style="float:right">No of week(s)</h6>
                                        </label>
                                        <div class="col-sm-6">
                                            <input id="week_no" data-toggle="touch-spin" data-min="0" data-max="100" data-step="1" type="text" value="{{old('no_of_week') ? old('no_of_week')  : '0' }}" name="no_of_week" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="card-header d-flex align-items-center">
                                        <strong class="flex">Deliverables - Add platform(s)</strong>
                                        <small class="flex">Duration(stays): Post- 7 days(Weekly) / Stories- maybe less.</small>
                                    </div>
                                    <div class="progress rounded-0" style="height: 4px;">
                                        <div class="progress-bar bg-primary" role="progressbar" style="width: 40%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>

                                    <div class="card-body ">
                                        <ul class="nav nav-tabs nav-tabs-card">
                                            <li class="nav-item">
                                                <a class="nav-link active" href="#instaw" data-toggle="tab"><img src="{{asset('images/instagram.png')}}" width="24" height="24" alt="INSTA"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#fbw" data-toggle="tab"><img src=" {{asset('images/facebook.png')}}" width="24" height="24" alt="FB"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#tkw" data-toggle="tab"><img src="{{asset('images/tiktok.png')}}" width="24" height="24" alt="TK"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#ytw" data-toggle="tab"><img src=" {{asset('images/youtube.png')}}" width="24" height="24" alt="YT"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#twitterw" data-toggle="tab"><img src=" {{asset('images/twitter.png')}}" width="24" height="24" alt="Twitter"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#snapw" data-toggle="tab"><img src=" {{asset('images/snapchat.png')}}" width="24" height="24" alt="SNAP"></a>
                                            </li>
                                        </ul>
                                        <div class="card-body tab-content text-70">
                                            <div class="tab-pane active" id="instaw">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_instagram_post">
                                                        <h6 style="float:right">Instagram Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_instagram_post" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_instagram_post') ? old('weekly_instagram_post')  : '0' }}" name="weekly_instagram_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for=weekly_instagram_story_post>
                                                        <h6 style="float:right">Instagram Story</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_instagram_story_post" data-toggle="touch-spin" data-min="0" data-max="3" data-step="1" type="text" value="{{old('weekly_instagram_story_post') ? old('weekly_instagram_story_post')  : '0' }}" name="weekly_instagram_story_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for=weekly_instagram_reel>
                                                        <h6 style="float:right">Instagram Reel</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_instagram_reel" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_instagram_reel') ? old('weekly_instagram_reel')  : '1' }}" name="weekly_instagram_reel" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for=weekly_instagram_live>
                                                        <h6 style="float:right">Instagram Live</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_instagram_live" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_instagram_live') ? old('weekly_instagram_live')  : '1' }}" name="weekly_instagram_live" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="fbw">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_fb_post">
                                                        <h6 style="float:right">FB Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_fb_post" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_fb_post') ? old('weekly_fb_post')  : '0' }}" name="weekly_fb_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_fb_story">
                                                        <h6 style="float:right">FB Story</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_fb_story" data-toggle="touch-spin" data-min="0" data-max="3" data-step="1" type="text" value="{{old('weekly_fb_story_post') ? old('weekly_fb_story_post')  : '0' }}" name="weekly_fb_story_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_fb_reel">
                                                        <h6 style="float:right">FB Reel</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_fb_reel" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_fb_reel') ? old('weekly_fb_reel')  : '0' }}" name="weekly_fb_reel" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_fb_live">
                                                        <h6 style="float:right">FB Live</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_fb_live" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_fb_live') ? old('weekly_fb_live')  : '0' }}" name="weekly_fb_live" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="tkw">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_tiktok_post">
                                                        <h6 style="float:right">TikTok Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_tiktok_post" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_tiktok_post') ? old('weekly_tiktok_post')  : '0' }}" name="weekly_tiktok_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_tiktok_video_15_seconds">
                                                        <h6 style="float:right">TikTok Video 15 Seconds</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_tiktok_video_15_seconds" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('weekly_tiktok_video_15_seconds') ? old('weekly_tiktok_video_15_seconds')  : '0' }}" name="weekly_tiktok_video_15_seconds" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_tiktok_video_60_seconds">
                                                        <h6 style="float:right">TikTok Video 60 Seconds</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_tiktok_video_60_seconds" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('weekly_tiktok_video_60_seconds') ? old('weekly_tiktok_video_60_seconds')  : '0' }}" name="weekly_tiktok_video_60_seconds" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_tiktok_video_10_minutes">
                                                        <h6 style="float:right">TikTok Video 10 Minutes</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_tiktok_video_10_minutes" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('weekly_tiktok_video_10_minutes') ? old('weekly_tiktok_video_10_minutes')  : '0' }}" name="weekly_tiktok_video_10_minutes" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="ytw">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_youtube_post">
                                                        <h6 style="float:right">Youtube Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_youtube_post" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('weekly_youtube_post') ? old('weekly_youtube_post')  : '0' }}" name="weekly_youtube_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_youtube_video">
                                                        <h6 style="float:right">Youtube Video</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_youtube_video" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('weekly_youtube_video') ? old('weekly_youtube_video')  : '0' }}" name="weekly_youtube_video" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_youtube_short">
                                                        <h6 style="float:right">Youtube Short</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_youtube_short" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('weekly_youtube_short') ? old('weekly_youtube_short')  : '0' }}" name="weekly_youtube_short" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_youtube_live">
                                                        <h6 style="float:right">Youtube Live</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_youtube_live" data-toggle="touch-spin" data-min="0" data-max="1" data-step="1" type="text" value="{{old('weekly_youtube_live') ? old('weekly_youtube_live')  : '0' }}" name="weekly_youtube_live" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="twitterw">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_twitter_post">
                                                        <h6 style="float:right">Twitter Post</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_twitter_post" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_twitter_post') ? old('weekly_twitter_post')  : '0' }}" name="weekly_twitter_post" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_twitter_poll">
                                                        <h6 style="float:right">Twitter Poll</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_twitter_poll" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_twitter_poll') ? old('weekly_twitter_poll')  : '0' }}" name="weekly_twitter_poll" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_twitter_space">
                                                        <h6 style="float:right">Twitter Space</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_twitter_space" data-toggle="touch-spin" data-min="0" data-max="2" data-step="1" type="text" value="{{old('weekly_twitter_space') ? old('weekly_twitter_space')  : '0' }}" name="weekly_twitter_space" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="snapw">
                                                <div class="form-group row align-items-center mb-0">
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_snapchat_story">
                                                        <h6 style="float:right">SnapChat Story</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_snapchat_story" data-toggle="touch-spin" data-min="0" data-max="3" data-step="1" type="text" value="{{old('weekly_snapchat_story') ? old('weekly_snapchat_story')  : '0' }}" name="weekly_snapchat_story" class="form-control" />
                                                    </div>
                                                    <label class="form-label col-form-label col-sm-6" for="weekly_snapchat_video">
                                                        <h6 style="float:right">SnapChat Video</h6>
                                                    </label>
                                                    <div class="col-sm-3">
                                                        <input id="weekly_snapchat_video" data-toggle="touch-spin" data-min="0" data-max="3" data-step="1" type="text" value="{{old('weekly_snapchat_video') ? old('weekly_snapchat_video')  : '0' }}" name="weekly_snapchat_video" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <button type="submit" class="btn btn-accent">
                            <i class="material-icons icon--left">forward</i> BRIEF
                        </button>
                    </form>
                </div>
            </div>
        </div>

    </div>
@endsection
@push('page-scripts')
    <script src="{{asset('js/rangeslider.js')}}"></script>
    <script src="{{asset('js/flatpickr.js')}}"></script>
    <script src="{{asset('js/touchspin.js')}}"></script>
    <script src="{{asset('js/image-uploader.js')}}"></script>
    <script>
        var input = document.getElementById( 'upload' );
        var infoArea = document.getElementById( 'upload-label' );

        input.addEventListener( 'change', showFileName );
        function showFileName( event ) {
            var input = event.srcElement;
            var fileName = input.files[0].name;
            infoArea.textContent = fileName;
        }
        $('.input-images').imageUploader({
            imagesInputName: 'media_files',
            label: 'Drop files here to upload',
        });
        $('#campaign_type').on('change', function() {
            const type = this.value;
            if(type === "2"){
                $('#creator_category_div').removeClass('d-none')
            }else {
                $('#creator_category_div').addClass('d-none')
            }
        });
        $('#campaign_duration').on('change', function() {
            const type = this.value;
            if(type === "day"){
                $('#daycamp').removeClass('d-none')
                $('#weekcamp').addClass('d-none')
            }
            if(type === "weekly"){
                $('#weekcamp').removeClass('d-none')
                $('#daycamp').addClass('d-none')
            }
            if(type === ""){
                $('#weekcamp').addClass('d-none')
                $('#daycamp').addClass('d-none')
            }
        });
    </script>
@endpush
