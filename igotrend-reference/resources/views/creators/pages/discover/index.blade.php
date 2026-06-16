@extends('creators.layout.app')
@section('title','Discover Campaigns')
@section('page_title','Discover Campaigns')
@section('page_route','CAMPAIGN MGT / Discover Campaigns')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <form method="get">
                <div class="card card-form d-flex flex-column flex-sm-row mb-lg-32pt">
                    <div class="card-form__body card-body-form-group flex">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label for="filter_name">Campaign Name</label>
                                    <input id="filter_name" name="campaign_name" type="text" class="form-control" value="{{$campaign_name}}" placeholder="Search by name">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label for="filter_category">Category</label><br>
                                    <select id="filter_category" name="campaign_category" class="custom-select w-100" style="width: 200px;">
                                        <option value="" selected>All Categories</option>
                                        @foreach($content_categories as $category)
                                            <option value="{{$category->id}}" @if($campaign_category == $category->id) selected @endif>{{$category->name}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group" style="width: 200px;">
                                    <label for="filter_date">Date Range</label>
                                    <input id="filter_date" name="date_range" type="text" class="form-control  flatpickr" value="{{$date_range}}" placeholder="Select date range">
                                </div>
                            </div>
                            <div class="col-md-3 text-md-center mt-md-4">
                                <a href="{{route('discover')}}" class="btn btn-primary">Reset</a>
                            </div>
                        </div>
                    </div>
                    <button class="btn bg-alt border-left border-top border-top-sm-0 rounded-0">
                        <i class="material-icons text-primary icon-20pt">search</i>
                    </button>
                </div>
            </form>
            <div class="page-separator">
                <div class="page-separator__text">Campaign Marketplace</div>
            </div>
            <div class="row card-group-row">
                @if($campaigns->count() == 0)
                    <div class="col-12 text-center text-info">
                        No Campaigns Exist
                    </div>
                @else
                    @foreach($campaigns as $campaign)
                        <div class="col-lg-4 card-group-row__col">
                            <div class="card card-group-row__card p-16pt">
                                <a href="{{route('discover_details',$campaign)}}" class="d-block mb-16pt">
                                    @if(!$campaign->getMedia('campaign_cover_image')->isEmpty())
                                        <img src="{{asset($campaign->getMedia('campaign_cover_image')->first()->getUrl())}}"  style="height: 104px;"
                                             class="card-img card-img-cover">
                                    @endif
                                </a>
                                <div class="d-flex">
                                    <div class="d-flex flex-column flex">
                                        <a href="{{route('discover_details',$campaign)}}" class="mb-8pt">
                                            <strong>{{$campaign->name}}</strong>
                                        </a>
                                        <div class="d-flex align-items-center mb-8pt">
                                            <a href="{{route('discover_details',$campaign)}}" class="mr-4pt">
                                                <span class="indicator-line rounded bg-primary"></span>
                                            </a>
                                        </div>
                                        <div class="row" role="tablist">
                                            <div class="col-auto d-flex flex-column">
                                                <h6 class="m-0">
                                                    @if(is_null($campaign->creator_category))
                                                        <small>Influencer </small>
                                                    @else
                                                        <small>Creator </small>
                                                    @endif
                                                </h6>
                                                <p class="text-50 mb-0 d-flex align-items-center">
                                                    <small>Type</small>
                                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                </p>
                                            </div>
                                            <div class="col-auto border-left">
                                                <h6 class="m-0">
                                                    <small>{{str_replace(';','-',$campaign->age_range)}}</small>
                                                </h6>
                                                <p class="text-50 mb-0 d-flex align-items-center">
                                                    <small>Age</small>
                                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                </p>
                                            </div>
                                            <div class="col-auto border-left">
                                                <h6 class="m-0">
                                                    <small>{{$campaign->end_date}} </small>
                                                </h6>
                                                <p class="text-50 mb-0 d-flex align-items-center">
                                                    <small>End Date</small>
                                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                                </p>
                                            </div>
                                        </div>
                                        <br>
                                        <p class="align-items-center">
                                            <small>Platform:</small> &nbsp;
                                            @if($campaign->campaign_duration == "day")
                                                @if((int)$campaign->daily_instagram_post >= 1 || (int)$campaign->daily_instagram_story_post >= 1 || (int)$campaign->daily_instagram_reel  >= 1||  (int)$campaign->daily_instagram_live  >= 1  )
                                                    <img src="{{asset('images/instagram.png')}} " width="18" height="18" alt="Insta">
                                                @endif
                                                @if((int)$campaign->daily_fb_post >= 1 || (int)$campaign->daily_fb_story_post >= 1 || (int)$campaign->daily_fb_reel >= 1 || (int)$campaign->daily_fb_live >= 1 )
                                                    <img src="{{asset('images/facebook.png')}}" width="16" height="16" alt="FB">
                                                @endif
                                                @if((int)$campaign->daily_tiktok_post >= 1 || (int)$campaign->daily_tiktok_video_15_s >= 1 || (int)$campaign->daily_tiktok_video_60_s >= 1 || (int)$campaign->daily_tiktok_video_10_m >= 1 )
                                                    <img src="{{asset('images/tiktok.png')}}" width="16" height="16" alt="Tik">
                                                @endif
                                                @if((int)$campaign->daily_youtube_post >= 1  || (int)$campaign->daily_youtube_video >= 1 || (int)$campaign->daily_youtube_short >= 1 || (int)$campaign->daily_youtube_live >= 1)
                                                    <img src="{{asset('images/youtube.png')}}" width="16" height="16" alt="YT">
                                                @endif
                                                @if((int)$campaign->daily_twitter_post >= 1 || (int)$campaign->daily_twitter_poll >= 1 || (int)$campaign->daily_twitter_space >= 1 )
                                                    <img src="{{asset('images/twitter.png')}}" width="16" height="16" alt="Twitter">
                                                @endif
                                                @if((int)$campaign->daily_snapchat_story >= 1  || (int)$campaign->daily_snapchat_video >= 1 )
                                                    <img src="{{asset('images/snapchat.png')}}" width="16" height="16" alt="SNAP">
                                                @endif
                                            @else
                                                @if((int)$campaign->weekly_instagram_post >= 1 || (int)$campaign->weekly_instagram_story_post >= 1 || (int)$campaign->weekly_instagram_reel  >= 1||  (int)$campaign->weekly_instagram_live  >= 1  )
                                                    <img src="{{asset('images/instagram.png')}} " width="18" height="18" alt="Insta">
                                                @endif
                                                @if((int)$campaign->weekly_fb_post >= 1 || (int)$campaign->weekly_fb_story_post >= 1 || (int)$campaign->weekly_fb_reel >= 1 || (int)$campaign->weekly_fb_live >= 1 )
                                                    <img src="{{asset('images/facebook.png')}}" width="16" height="16" alt="FB">
                                                @endif
                                                @if((int)$campaign->weekly_tiktok_post >= 1 || (int)$campaign->weekly_tiktok_video_15_s >= 1 || (int)$campaign->weekly_tiktok_video_60_s >= 1 || (int)$campaign->weekly_tiktok_video_10_m >= 1 )
                                                    <img src="{{asset('images/tiktok.png')}}" width="16" height="16" alt="Tik">
                                                @endif
                                                @if((int)$campaign->weekly_youtube_post >= 1  || (int)$campaign->weekly_youtube_video >= 1 || (int)$campaign->weekly_youtube_short >= 1 || (int)$campaign->weekly_youtube_live >= 1)
                                                    <img src="{{asset('images/youtube.png')}}" width="16" height="16" alt="YT">
                                                @endif
                                                @if((int)$campaign->weekly_twitter_post >= 1 || (int)$campaign->weekly_twitter_poll >= 1 || (int)$campaign->weekly_twitter_space >= 1 )
                                                    <img src="{{asset('images/twitter.png')}}" width="16" height="16" alt="Twitter">
                                                @endif
                                                @if((int)$campaign->weekly_snapchat_story >= 1  || (int)$campaign->weekly_snapchat_video >= 1 )
                                                    <img src="{{asset('images/snapchat.png')}}" width="16" height="16" alt="SNAP">
                                                @endif
                                            @endif
                                        </p>
                                    </div>
                                    <a href="{{route('discover_details',$campaign)}}">
                                        <i class="material-icons text-50">more_horiz</i>
                                    </a>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="flex d-flex align-items-center">
                                        @php
                                            $check_trender = \App\Models\CampaignInvite::where('campaign_id',$campaign->id)
                                            ->where('user_id',auth()->user()->id)
                                            ->first();
                                        @endphp
                                        @if($check_trender)
                                            <button type="button" class="btn btn-secondary btn-sm" disabled>
                                                <i class="material-icons icon--left">thumb_up  </i>
                                                Applied
                                            </button>
                                        @else
                                            <a href="{{route('sendCampaignRequest',[auth()->user(),$campaign])}}" class="btn btn-secondary btn-sm">
                                                <i class="material-icons icon--left">thumb_up  </i>
                                                Apply
                                            </a>
                                        @endif
                                    </div>
                                    <div class="d-flex align-items-center">
                                        @php
                                            $trenders = \App\Models\CampaignInvite::where('campaign_id',$campaign->id);
                                            $trenders_count = $trenders->count();
                                            $trenders_more = $trenders_count - 3;
                                            $trenders_users_id = $trenders->pluck('user_id');
                                             $users = '';
                                            foreach ($trenders_users_id as $key => $user_id){
                                                $user = \App\Models\User::find($user_id);
                                                if ($user){
                                                    $users .= '<div class="avatar avatar-xs" data-toggle="tooltip" data-placement="top" title="'.ucfirst($user->first_name). ' '.ucfirst($user->last_name).'">
                                                                    <img src="'.get_user_image($user->id).'" alt="Avatar" class="avatar-img rounded-circle">
                                                                </div>';
                                                }
                                                if ($key > 2){
                                                    break;
                                                }
                                            }
                                        @endphp
                                        <div class="avatar-group flex mr-8pt">
                                            {!! $users  !!}
                                        </div>
                                        <div class="media-body">
                                            <span><small>+{{$trenders_more}} more</small></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
            <div class="row">
                {{$campaigns->links()}}
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script>

        flatpickr(".flatpickr", {
            mode: "range",
            dateFormat: "Y-m-d",
        });
    </script>
@endpush
