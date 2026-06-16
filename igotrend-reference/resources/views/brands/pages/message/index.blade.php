@extends('brands.layout.app')
@section('title','Messages')
@section('page_title','Message Board')
@section('page_route','Home / Messages')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="row">
                <div class="col-md-8">
                    <div class="card card-body p-lg-24pt">
                        <div class="d-flex align-items-center">
                            <div class="mr-3">
                                <div class="avatar avatar-xl">
                                    <img src="{{get_user_image(auth()->user()->id)}}" alt="people" class="avatar-img rounded-circle">
                                </div>
                            </div>
                            <div class="flex">
                                <h4 class="mb-0">{{\Illuminate\Support\Facades\Auth::user()->first_name}} {{\Illuminate\Support\Facades\Auth::user()->last_name}}</h4>
                                <p class="text-50 mb-0">{{auth()->user()->email}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card card-body text-center">
                        <h5>
                            Select Any Trender for chat
                        </h5>
                    </div>
                </div>
                <div class="col-md-4">

                    <h5 class="text-70">Campaign Advertisers</h5>
                    <div class="sidebar sidebar-right sidebar-light bg-white o-hidden" style="height: unset !important;">
                        <div class="d-flex flex-column ">
                            <div class="d-flex flex-column justify-content-center navbar-height">
                                <div class="px-3 form-group mb-0">
                                    <div class="input-group input-group-merge input-group-rounded flex-nowrap">
                                        <select id="custom-select" class="form-control custom-select campaign_select">
                                            <option selected value="" data-url="{{route('brand_messages')}}">More Campaigns</option>
                                            @foreach($campaigns as $campaign)
                                                <option value="{{$campaign->id}}" @if($campaign_id == $campaign->id) selected @endif data-url="{{route('brand_messages',['campaign_id'=>$campaign->id])}}">{{$campaign->name}}</option>
                                            @endforeach
                                        </select>
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <span class="material-icons">filter_list</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex" data-perfect-scrollbar>
                                <div class="sidebar-heading">Online</div>
                                <ul class="list-group list-group-flush mb-3">
                                    @if($advertisers->count() == 0)
                                        <li class="list-group-item px-3 py-12pt bg-light">
                                            no trender found
                                        </li>
                                    @else
                                        @foreach($advertisers as $advertiser)
                                            <li class="list-group-item px-3 py-12pt bg-light">
                                                <a href="{{route('brandChatIndex',$advertiser)}}" class="d-flex align-items-center position-relative" id="advertiser_{{$advertiser->id}}">
                                                    <span class="avatar avatar-xs  @if($advertiser->is_login == \App\Models\User::LOGIN) avatar-online @endif mr-3 flex-shrink-0">
                                                        <img src="{{get_user_image($advertiser->id)}}" alt="Avatar" class="avatar-img rounded-circle">
                                                    </span>
                                                    <span class="flex d-flex flex-column" style="max-width: 175px;">
                                                        <strong class="text-body">{{ucwords($advertiser->first_name)}} {{ucwords($advertiser->last_name)}}</strong>
                                                    </span>
                                                    @php
                                                        $count_un_read_message = \App\Models\UserMessage::where('from_user',$advertiser->id)
                                                                  ->where('to_user',auth()->user()->id)
                                                                  ->where('is_read',0)
                                                                   ->count();
                                                    @endphp
                                                    @if($count_un_read_message > 0)
                                                        <span class="badge badge-notifications badge-accent" id="advertiser_badge_{{$advertiser->id}}">{{$count_un_read_message}}</span>
                                                    @endif
                                                </a>
                                            </li>
                                        @endforeach
                                    @endif
                                </ul>
                                <div class="sidebar-heading d-flex">
                                    <div class="flex text-muted">Administrator</div>
                                </div>
                                <ul class="list-group list-group-flush mb-3">
                                    @if($admins->count() == 0)
                                        <li class="list-group-item px-3 py-12pt bg-light">
                                            no admins found
                                        </li>
                                    @else
                                        @foreach($admins as $admin)
                                            <li class="list-group-item px-3 py-12pt">
                                                <a href="{{route('brand_admin_chat',$admin)}}" class="d-flex align-items-center position-relative" id="admin_{{$admin->id}}">
                                                    <span class="avatar avatar-xs @if($admin->is_login == \App\Models\Admin::LOGIN) avatar-online @endif mr-3 flex-shrink-0">
                                                        <span class="avatar-title rounded-circle">{{get_name_first_letters($admin->name)}}</span>
                                                    </span>
                                                    <span class="flex d-flex flex-column" style="max-width: 175px;">
                                                        <strong class="text-body">{{$admin->name}}</strong>
                                                    </span>
                                                    @php
                                                        $count_admin_un_read_message = \App\Models\AdminMessage::where('from_user',$admin->id)
                                                                  ->where('to_user',\auth()->user()->id)
                                                                  ->where('is_read',0)
                                                                  ->count();
                                                    @endphp
                                                    @if($count_admin_un_read_message > 0)
                                                        <span class="badge badge-notifications badge-accent" id="admin_badge_{{$admin->id}}">{{$count_admin_un_read_message}}</span>
                                                    @endif
                                                </a>
                                            </li>
                                        @endforeach
                                    @endif
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script>
        $( ".campaign_select" ).change(function() {
            window.location = $(this).find(":selected").attr("data-url");
        });
    </script>
    <script>
        setInterval(function () {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            @if($advertisers_ids->count() > 0)
               $.ajax({
                url: '{{route('get_unread_messages')}}',
                data:{
                    'advertiser_ids':  '{{implode(',',$advertisers_ids->toArray())}}',
                },
                type: "POST",
                success: function (data) {
                    if(data.status){
                        const response_data = data.response_data;
                        $.map(response_data, function(value, index) {
                            const advertiser_id = value.advertiser_id;
                            const badge_id = '#advertiser_badge_'+advertiser_id;
                            const advertiser = '#advertiser_'+advertiser_id;
                            const count_message = value.count_message;
                            if ($(badge_id).length) {
                                if(count_message > 0){
                                    if ($(badge_id).hasClass('d-none')){
                                        $(badge_id).removeClass('d-none');
                                    }
                                    $(badge_id).text(count_message);
                                }else {
                                    if (value.is_remove === true){
                                        $(badge_id).addClass('d-none');
                                    }
                                }
                            }else {
                                if(count_message > 0){
                                    const span = '<span class="badge badge-notifications badge-accent" id="advertiser_badge_'+advertiser_id+'">'+count_message+'</span>'
                                    $(advertiser).append(span)
                                }
                            }
                        });
                    }
                }
            });
            @endif
            @if($admin_ids->count() > 0)
            $.ajax({
                url: '{{route('get_admin_unread_messages')}}',
                data:{
                    'admin_ids':  '{{implode(',',$admin_ids->toArray())}}',
                },
                type: "POST",
                success: function (data) {
                    if(data.status){
                        const response_data = data.response_data;
                        $.map(response_data, function(value, index) {
                            const admin_id = value.admin_id;
                            const badge_id = '#admin_badge_'+admin_id;
                            const admin = '#admin_'+admin_id;
                            const count_message = value.count_message;
                            if ($(badge_id).length) {
                                if(count_message > 0){
                                    if ($(badge_id).hasClass('d-none')){
                                        $(badge_id).removeClass('d-none');
                                    }
                                    $(badge_id).text(count_message);
                                }else {
                                    if (value.is_remove === true){
                                        $(badge_id).addClass('d-none');
                                    }
                                }
                            }else {
                                if(count_message > 0){
                                    const span = '<span class="badge badge-notifications badge-accent" id="admin_badge_'+admin_id+'">'+count_message+'</span>'
                                    $(admin).append(span)
                                }
                            }
                        });
                    }
                }
            });
            @endif
        }, 3000);
    </script>
@endpush
