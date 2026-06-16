@extends('admin.layout.dashboard')
@section('title','Campaign Reports')
@section('page_title','Campaign Reports')
@section('page_route','Campaign Mgt / Reports')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">

            <div class="page-separator">
                <div class="page-separator__text">Overview</div>
            </div>

            <div class="row card-group-row mb-lg-8pt">
                <div class="col-lg-4 card-group-row__col">

                    <div class="card card-group-row__card align-items-center">
                        <div class="card-header d-flex">
                            <div class="flex row align-items-center">
                                <div class="col-auto d-flex flex-column align-items-center">
                                    <div class="h3 mb-0">
                                        <img src="{{asset('images/nairalogo.png')}}" alt="n" class="flex">
                                        {{number_format($reward_send,2)}}
                                    </div>
                                    <p class="mb-0"><strong>Rewards Sent</strong></p>
                                </div>

                            </div>
                        </div>

                        <div class="card-header d-flex">
                            <div class="flex row">
                                <div class="col-auto d-flex flex-column">
                                    <div class="h2 mb-0">
                                        <img src="{{asset('images/nairalogo.png')}}" alt="n" class="flex">
                                        {{number_format($campaign_budget,2)}}
                                    </div>
                                    <p class="mb-0"><strong> Total Campaign Budgets</strong></p>
                                </div>

                            </div>
                        </div>


                        <div class="card-body d-flex flex-column justify-content-center">
                            <div>
                                <a href="{{route('manage_create_campaign')}}">
                                    <button type="button" class="btn btn-secondary">
                                        <i class="material-icons icon--left">launch</i> Launch New Campaign!
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-header d-flex">
                            <div class="flex d-flex align-items-center">
                                <div class="mb-0 mr-3"><i class="material-icons icon-32pt text-20 mb-4pt">security</i></div>
                                <div class="d-flex flex-column">
                                    <p class="mb-0"><strong>Message Board</strong></p>
                                    <small class="text-50">Admin</small>
                                </div>
                            </div>
                        </div>
                        <div class="list-group list-group-flush">
                            <div class="list-group-item d-flex align-items-start p-16pt">
                                <div class="d-flex flex-column mr-16pt">
                                    <small class="text-uppercase text-50">{{\Illuminate\Support\Carbon::parse($settings->message_notification_date)->format('M')}}</small>
                                    <strong class="border-bottom-2 border-bottom-accent">{{\Illuminate\Support\Carbon::parse($settings->message_notification_date)->format('d')}}</strong>
                                </div>
                                <div class="flex">
                                    <p class="mb-0 text-50">
                                        {{$settings->message_notification}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="col-lg-4 card-group-row__col">
                    <div class="card card-group-row__card align-items-center">
                        <div class="card-header d-flex">
                            <div class="flex row align-items-center">
                                <div class="col-auto d-flex flex-column align-items-center">
                                    <div class="h3 mb-0">{{number_format($trender_collabs,2)}}</div>
                                    <p class="mb-0"><strong>Trenders collabs</strong></p>
                                </div>
                            </div>
                        </div>

                        <div class="card-header d-flex">
                            <div class="flex row">
                                <div class="col-auto d-flex flex-column">
                                    <div class="h3 mb-0">{{number_format($reach,2)}} / {{number_format($engagement,2)}}</div>
                                    <p class="mb-0"><strong> Reach / Engagement</strong></p>
                                </div>

                            </div>
                        </div>

                        <div class="card-body d-flex flex-column justify-content-center">
                            <div>
                                <a href="{{route('admin_reward_contacts')}}"><button type="button" class="btn btn-secondary">
                                        <i class="material-icons icon--left">launch</i> Reward Trenders!
                                    </button>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-2 mr-sm-2 mb-sm-0 flex align-items-right text-right">
                {{--                <a href="invoice.php" class="btn btn-sm btn-outline-secondary mr-16pt">Print <i class="icon--right material-icons">print</i></a>--}}
                @if($campaign_id)
                    <a href="{{route('admin_campaign_report',$campaign_id)}}" class="btn btn-sm btn-outline-secondary" >
                        Download
                        <i class="icon--right material-icons">file_download</i>
                    </a>
                @else
                    <a href="#" class="btn btn-sm btn-outline-secondary" >
                        Download
                        <i class="icon--right material-icons">file_download</i>
                    </a>
                @endif
            </div>

            <div class="page-separator">
                <div class="page-separator__text">
                    <div class="d-flex flex-column justify-content-center navbar-height">
                        <div class="px-3 form-group mb-0">
                            <div class="input-group input-group-merge input-group-rounded flex-nowrap">
                                <select  class="form-control" id="campaigns">
                                    <option value="" data-url="{{route('admin_reports')}}">Select Campaign</option>
                                    @foreach($campaigns as $campaign)
                                        <option value="{{$campaign->id}}" data-url="{{route('admin_reports',['campaign_id'=> $campaign->id])}}" @if($campaign_id == $campaign->id) selected @endif>
                                            {{$campaign->name}}
                                        </option>
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
                </div>
            </div>

            <div class="posts-cards mb-24pt">
                <div class="bs-example">
                    <div class="accordion" id="accordionExample">
                        @if($campaigns_submissions->count() == 0)
                            <div class="card">
                                <div class="card-body">
                                    <div class="text-center">
                                        <h5 class="text-info">No Submission Exist</h5>
                                    </div>
                                </div>
                            </div>
                        @else
                            @foreach($campaigns_submissions as $key => $submission)
                                <div class="card">
                                    <div class="card-header posts-card" id="headingOne">
                                        <div class="posts-card__content d-flex align-items-center flex-wrap" data-toggle="collapse" data-target="#collapse{{$loop->iteration}}">
                                            <div class="avatar avatar-lg mr-3">
                                                @if(!$submission->campaign->getMedia('campaign_cover_image')->isEmpty())
                                                    <img src="{{asset($submission->campaign->getMedia('campaign_cover_image')->first()->getUrl())}}"
                                                         alt="avatar"
                                                         class="avatar-img rounded">
                                                @endif
                                            </div>
                                            <div class="posts-card__title flex d-flex flex-column">
                                                <h5 class="card-title m-0 headings-color">{{$submission->campaign->name}}</h5>
                                                <small class="text-50">
                                                    <i class="material-icons text-success icon-16pt mr-1">remove_red_eye</i>{{number_format($submission->views)}} views / &nbsp;
                                                    <i class="material-icons text-success icon-16pt mr-1">thumb_up_alt</i>{{number_format($submission->likes)}} Likes</small>
                                                <small class="text-50">
                                                    @if($submission->status == \App\Models\CampaignSubmission::REVIEW )
                                                        <a href="javascript:void(0)" class="btn btn-sm btn-secondary approve_submission"
                                                           data-url="{{route('admin_approve_submission',$submission)}}">
                                                            <i class="material-icons">thumb_up_alt</i>
                                                            Approve
                                                        </a>
                                                    @endif
                                                    @if($submission->status == \App\Models\CampaignSubmission::REVIEW)
                                                        <a href="javascript:void(0)" class="btn btn-sm btn-secondary reject_submission"
                                                           data-url="{{route('admin_reject_submission',$submission)}}">
                                                            <i class="material-icons">thumb_down_alt</i>
                                                            Reject
                                                        </a>
                                                    @endif
                                                </small>
                                            </div>
                                            <div class="d-flex align-items-center flex-column flex-sm-row posts-card__meta">
                                                <div class="mr-3 text-50 text-uppercase posts-card__tag d-flex align-items-center">
                                                    <small class="text-50">
                                                        @if($submission->status == \App\Models\CampaignSubmission::REVIEW)
                                                            <a href="javascript:void(0)" type="button" class="btn btn-warning btn-sm">
                                                                <i class="material-icons icon--left">rate_review</i>Review
                                                            </a>
                                                        @endif
                                                        @if($submission->status == \App\Models\CampaignSubmission::APPROVED)
                                                            <a href="javascript:void(0)" type="button" class="btn btn-primary btn-sm">
                                                                <i class="material-icons icon--left">check</i>Approved
                                                            </a>
                                                        @endif
                                                        @if($submission->status == \App\Models\CampaignSubmission::REJECT)
                                                            <a href="javascript:void(0)" type="button" class="btn btn-danger btn-sm">
                                                                <i class="material-icons icon--left">cancel</i>Rejected
                                                            </a>
                                                        @endif
                                                    </small>
                                                </div>
                                                <div class="mr-3 text-50 posts-card__date">
                                                    <small >{{\Illuminate\Support\Carbon::parse($submission->created_at)->format('d')}} {{\Illuminate\Support\Carbon::parse($submission->created_at)->format('M')}}, {{\Illuminate\Support\Carbon::parse($submission->created_at)->format('Y')}} {{\Illuminate\Support\Carbon::parse($submission->created_at)->format('h:i A')}}</small>
                                                </div>
                                                <div class="media mr-2 ml-sm-auto align-items-center">
                                                    <div class="media-left mr-2 avatar-group">
                                                        <div class="avatar avatar-xs" >
                                                            <img src="{{get_user_image($submission->user->id)}}"
                                                                 alt="Avatar"
                                                                 class="avatar-img rounded-circle">
                                                        </div>
                                                    </div>
                                                    <div class="media-body">
                                                        <a href="">IGT{{ '@'.$submission->user->user_name }}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="collapse{{$loop->iteration}}" class="collapse @if($loop->iteration == 1) show @endif" aria-labelledby="headingOne" data-parent="#accordionExample">
                                        <div class="row nestable-content">
                                            @foreach(explode(',',$submission->screenshot_image) as $image)
                                                <div class="col-sm-6 col-md-4">
                                                    <div class="card posts-card-popular">
                                                        <a href="{{asset('storage/screen_shots/'.$image)}}" data-lightbox="submission{{$key}}">
                                                            <img src="{{asset('storage/screen_shots/'.$image)}}"  class="card-img" style="object-fit: fill !important;">
                                                        </a>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        @endif

                    </div>
                </div>
            </div>
            @if($campaigns_submissions->hasPages())
                <div class="card p-8pt mb-0 d-inline-block">
                    {{$campaigns_submissions->links('vendor.pagination.bootstrap-4')}}
                </div>
            @endif
        </div>
    </div>
@endsection
@push('page-scripts')
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css"  />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js" ></script>
    <script>
        $( ".approve_submission" ).click(function(e) {
            e.preventDefault();
            $(this).addClass('disabled')
            Swal.fire({
                title: 'Are you sure ?',
                text: "You are authorizing this submissions",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Approve it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const path = $(this).data('url');
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: path,
                        type: "POST",
                        success: function (data) {
                            $(this).removeClass('disabled');
                            if (data.status === true){
                                Swal.fire(
                                    'Approved!',
                                    'Submission Approved.',
                                    'success'
                                )
                                window.location.reload()
                            }
                            if (data.status === false){
                                Swal.fire(
                                    'Failed!',
                                    data.message,
                                    'error'
                                )
                            }
                        }
                    });
                }
                if (result.isDismissed){
                    $(this).removeClass('disabled');
                }
            })
            return false;
        });
        $( ".reject_submission" ).click(function(e) {
            e.preventDefault();
            $(this).addClass('disabled')
            Swal.fire({
                title: 'Are you sure ?',
                text: "You will still be able to review more submissions from this trender",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Reject it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const path = $(this).data('url');
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: path,
                        type: "POST",
                        success: function (data) {
                            $(this).removeClass('disabled');
                            Swal.fire(
                                'Rejected!',
                                'Submission Rejected.',
                                'error'
                            )
                            if (data.status === true){
                                window.location.reload()
                            }
                        }
                    });
                }
                if (result.isDismissed){
                    $(this).removeClass('disabled');
                }
            })
            return false;
        });
    </script>
    <script>
        $( "#campaigns" ).change(function () {
            const url = $(this).find(':selected').data('url')
            window.location = url;
        })
    </script>
@endpush
