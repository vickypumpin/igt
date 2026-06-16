@extends('creators.layout.app')
@section('title','Dashboard')
@section('page_title','Dashboard')
@section('page_route','Dashboard')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="page-separator">
                <div class="page-separator__text">Overview</div>
            </div>

            <div class="row card-group-row mb-lg-8pt">
                <div class="col-lg-7 card-group-row__col">

                    <div class="card card-group-row__card d-flex flex-column">
                        <div class="row no-gutters flex">
                            <div class="col-6">
                                <div class="card-body">
                                    <h6 class="text-50">Invitations</h6>
                                    <div class="h2 mb-0">{{ $total_invitations }}</div>
                                    <div class="d-flex flex-column">
                                        <strong>Total Campaigns</strong>
                                        <small class="text-50">All time <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i></small>

                                    </div>
                                </div>
                                <div class="card-body">
                                    <h6 class="text-50">Declined</h6>
                                    <div class="h2 mb-0">{{ $declined_invitations }}</div>
                                    <div class="d-flex flex-column">
                                        <strong>Total Campaigns</strong>
                                        <small class="text-50">All time <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i></small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 border-left">
                                <div class="card-body">
                                    <h6 class="text-50">Completed</h6>
                                    <div class="h2 mb-0">{{$completed_invitations}}</div>
                                    <div class="d-flex flex-column">
                                        <strong>Total Campaigns</strong>
                                        <small class="text-50">All time <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i></small>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <h6 class="text-50">Accepted</h6>
                                    <div class="h2 mb-0">{{$completed_invitations}}</div>
                                    <div class="d-flex flex-column">
                                        <strong>Total Campaigns</strong>
                                        <small class="text-50">All time <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i></small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-lg-5 card-group-row__col">

                    <div class="card card-group-row__card">
                        <div class="card-header d-flex align-items-center">
                            <strong class="flex">Platform</strong>
                            <div class="flex ml-4pt">
                                <div class="d-flex flex-column align-items-left">
                                    <p class="mb-0"><strong>Handles</strong></p>
                                </div>
                            </div>
                            <a href=""><i class="material-icons text-20 icon-16pt">people</i>&nbsp;</a>

                        </div>
                        <div class="card-body d-flex flex-column align-items-center justify-content-center">
                            <ul class="list-unstyled list-skills w-100">
                                <li class="mb-8pt">
                                    <div class="text-50 border-right"><small>Instagram</small></div>
                                    <div class="flex ml-4pt">
                                        <div class="d-flex flex-column small">
                                            @if(auth()->user()->instagram_profile)
                                                <p class="mb-0"><strong>{{auth()->user()->instagram_profile}}</strong></p>
                                            @else
                                                <p class="mb-0"><strong>N/A</strong></p>
                                            @endif
                                        </div>
                                    </div>
                                    @if(auth()->user()->instagram_profile)
                                        <div class="text-70"><small>{{auth()->user()->instagram_followers}}</small></div>
                                    @else
                                        <div class="text-70"><small>N/A </small></div>
                                    @endif
                                </li>
                                <li class="mb-8pt">
                                    <div class="text-50 border-right"><small>Facebook</small></div>
                                    <div class="flex ml-4pt">
                                        <div class="d-flex flex-column small">
                                            @if(auth()->user()->facebook_profile)
                                                <p class="mb-0"><strong>{{auth()->user()->facebook_profile}}</strong></p>
                                            @else
                                                <p class="mb-0"><strong>N/A</strong></p>
                                            @endif
                                        </div>
                                    </div>
                                    @if(auth()->user()->facebook_profile)
                                        <div class="text-70"><small>{{auth()->user()->facebook_followers}}</small></div>
                                    @else
                                        <div class="text-70"><small>N/A </small></div>
                                    @endif
                                </li>
                                <li class="mb-8pt">
                                    <div class="text-50 border-right"><small>Twitter</small></div>
                                    <div class="flex ml-4pt">
                                        <div class="d-flex flex-column small">
                                            @if(auth()->user()->twitter_profile)
                                                <p class="mb-0"><strong>{{auth()->user()->twitter_profile}}</strong></p>
                                            @else
                                                <p class="mb-0"><strong>N/A</strong></p>
                                            @endif
                                        </div>
                                    </div>
                                    @if(auth()->user()->twitter_profile)
                                        <div class="text-70"><small>{{auth()->user()->twitter_followers}}</small></div>
                                    @else
                                        <div class="text-70"><small>N/A </small></div>
                                    @endif
                                </li>
                                <li class="mb-8pt">
                                    <div class="text-50 border-right"><small>Youtube</small></div>
                                    <div class="flex ml-4pt">
                                        <div class="d-flex flex-column small">
                                            @if(auth()->user()->youtube_profile)
                                                <p class="mb-0"><strong>{{auth()->user()->youtube_profile}}</strong></p>
                                            @else
                                                <p class="mb-0"><strong>N/A</strong></p>
                                            @endif
                                        </div>
                                    </div>
                                    @if(auth()->user()->youtube_profile)
                                        <div class="text-70"><small>{{auth()->user()->youtube_followers}}</small></div>
                                    @else
                                        <div class="text-70"><small>N/A </small></div>
                                    @endif
                                </li>
                                <li class="mb-8pt">
                                    <div class="text-50 border-right"><small>Tiktok</small></div>
                                    <div class="flex ml-4pt">
                                        <div class="d-flex flex-column small">
                                            @if(auth()->user()->tiktok_profile)
                                                <p class="mb-0"><strong>{{auth()->user()->tiktok_profile}}</strong></p>
                                            @else
                                                <p class="mb-0"><strong>N/A</strong></p>
                                            @endif
                                        </div>
                                    </div>
                                    @if(auth()->user()->tiktok_profile)
                                        <div class="text-70"><small>{{auth()->user()->tiktok_followers}}</small></div>
                                    @else
                                        <div class="text-70"><small>N/A </small></div>
                                    @endif
                                </li>
                                <li class="mb-0">
                                    <div class="text-50 border-right"><small>Snapchat</small></div>
                                    <div class="flex ml-4pt">
                                        <div class="d-flex flex-column small">
                                            @if(auth()->user()->snapchat_profile)
                                                <p class="mb-0"><strong>{{auth()->user()->snapchat_profile}}</strong></p>
                                            @else
                                                <p class="mb-0"><strong>N/A</strong></p>
                                            @endif
                                        </div>
                                    </div>
                                    @if(auth()->user()->snapchat_profile)
                                        <div class="text-70"><small>{{auth()->user()->snapchat_followers}}</small></div>
                                    @else
                                        <div class="text-70"><small>N/A </small></div>
                                    @endif
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>
            </div>

            <div class="page-separator">
                <div class="page-separator__text">Invitations</div>
            </div>

            <div class="card ">
                <div class="card-body">
                    <table class="table mb-0 thead-border-top-0 table-nowrap" id="invitations">
                        <thead>
                        <tr>
                            <th>
                                Campaign Name
                            </th>
                            <th class="text-center" style="width: 51px;">
                                Trenders
                            </th>
                            <th style="width: 51px;">
                                Duration
                            </th>
                            <th style="width: 51px;">
                                End Date
                            </th>
                            <th style="width: 51px;">
                                Amount
                            </th>
                            <th style="width: 24px;" class="pl-0">
                            </th>
                        </tr>
                        </thead>
                        <tbody  >

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $("#invitations").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            ajax: '{{ route('get_user_invitations') }}',
            columns: [
                {data: 'campaign_name', name: 'campaign_name'},
                {data: 'trenders', name: 'trenders'},
                {data: 'duration', name: 'duration'},
                {data: 'end_date', name: 'end_date'},
                {data: 'amount', name: 'amount'},
                {data: 'actions', name: 'actions',searchable:false,orderable:false},
            ]
        });
    </script>
@endpush
