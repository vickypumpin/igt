@extends('brands.layout.app')
@section('title','Create Campaign')
@section('page_title','Create Campaigns')
@section('page_route','Campaign Mgt / Add Trenders')
@section('content')
    <div class="container-fluid page__container">
        <div class="py-32pt navbar-submenu">
            <div class="container-fluid page__container">
                <div class="progression-bar progression-bar--active-accent">
                    <a href="{{route('edit_campaign',$campaign)}}" class="progression-bar__item progression-bar__item--complete">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon">done</i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Campaign Info</span>
                            </span>
                    </a>
                    <a href="{{route('campaign_brief',$campaign)}}" class="progression-bar__item progression-bar__item--complete">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon">done</i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Campaign Brief</span>
                            </span>
                    </a>
                    <a href="{{route('add_trenders',$campaign)}}" class="progression-bar__item progression-bar__item--complete progression-bar__item--active">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon">edit</i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Add Trenders</span>
                            </span>
                    </a>
                    <a href="{{route('review_payment',$campaign)}}" class="progression-bar__item">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon"></i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Payment & Review </span>
                            </span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid page__container page-section">
        <div class="row mb-lg-8pt">
            <div class="col-md-6 col-lg-6">
                <div class="card card-group-row__card">
                    <div class="card-body d-flex flex-row align-items-center">
                        <div class="flex">
                            <p class="d-flex align-items-center mb-0">
                                <strong>Trenders Selected</strong>
                            </p>
                            <span class="h4 m-0">
                                    {{number_format($total_trenders_selected,2)}}
                                    </span>
                        </div>
                    </div>
                    <div class="progress" style="height: 3px;">
                        <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-6">
                <div class="card card-group-row__card">
                    <div class="card-body d-flex flex-row align-items-center">
                        <div class="flex">
                            <p class="d-flex align-items-center mb-0">
                                <strong>Estimated Budget</strong>
                            </p>
                            <span class="h4 m-0">
                                {{number_format($estimated_budget,2)}}
                            </span>
                        </div>
                    </div>
                    <div class="progress" style="height: 3px;">
                        <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-separator">
            <div class="page-separator__text">Add Trenders to Campaign</div>
        </div>
        <div class="row">
            <div class="col-12">
                <form method="post" action="{{route('add_trenders_save',$campaign)}}" id="campaign_mode_form">
                    @csrf
                    <div class="form-group">
                        <h6>Campaign Mode:</h6>
                        <div class="form-group form-check-inline">
                            <input class="form-check-input"  type="radio" name="campaign_mode" id="public_campaign" value="public" checked="">
                            <label class="form-check-label" for="public_campaign">Make Campaign Public &nbsp; </label>
                            <small class="text-50">(You don't need to manually add trenders)</small>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="campaign_mode" id="private_campaign" value="private">
                            <label class="form-check-label" for="private_campaign">Make Campaign Private &nbsp;</label>
                            <small class="text-50">(You must manually add trenders)</small>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h6>Filter / Criteria:</h6>
                <form method="get" action="{{route('add_trenders',$campaign)}}" >
                    <div class="card card-form d-flex flex-column flex-sm-row mb-lg-32pt">
                        <div class="card-form__body card-body-form-group flex">
                            <div class="row">
                                <div class="col-sm-auto">
                                    <div class="form-group">
                                        <input id="filter_name" name="filter_name" type="text" class="form-control" placeholder="Name" value="{{$filter_name}}" style="width: 150px">
                                    </div>
                                </div>
                                <div class="col-sm-auto">
                                    <div class="form-group">
                                        <label for="filter_level">Levels</label>
                                        <select id="filter_level" name="filter_level" class="custom-select" style="width: 110px;">
                                            <option value="all"  @if($filter_level == "all") selected @endif>All Levels</option>
                                            <option value="nano"  @if($filter_level == "nano") selected @endif>Nano</option>
                                            <option value="micro"  @if($filter_level == "micro") selected @endif>Micro</option>
                                            <option value="mid_tier"  @if($filter_level == "mid_tier") selected @endif>Mid-Tier</option>
                                            <option value="macro"  @if($filter_level == "macro") selected @endif>Macro</option>
                                            <option value="mega"  @if($filter_level == "mega") selected @endif>Mega</option>
                                            <option value="elite"  @if($filter_level == "elite") selected @endif>Elite</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-auto">
                                    <div class="form-group">
                                        <label for="filter_sex">Sex</label>
                                        <select id="filter_sex" name="filter_sex" class="custom-select" style="width: 95px;">
                                            <option value="both" @if($filter_sex == "both") selected @endif>Both</option>
                                            <option value="1" @if($filter_sex == "1") selected @endif>Male</option>
                                            <option value="2" @if($filter_sex == "2") selected @endif>Female</option>
                                        </select>

                                    </div>
                                </div>
                                <div class="col-sm-auto">
                                    <div class="form-group">
                                        <label for="filter_country">Country</label>
                                        <select id="filter_country" name="filter_country" class="custom-select" data-url="{{route('getCountriesStates')}}" style="width: 100px;">
                                            <option selected value="">Select Country</option>
                                            @foreach($countries as $country)
                                                <option value="{{$country->id}}" @if($filter_country == $country->id) selected @endif>{{$country->name}}</option>
                                            @endforeach
                                        </select>

                                    </div>
                                </div>
                                <div class="col-sm-auto">
                                    <div class="form-group">
                                        <label for="filter_state">State</label>
                                        <select id="filter_state" name="filter_state" class="custom-select" style="width: 100px;">
                                            <option selected value="">Select State</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="btn bg-alt border-left border-top border-top-sm-0 rounded-0" id="filter_btn">
                            <i class="material-icons text-primary icon-20pt">check</i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="page-separator">
                    <div class="page-separator__text">Verified</div>
                </div>
                <div class="row">
                    @if($trenders->count() == 0)
                        <div class="col-12  text-info">
                            No Trender Found
                        </div>
                    @else
                        @foreach($trenders as $trender)
                            <div class="col-md-3 mb-2">
                                <div class="card mb-md-0 border-accent">
                                    <div class="card-header pb-0 border-0 d-flex justify-content-center" style="display:block; margin-left: auto; margin-right: auto; width: 50%;">
                                        <div class="avatar avatar-lg text-center">
                                            <img src="{{get_user_image($trender->id)}}" alt="Avatar" class="avatar-img rounded-circle text-center">
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="text-50 mb-16pt justify-content-center">
                                            <div class="flex d-flex flex-column text-center">
                                                <h6 class="card-title m-0">
                                                    {{$trender->first_name}} {{$trender->last_name}}
                                                </h6>
                                                <div class="page-separator"></div>
                                                <small class="m-0">&nbsp;IGT:  @ {{$trender->user_name}}</small>
                                                <small class="text-50">&nbsp;
                                                    <i class="material-icons text-success icon-16pt mr-1">verified_user</i>
                                                    @if(is_null($trender->creator_category))
                                                        <strong>Influencer</strong>
                                                    @else
                                                        <strong>Creator</strong>
                                                    @endif
                                                    &nbsp;({{$trender->badge}})
                                                </small>
                                                <small class="text-50">&nbsp;
                                                    <i class="material-icons text-success icon-16pt mr-1">location_on</i>
                                                    <strong>{{$trender->country->name}}, {{$trender->state->name}}</strong>
                                                </small>
                                                <small class="text-50">&nbsp;
                                                    <i class="material-icons text-success icon-16pt mr-1">person</i>
                                                    <strong>{{calculate_age($trender)}}</strong>&nbsp; / {{\App\Models\User::get_user_level($trender)}}
                                                    <i class="material-icons text-accent ml-4pt icon-16pt">star</i>
                                                </small>
                                            </div>

                                            <div>
                                                <p class="text-center">
                                                    @if($trender->instagram_profile)
                                                        <img src=" {{asset('images/instagram.png')}}" width="18" height="18" alt="Insta">
                                                    @endif
                                                    @if($trender->facebook_profile)
                                                        <img src=" {{asset('images/facebook.png')}}" width="16" height="16" alt="FB">
                                                    @endif
                                                    @if($trender->tiktok_profile)
                                                        <img src="{{asset('images/tiktok.png')}}" width="16" height="16" alt="Tik">
                                                    @endif
                                                    @if($trender->youtube_profile)
                                                        <img src="{{asset('images/youtube.png')}}" width="16" height="16" alt="YT">
                                                    @endif
                                                    @if($trender->twitter_profile)
                                                        <img src="{{asset('images/twitter.png')}}" width="16" height="16" alt="Twitter">
                                                    @endif
                                                    @if($trender->snapchat_profile)
                                                        <img src="{{asset('images/snapchat.png')}}" width="16" height="16" alt="SNAP">
                                                    @endif
                                                </p>
                                            </div>

                                        </div>
                                        <div class="text-center">
                                            <a href="#" class="btn btn-sm btn-secondary view_trender_info"
                                               data-url="{{route('getUserInfo',[$trender,$campaign])}}" >
                                                <i class="fa fa-eye icon--center"></i>
                                            </a>
                                            @if(in_array($trender->id,$campaign_users))
                                                <a href="{{route('removeCampaignUser',[$trender,$campaign])}}" class="btn btn-sm btn-light" >
                                                    <i class="fa fa-user-minus icon--center"></i>
                                                </a>
                                            @else
                                                <a href="{{route('addCampaignUser',[$trender,$campaign])}}" class="btn btn-sm btn-light">
                                                    <i class="fa fa-user-plus icon--center"></i>
                                                </a>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    @endif
                </div>
            </div>
            <div class="col-md-6">
                <div class="page-separator">
                    <div class="page-separator__text">Trenders</div>
                </div>
            </div>
        </div>
        <br>
        {{$trenders->links()}}
        <br><br>
        <!-- <button type="submit" class="btn btn-primary" >NEXT -> BRIEF</button> -->
        <button type="submit" class="btn btn-accent" id="campaign_mode_submit">
            <i class="material-icons icon--left">forward</i> REVIEW AND PAYMENT
        </button>
    </div>
@endsection
@push('page-scripts')
    <div id="trenderModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content justify-content-center">
                <div class="modal-header">
                    <h6 class="modal-title">
                        <h5>Trender's Informations and Rate(s)</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </h6>
                </div>
                <div class="modal-body">
                    <div id="trender_modal_info"></div>
                </div>
                <!-- End modal html  -->
            </div>
        </div>
    </div>
    <script>
        $( "#filter_country" ).change(function() {
            const country = $("#filter_country").children("option:selected").val();
            $('#filter_state option:not(:first)').remove();
            if (country  !== ""){
                let path = $(this).data('url');
                path = path+'?country='+country;
                $.ajax({
                    url: path,
                    type: "GET",
                    success: function (data) {
                        const states = data.states
                        var _options =""
                        $.each(states, function(i, value) {
                            _options +=('<option value="'+ value.id+'">'+ value.name +'</option>');
                        });
                        $('#filter_state').append(_options);
                    }
                });
            }
        });
    </script>
    <script>
        $( ".view_trender_info" ).click(function(e) {
            e.preventDefault();
            const url = $(this).data('url');
            $.ajax({
                url: url,
                type: "GET",
                success: function (data) {
                    if(data.status){
                        $('#trender_modal_info').html(data.info);
                        $('#trenderModal').modal('show');
                    }
                }
            });
        });
        $( "#campaign_mode_submit" ).click(function(e) {
            $('form#campaign_mode_form').submit();
        });
    </script>
@endpush
