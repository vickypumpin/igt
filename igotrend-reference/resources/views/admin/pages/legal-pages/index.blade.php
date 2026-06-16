@extends('admin.layout.dashboard')
@section('title','Legal Pages')
@section('page_title','Legal Pages')
@section('page_route','Legal Pages')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                @if(auth()->guard('admin')->user()->can('create legal page'))
                    <div class="card-header">
                        <div class="float-right">
                            <a type="button" class="btn btn-accent small" href="{{route('legal-page.create')}}">
                                <i class="material-icons icon--left">add</i> <small>Add Legal Page</small>
                            </a>
                        </div>
                    </div>
                @endif
                <div class="card-body">
                    <div class="float-right"></div>
                    <table id="staffData" class="table-striped table table-borderless">
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
        $("#staffData").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('legal-pages') }}',
            columns: [
                {data: 'name', name: 'name'},
                {data: 'actions', name: 'actions'}
            ]
        });
    </script>
@endpush
