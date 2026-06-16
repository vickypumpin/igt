@extends('creators.layout.app')
@section('title','Payments')
@section('page_title','Payments History')
@section('page_route','Account / Payments History')
@section('content')
    <div class="container-fluid page__container">
        <div class="row">
            <div class="col-lg-9 pr-lg-0">
                <div class="page-section">
                    <div class="page-separator">
                        <div class="page-separator__text">Payment History</div>
                    </div>
                    <div class="card ">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-flush table-nowrap" id="payments">
                                    <thead>
                                    <tr>
                                        <th>Trans. Ref.</th>
                                        <th class="text-center">Amount</th>
                                        <th>Status</th>
                                        <th class="text-center"> Activity</th>
                                        <th>Date</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="page-separator">
                        <div class="page-separator__text">Rewards</div>
                    </div>
                    <div class="card ">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-flush table-nowrap" id="rewards">
                                    <thead>
                                    <tr>
                                        <th>From</th>
                                        <th >Type</th>
                                        <th >Status</th>
                                        <th>Reward</th>
                                        <th>Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div class="col-lg-3 page-nav">
                <div class="page-section pt-lg-112pt">
                    <nav class="nav page-nav__menu">
                        <a class="nav-link {{active_class('creator_billing')}}" href="{{route('creator_billing')}}">Payment Information</a>
                        <a class="nav-link {{active_class('creator_payment_history')}}" href="{{route('creator_payment_history')}}">Payment History</a>
                        <a class="nav-link {{active_class('creator_rate_info')}}" href="{{route('creator_rate_info')}}">Rate Review</a>
                    </nav>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $("#payments").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('creator_payment_history') }}',
            columns: [
                {data: 'tx_ref', name: 'tx_ref'},
                {data: 'amount', name: 'amount'},
                {data: 'status', name: 'status'},
                {data: 'activity', name: 'activity'},
                {data: 'created_at', name: 'created_at',searchable:false},
                {data: 'actions', name: 'actions',searchable:false},
            ]
        });
        $("#rewards").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('creator_reward_detail') }}',
            columns: [
                {data: 'from', name: 'from'},
                {data: 'type', name: 'type'},
                {data: 'status', name: 'status'},
                {data: 'amount', name: 'amount'},
                {data: 'created_at', name: 'created_at',searchable:false},
            ]
        });
    </script>
@endpush
