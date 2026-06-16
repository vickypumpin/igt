@extends('admin.layout.dashboard')
@section('title','Permissions')
@section('route','Roles & Permission / Permissions')
{{-- Content --}}
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <div class="card-title ">

                    </div>
                    <div class="float-right"></div>
                    <table id="permission_data" class="table-striped table table-borderless">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
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
        $("#permission_data").DataTable({
            serverSide: true,
            processing: true,
            scrollY: '300px',
            ajax: '{{ route('permissions') }}',
            columns: [
                {data: 'name', name: 'name'}
            ]
        });
    </script>
@endPush
