@extends('admin.layout.dashboard')
@section('title','Roles')
@section('page_title','Roles')
@section('page_route','Roles')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card mb-32pt card-table" >
                @if(auth()->guard('admin')->user()->can('create staff'))
                    <div class="card-header">
                        <div class="float-right">
                            <a type="button" class="btn btn-accent small" href="{{route('roleCreate')}}">
                                <i class="material-icons icon--left">add</i> <small>Add Role</small>
                            </a>
                        </div>
                    </div>
                @endif
                <table class="table mb-0 thead-border-top-0 table-nowrap w-100" id="roles" >
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody >

                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection
@push("page-scripts")
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $("#roles").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('roles') }}',
            columns: [
                {data: 'name', name: 'name'},
                {data: 'action', name: 'action'}
            ]
        });
    </script>
@endpush
