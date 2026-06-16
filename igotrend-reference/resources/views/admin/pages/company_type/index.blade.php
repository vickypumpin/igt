@extends('admin.layout.dashboard')
@section('title','Company Types')
@section('page_title','Company Types')
@section('page_route','Company Types')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                @if(auth()->guard('admin')->user()->can('create company type'))
                    <div class="card-header">
                        <div class="float-right">
                            <a type="button" class="btn btn-accent small" href="{{route('company-type.create')}}">
                                <i class="material-icons icon--left">add</i> <small>Add Company Type</small>
                            </a>
                        </div>
                    </div>
                @endif
                <div class="card-body">
                    <div class="float-right"></div>
                    <table id="companyData" class="table-striped table table-borderless">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
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
        $("#companyData").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('company-types') }}',
            columns: [
                {data: 'name', name: 'name'},
                {data: 'actions', name: 'actions'}
            ]
        });
    </script>
@endpush
