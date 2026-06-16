@extends('admin.layout.dashboard')
@section('title','Verify Request')
@section('page_title','Verify Requests')
@section('page_route','Verify Request')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <div class="float-right"></div>
                    <table id="staffData" class="table-striped table table-borderless">
                        <thead>
                        <tr>
                            <th scope="col">User Name</th>
                            <th scope="col">Bank Name</th>
                            <th scope="col">Account Number</th>
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
            ajax: '{{ route('verify_requests') }}',
            columns: [
                {data: 'user_name', name: 'user_name'},
                {data: 'bank_name', name: 'bank_name'},
                {data: 'account_number', name: 'account_number'},
                {data: 'actions', name: 'actions'}
            ]
        });
    </script>
@endpush
