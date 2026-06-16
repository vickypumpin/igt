@extends('admin.layout.dashboard')
@section('title','Air Time Request')
@section('page_title','Air Time Requests')
@section('page_route','Air Time Request')
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
                            <th scope="col">Phone</th>
                            <th scope="col">Type</th>
                            <th scope="col">Status</th>
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
            ajax: '{{ route('air_time_requests') }}',
            columns: [
                {data: 'user_name', name: 'user_name'},
                {data: 'user_phone', name: 'user_phone'},
                {data: 'type', name: 'type'},
                {data: 'status', name: 'status'},
                {data: 'amount', name: 'amount'},
                {data: 'actions', name: 'actions'}
            ]
        });
    </script>
@endpush
