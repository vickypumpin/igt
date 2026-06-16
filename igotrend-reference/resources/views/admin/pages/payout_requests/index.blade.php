@extends('admin.layout.dashboard')
@section('title','Payout Request')
@section('page_title','Payout Requests')
@section('page_route','Payout Request')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Submission Requests</div>
                </div>
                <div class="card-body">
                    <div class="float-right"></div>
                    <table id="staffData" class="table-striped table table-borderless">
                        <thead>
                        <tr>
                            <th scope="col">User Name</th>
                            <th scope="col">Bank Name</th>
                            <th scope="col">Account Number</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Redeem Gem Requests</div>
                </div>
                <div class="card-body">
                    <div class="float-right"></div>
                    <table id="redeem_gem_requests" class="table-striped table table-borderless">
                        <thead>
                        <tr>
                            <th scope="col">User Name</th>
                            <th scope="col">Bank Name</th>
                            <th scope="col">Account Number</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
@push("page-scripts")
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $("#staffData").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('payout_requests') }}',
            columns: [
                {data: 'user_name', name: 'user_name'},
                {data: 'bank_name', name: 'bank_name'},
                {data: 'account_number', name: 'user.account_number'},
                {data: 'amount', name: 'amount'},
                {data: 'actions', name: 'actions'}
            ]
        });
        $("#redeem_gem_requests").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('admin_gem_payout_requests') }}',
            columns: [
                {data: 'user_name', name: 'user_name'},
                {data: 'bank_name', name: 'bank_name'},
                {data: 'account_number', name: 'user.account_number'},
                {data: 'total_amount', name: 'total_amount'},
                {data: 'actions', name: 'actions'}
            ]
        });
    </script>
@endpush
