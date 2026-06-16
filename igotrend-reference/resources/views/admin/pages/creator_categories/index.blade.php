@extends('admin.layout.dashboard')
@section('title','Creator Categories')
@section('page_title','Creator Categories')
@section('page_route','Creator Categories')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                @if(auth()->guard('admin')->user()->can('create creator category'))
                    <div class="card-header">
                        <div class="float-right">
                            <a type="button" class="btn btn-accent small" href="{{route('creator-category.create')}}">
                                <i class="material-icons icon--left">add</i> <small>Add Creator Category</small>
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
                            <th scope="col">Image</th>
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
            ajax: '{{ route('creator-categories') }}',
            columns: [
                {data: 'name', name: 'name'},
                {data: 'image', name: 'image'},
                {data: 'actions', name: 'actions'}
            ]
        });
    </script>
@endpush
