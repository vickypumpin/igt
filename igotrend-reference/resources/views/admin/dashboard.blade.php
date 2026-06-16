@extends('admin.layout.dashboard')
@section('title','Dashboard')
@section('page_title','Dashboard')
@section('page_route','Dashboard')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="page-separator">
                <div class="page-separator__text">Campaign Overview</div>
            </div>

            <div class="row card-group-row mb-lg-8pt">
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Revenue / Current Month </strong>
                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($total_revenue,2)}}
                                        <small class="text-muted"> / {{number_format($current_month_revenue,2)}}</small>
                                        </span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>API / Taxes </strong>

                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($total_taxes,2)}}
                                        <small class="text-muted"> / {{number_format($total_taxes,2)}}</small>
                                        </span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">insert_invitation</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Payouts / Current Month</strong>
                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($total_payout,2)}}
                                        <small class="text-muted"> / {{number_format($current_month_payout,2)}}</small>
                                        </span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">lock_outline</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row card-group-row mb-lg-8pt">
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Active / Completed</strong>
                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">
                                            {{number_format($active_campaigns)}}
                                            <small class="text-muted"> /  {{number_format($complete_campaigns)}}</small>
                                        </span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Accepted / Declined</strong>

                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">
                                           {{number_format($total_accept_invitations)}}
                                            <small class="text-muted"> / {{number_format($total_decline_invitations)}}</small>
                                        </span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">radio_button_checked</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Invitations / Pending</strong>
                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($total_invitations)}}
                                        <small class="text-muted"> / {{number_format($total_pending_invitations)}}</small>
                                        </span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">insert_invitation</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="page-separator">
                <div class="page-separator__text">Create Campaigns</div>
            </div>

            <div class="row card-group-row mb-16pt mb-lg-40pt">
                <div class="col-lg-4 col-sm-6 card-group-row__col">

                    <div class="card card-group-row__card text-center o-hidden card--raised ">

                        <span class="corner-ribbon corner-ribbon--default-right-top corner-ribbon--shadow bg-danger text-white" style="position:absolute; z-index: 1;">Create</span>

                        <div class="card-body d-flex flex-column">
                            <div class="flex-grow mb-16pt">
                                <a href="{{route('manage_create_campaign')}}" class="d-block mb-16pt"><img src="{{asset('images/girlsub.png')}}" alt="" style="height: 154px;" class="card-img card-img-cover"></a>
                            </div>
                            <p class="d-flex justify-content-center align-items-center m-0">
                                <span class="h4 m-0 font-weight-normal">Create &nbsp;</span>
                                <span class="h4 m-0 font-weight-normal">Campaign</span>
                            </p>
                        </div>
                        <div class="card-footer">
                            <a href="{{route('manage_create_campaign')}}">
                                <button type="button" class="btn btn-accent">
                                    <i class="material-icons icon--left">launch</i> Get Started
                                </button>
                            </a>
                        </div>
                    </div>

                </div>
                <div class="col-lg-4 col-sm-6 card-group-row__col">

                    <div class="card card-group-row__card text-center o-hidden card--raised ">

                        <span class="corner-ribbon corner-ribbon--default-right-top corner-ribbon--shadow bg-warning text-white">Alert</span>

                        <div class="card-body d-flex flex-column">
                            <div class="flex-grow mb-16pt">
                                            <span class="w-64 h-64 icon-holder icon-holder--outline-accent rounded-circle d-inline-flex mb-16pt">
                                                <i class="material-icons">people</i>
                                            </span>
                                <h4 class="mb-8pt">Community<Br> Guidelines</h4>
                                <p class="text-70 mb-0">Make sure you read and understand the guidelines on the FAQ page.</p>
                            </div>
                            <p class="lh-1 text-muted mb-0"><small><a href="#">Read More</a></small></p>
                        </div>
                        <!-- <div class="card-footer">
                            <a href="signup.html" class="btn btn-accent">Get started</a>
                        </div> -->
                    </div>

                </div>
                <div class="col-lg-4 col-sm-6 card-group-row__col">

                    <div class="card card-group-row__card text-center o-hidden card--raised ">

                        <span class="corner-ribbon corner-ribbon--default-right-top corner-ribbon--shadow bg-danger text-white" style="position:absolute; z-index: 1;">Create</span>

                        <div class="card-body d-flex flex-column">
                            <div class="flex-grow mb-16pt">
                                <a href="#" class="d-block mb-16pt"><img src="{{asset('images/cc.png')}}" alt="" style="height: 154px;" class="card-img card-img-cover"></a>
                            </div>
                            <p class="d-flex justify-content-center align-items-center m-0">
                                <span class="h4 m-0 font-weight-normal">Reward &nbsp;</span>
                                <span class="h4 m-0 font-weight-normal">Trenders</span>
                            </p>
                        </div>
                        <div class="card-footer">
                            <a href="{{route('admin_reward_contacts')}}">
                                <button type="button" class="btn btn-warning">
                                    <i class="material-icons icon--left">launch</i> Get Started
                                </button>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <div class="page-separator">
                <div class="page-separator__text">Review Request</div>
            </div>

            <div class="card mb-0">
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="campaigns" >Campaigns</label>
                                <select id="campaigns" class="form-control filter_campaign" >
                                    <option value="">All Campaigns</option>
                                    @foreach($campaigns as $campaign)
                                        <option value="{{$campaign->id}}">{{$campaign->name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table" id="trender_invite_request">
                                    <thead>
                                    <tr>
                                        <th>
                                            Trender(s)
                                        </th>
                                        <th style="width: 150px;">
                                            Category
                                        </th>
                                        <th class="text-center" style="width: 48px;">
                                            Level
                                        </th>
                                        <th style="width: 120px;">
                                            Platform
                                        </th>
                                        <th style="width: 51px;">
                                            Accept Status
                                        </th>
                                        <th style="width: 51px;">
                                            Payment Status
                                        </th>
                                        <th style="width: 51px;">
                                            PayOut(s)
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
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $("#trender_invite_request").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            "ajax": {
                "url": '{{ route('trenders_requests') }}',
                "data": function ( d ) {
                    d.campaign = $('#campaigns').val();
                }
            },
            columns: [
                {data: 'trender',name: 'trender'},
                {data: 'category', name: 'category'},
                {data: 'level', name: 'level'},
                {data: 'platform', name: 'platform'},
                {data: 'status', name: 'status'},
                {data: 'payment_status', name: 'payment_status'},
                {data: 'payout', name: 'payout'},
                {data: 'actions', name: 'actions',searchable:false,orderable:false},
            ]
        });
        $( "#campaigns" ).change(function() {
            $('#trender_invite_request').DataTable().ajax.reload();
        });
    </script>
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
        $(document).on("click",".view_trender_info",function(e) {
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
    </script>
@endpush
