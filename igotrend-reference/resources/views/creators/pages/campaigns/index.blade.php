@extends('creators.layout.app')
@section('title','My Campaigns')
@section('page_title','My Campaigns')
@section('page_route','CAMPAIGNS / OVERVIEW')
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
{{--                                        <img src="{{asset('images/nairalogo.png')}}" alt="n" class="flex">--}}
                                        {{number_format($total_gems_received,2)}}
                                    </div>
                                    <p class="mb-0"><strong>Total Gems Received</strong></p>
                                </div>

                            </div>
                        </div>

                        <div class="card-header d-flex">
                            <div class="flex row">
                                <div class="col-auto d-flex flex-column">
                                    <div class="h2 mb-0 text-center">
{{--                                        <img src="{{asset('images/nairalogo.png')}}" alt="n" class="flex">--}}
                                        {{number_format(auth()->user()->gems,2)}}
                                    </div>
                                    <p class="mb-0"><strong>Current Gems Balance</strong></p>
                                </div>

                            </div>
                        </div>


                        <div class="card-body d-flex flex-column justify-content-center">
                            <div>
                                <p class="d-flex align-items-center mb-4pt">
                                    <a data-href="{{route('redeem_gems')}}" class="btn btn-accent text-white @if(auth()->user()->gems == 0) disabled @endif" id="redeem_gems">Redeem Gems</a>
                                </p>
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

                    <div class="card card-group-row__card">
                        <div class="card-header p-0 nav border-0">
                            <div class="row no-gutters flex" role="tablist">
                                <div class="col-auto">
                                    <div class="p-card-header pr-0">
                                        <div class="border-right pr-16pt">
                                            <div class="d-flex flex-column">
                                                <p class="mb-0"><strong>TopUP</strong></p>
                                                <small class="text-50">Rewards & Loyalty</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-auto flex">
                                    <div class="p-card-header d-flex flex-column align-items-end">
                                        <i class="material-icons text-50">more_horiz</i>
                                        <div class="flex d-flex align-items-center align-self-start">
                                            <div class="position-relative mr-16pt">
                                                <div class="text-center fullbleed d-flex align-items-center justify-content-center flex-column z-0">
                                                    <small>100%</small>
                                                </div>
                                                <canvas width="48" height="48" class="chart-canvas position-relative z-1 js-update-chart-progress-accent" id="invoicesProgressChart" data-chart-line-background-color="teal;gray" data-chart-disable-tooltips="true"></canvas>
                                            </div>
                                            <small class="text-50">Mobile Airtime </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-header d-flex">
                            <div class="flex row">
                                <div class="col-auto d-flex flex-column">
                                    <div class="h2 mb-0 "><img src="{{asset('images/nairalogo.png')}}" alt="n" class="flex">  {{number_format($total_recharge_received,2)}}</div>
                                    <p class="mb-0"><strong> Recharge Recieved</strong></p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="page-separator">
                <div class="page-separator__text">Campaigns</div>
            </div>
            <!--  ####### Campaign table  ######   -->
            <div class="card dashboard-area-tabs" id="dashboard-area-tabs">
                <div class="card-header p-0 nav">
                    <div class="row no-gutters flex" role="tablist">
                        <div class="col camp_tab" data-target="ActiveCamp">
                            <a href="#ActiveCamp" data-toggle="tab" role="tab" aria-selected="true" class="dashboard-area-tabs__tab card-body text-center active">
                                <span class="font-weight-bold">Active</span>
                                <span class="h2 mb-0 mt-n1">{{$active_campaigns_count}}</span>
                            </a>
                        </div>
                        <div class="col border-left camp_tab" data-target="PendingCamp"   >
                            <a href="#PendingCamp" data-toggle="tab" role="tab" aria-selected="false" class="dashboard-area-tabs__tab card-body text-center">
                                <span class="font-weight-bold">Pending</span>
                                <span class="h2 mb-0 mt-n1">{{$pending_campaigns_count}}</span>
                            </a>
                        </div>
                        <div class="col border-left camp_tab"   data-target="DeclinedCamp" >
                            <a href="#DeclinedCamp" data-toggle="tab" role="tab" aria-selected="false" class="dashboard-area-tabs__tab card-body text-center">
                                <span class="font-weight-bold">Declined</span>
                                <span class="h2 mb-0 mt-n1">{{$declined_campaigns_count}}</span>
                            </a>
                        </div>
                        <div class="col border-left camp_tab"  data-target="CompletedCamp"   >
                            <a href="#CompletedCamp" data-toggle="tab" role="tab" aria-selected="false" class="dashboard-area-tabs__tab card-body text-center">
                                <span class="font-weight-bold">Completed</span>
                                <span class="h2 mb-0 mt-n1">{{$completed_campaigns_count}}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="card-body tab-content text-70">
                    <div class="tab-pane active" id="ActiveCamp">
                        <div  class="table-responsive" >
                            <table class="table mb-0 thead-border-top-0 table-nowrap" id="active_campaigns">
                                <thead>
                                <tr>
                                    <th style="width: 150px;">
                                        Project
                                    </th>
                                    <th>
                                        Sponsor
                                    </th> <th >
                                        Status
                                    </th><th >
                                        Amount
                                    </th><th >
                                        Due
                                    </th>
                                    <th style="width: 24px;"></th>
                                </tr>
                                </thead>
                                <tbody >
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane" id="PendingCamp">
                        <div class="table-responsive" >
                            <table class="table mb-0 thead-border-top-0 table-nowrap" id="pending_campaigns">
                                <thead>
                                <tr>
                                    <th style="width: 150px;">
                                        Project
                                    </th>
                                    <th>
                                        Sponsor
                                    </th> <th >
                                        Status
                                    </th><th >
                                        Amount
                                    </th><th >
                                        Due
                                    </th>
                                    <th style="width: 24px;"></th>
                                </tr>
                                </thead>
                                <tbody >
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane" id="DeclinedCamp">
                        <div class="table-responsive" >
                            <table class="table mb-0 thead-border-top-0 table-nowrap" id="declined_campaigns">
                                <thead>
                                <tr>
                                    <th style="width: 150px;">
                                        Project
                                    </th>
                                    <th>
                                        Sponsor
                                    </th> <th >
                                        Status
                                    </th><th >
                                        Amount
                                    </th><th >
                                        Due
                                    </th>
                                    <th style="width: 24px;"></th>
                                </tr>
                                </thead>
                                <tbody >
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane" id="CompletedCamp">
                        <div class="table-responsive" >
                            <table class="table mb-0 thead-border-top-0 table-nowrap" id="completed_campaigns">
                                <thead>
                                <tr>
                                    <th style="width: 150px;">
                                        Project
                                    </th>
                                    <th>
                                        Sponsor
                                    </th> <th >
                                        Status
                                    </th><th >
                                        Amount
                                    </th><th >
                                        Due
                                    </th>
                                    <th style="width: 24px;"></th>
                                </tr>
                                </thead>
                                <tbody >
                                </tbody>
                            </table>
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
        $("#active_campaigns").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            ajax: '{{ route('creator_active_campaigns') }}',
            columns: [
                {data: 'project', name: 'project'},
                {data: 'sponsor', name: 'sponsor'},
                {data: 'status', name: 'status'},
                {data: 'amount', name: 'amount'},
                {data: 'due', name: 'due',searchable:false},
                {data: 'actions', name: 'actions',searchable:false},
            ]
        });
        $( ".camp_tab" ).on( "click", function() {
            const tab_target = $(this).data('target');
            if (tab_target === 'PendingCamp'){
                $("#pending_campaigns").dataTable().fnDestroy();
                $("#pending_campaigns").DataTable({
                    serverSide: true,
                    processing: true,
                    ajax: '{{ route('creator_pending_campaigns') }}',
                    columns: [
                        {data: 'project', name: 'project'},
                        {data: 'sponsor', name: 'sponsor'},
                        {data: 'status', name: 'status'},
                        {data: 'amount', name: 'amount'},
                        {data: 'due', name: 'due',searchable:false},
                        {data: 'actions', name: 'actions',searchable:false},
                    ]
                });
            }
            else if(tab_target === 'DeclinedCamp'){
                $("#declined_campaigns").dataTable().fnDestroy();
                $("#declined_campaigns").DataTable({
                    serverSide: true,
                    processing: true,
                    responsive: true,
                    ajax: '{{ route('creator_declined_campaigns') }}',
                    columns: [
                        {data: 'project', name: 'project'},
                        {data: 'sponsor', name: 'sponsor'},
                        {data: 'status', name: 'status'},
                        {data: 'amount', name: 'amount'},
                        {data: 'due', name: 'due',searchable:false},
                        {data: 'actions', name: 'actions',searchable:false},
                    ]
                });
            }
            else if(tab_target === 'CompletedCamp'){
                $("#completed_campaigns").dataTable().fnDestroy();
                $("#completed_campaigns").DataTable({
                    serverSide: true,
                    processing: true,
                    responsive: true,
                    ajax: '{{ route('creator_completed_campaigns') }}',
                    columns: [
                        {data: 'project', name: 'project'},
                        {data: 'sponsor', name: 'sponsor'},
                        {data: 'status', name: 'status'},
                        {data: 'budget', name: 'budget'},
                        {data: 'end_date', name: 'end_date',searchable:false},
                        {data: 'actions', name: 'actions',searchable:false},
                    ]
                });
            }
            else if(tab_target === 'ActiveCamp'){
                $("#active_campaigns").dataTable().fnDestroy();
                $("#active_campaigns").DataTable({
                    serverSide: true,
                    processing: true,
                    responsive: true,
                    ajax: '{{ route('creator_active_campaigns') }}',
                    columns: [
                        {data: 'project', name: 'project'},
                        {data: 'sponsor', name: 'sponsor'},
                        {data: 'status', name: 'status'},
                        {data: 'amount', name: 'amount'},
                        {data: 'due', name: 'due',searchable:false},
                        {data: 'actions', name: 'actions',searchable:false},
                    ]
                });
            }
        });

        $( "#redeem_gems").click(function(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Are you sure ?',
                text: "You want to redeem your gem!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, redeem it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location = $("#redeem_gems").data('href');
                }
            })
        })
    </script>
@endpush

