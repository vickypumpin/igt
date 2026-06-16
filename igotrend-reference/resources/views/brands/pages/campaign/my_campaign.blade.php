@extends('brands.layout.app')
@section('title','My Campaigns')
@section('page_title','My Campaigns')
@section('page_route','Campaigns / Overview')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="page-separator">
                <div class="page-separator__text">Overview</div>
            </div>

            <div class="row card-group-row mb-lg-8pt">
                <div class="col-lg-4 col-sm-6 card-group-row__col">

                    <div class="card card-group-row__card text-center o-hidden card--raised ">

                        <span class="corner-ribbon corner-ribbon--default-right-top corner-ribbon--shadow bg-danger text-white" style="position:absolute; z-index: 1;">Create</span>

                        <div class="card-body d-flex flex-column">
                            <div class="flex-grow mb-16pt">
                                <a href="#" class="d-block mb-16pt"><img src="{{asset('images/inflimg.png')}}" alt="" style="height: 154px;" class="card-img card-img-cover"></a>
                            </div>
                            <p class="d-flex justify-content-center align-items-center m-0">
                                <span class="h4 m-0 font-weight-normal">Create &nbsp;</span>
                                <span class="h4 m-0 font-weight-normal">Campaign</span>
                            </p>
                        </div>
                        <div class="card-footer">
                            <a href="{{route('create_campaign')}}">
                                <button type="button" class="btn btn-accent">
                                    <i class="material-icons icon--left">launch</i> Get Started
                                </button>
                            </a>
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
                            <a href="{{route('brand_reward_contacts')}}">
                                <button type="button" class="btn btn-warning">
                                    <i class="material-icons icon--left">launch</i> Get Started
                                </button>
                            </a>
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
                        <div class="col camp_tab" data-target="ActiveCamp" >
                            <a href="#ActiveCamp" data-toggle="tab" role="tab" aria-selected="true" class="dashboard-area-tabs__tab card-body text-center active">
                                <span class="font-weight-bold">Active</span>
                                <span class="h2 mb-0 mt-n1">{{$active_campaigns}}</span>
                            </a>
                        </div>
                        <div class="col border-left camp_tab"  data-target="PendingCamp" >
                            <a href="#PendingCamp" data-toggle="tab" role="tab" aria-selected="false" class="dashboard-area-tabs__tab card-body text-center">
                                <span class="font-weight-bold">Pending</span>
                                <span class="h2 mb-0 mt-n1">{{$pending_campaigns}}</span>
                            </a>
                        </div>
                        <div class="col border-left camp_tab"  data-target="DeclinedCamp" >
                            <a href="#DeclinedCamp" data-toggle="tab" role="tab" aria-selected="false" class="dashboard-area-tabs__tab card-body text-center">
                                <span class="font-weight-bold">Declined</span>
                                <span class="h2 mb-0 mt-n1">{{$decline_campaigns}}</span>
                            </a>
                        </div>
                        <div class="col border-left camp_tab"  data-target="CompletedCamp" >
                            <a href="#CompletedCamp" data-toggle="tab" role="tab" aria-selected="false" class="dashboard-area-tabs__tab card-body text-center">
                                <span class="font-weight-bold">Completed</span>
                                <span class="h2 mb-0 mt-n1">{{$completed_campaigns}}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="card-body tab-content text-70">
                    <div class="tab-pane active" id="ActiveCamp">
                        <table class="table mb-0 thead-border-top-0 table-nowrap table-hover" id="active_projects">
                            <thead>
                            <tr>
                                <th style="width: 150px;">
                                    Project
                                </th>
                                <th>
                                    Sponsor
                                </th>
                                <th >
                                    Status
                                </th>
                                <th >
                                    Budget
                                </th>
                                <th >
                                    End Date
                                </th>
                                <th>

                                </th>
                            </tr>
                            </thead>
                            <tbody class="list" >
                            </tbody>
                        </table>
                    </div>
                    <div class="tab-pane" id="PendingCamp">
                        <table class="table mb-0 thead-border-top-0 table-nowrap table-hover" id="pending_projects">
                            <thead>
                            <tr>
                                <th style="width: 150px;">
                                    Project
                                </th>
                                <th>
                                    Sponsor
                                </th>
                                <th >
                                    Status
                                </th>
                                <th >
                                    Budget
                                </th>
                                <th >
                                    End Date
                                </th>
                                <th>

                                </th>
                            </tr>
                            </thead>
                            <tbody class="list" >
                            </tbody>
                        </table>
                    </div>
                    <div class="tab-pane" id="DeclinedCamp">
                        <table class="table mb-0 thead-border-top-0 table-nowrap table-hover" id="declined_projects">
                            <thead>
                            <tr>
                                <th style="width: 150px;">
                                    Project
                                </th>
                                <th>
                                    Sponsor
                                </th>
                                <th >
                                    Status
                                </th>
                                <th >
                                    Budget
                                </th>
                                <th >
                                    End Date
                                </th>
                                <th>

                                </th>
                            </tr>
                            </thead>
                            <tbody class="list" >

                            </tbody>
                        </table>
                    </div>
                    <div class="tab-pane" id="CompletedCamp">
                        <table class="table mb-0 thead-border-top-0 table-nowrap table-hover" id="completed_campaigns">
                            <thead>
                            <tr>
                                <th style="width: 150px;">
                                    Project
                                </th>
                                <th>
                                    Sponsor
                                </th>
                                <th >
                                    Status
                                </th>
                                <th >
                                    Budget
                                </th>
                                <th >
                                    End Date
                                </th>
                                <th>

                                </th>
                            </tr>
                            </thead>
                            <tbody class="list" >

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $("#active_projects").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            ajax: '{{ route('brand_active_campaigns') }}',
            columns: [
                {data: 'project', name: 'project'},
                {data: 'sponsor', name: 'sponsor'},
                {data: 'status', name: 'status'},
                {data: 'budget', name: 'budget'},
                {data: 'end_date', name: 'end_date',searchable:false},
                {data: 'actions', name: 'actions',searchable:false},
            ]
        });

        $( ".camp_tab" ).on( "click", function() {
            const tab_target = $(this).data('target');
            if (tab_target === 'PendingCamp'){
                $("#pending_projects").dataTable().fnDestroy();
                $("#pending_projects").DataTable({
                    serverSide: true,
                    processing: true,
                    // responsive: true,
                    // scrollX: true,
                    ajax: '{{ route('brand_pending_campaigns') }}',
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
            else if(tab_target === 'DeclinedCamp'){
                $("#declined_projects").dataTable().fnDestroy();
                $("#declined_projects").DataTable({
                    serverSide: true,
                    processing: true,
                    responsive: true,
                    // scrollX: true,
                    ajax: '{{ route('brand_declined_campaigns') }}',
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
            else if(tab_target === 'CompletedCamp'){
                $("#completed_campaigns").dataTable().fnDestroy();
                $("#completed_campaigns").DataTable({
                    serverSide: true,
                    processing: true,
                    responsive: true,
                    // scrollX: true,
                    ajax: '{{ route('brand_completed_campaigns') }}',
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
                $("#active_projects").dataTable().fnDestroy();
                $("#active_projects").DataTable({
                    serverSide: true,
                    processing: true,
                    responsive: true,
                    ajax: '{{ route('brand_active_campaigns') }}',
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
        });

        $('#active_projects tbody').on('click', 'tr', function() {
            window.location = this.id;
        });

        $('#pending_projects tbody').on('click', 'tr', function() {
            window.location = this.id;
        });

        $('#declined_projects tbody').on('click', 'tr', function() {
            window.location = this.id;
        });

        $('#completed_campaigns tbody').on('click', 'tr', function() {
            window.location = this.id;
        });
    </script>
@endpush
