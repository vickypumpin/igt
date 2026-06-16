@extends('admin.layout.dashboard')
@section('title','Account Request')
@section('page_title','Account Requests')
@section('page_route','Account Request')
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
                            <th scope="col">Facebook Profile</th>
                            <th scope="col">Instagram Profile</th>
                            <th scope="col">Twitter Profile</th>
                            <th scope="col">Youtube Profile</th>
                            <th scope="col">TikTok Profile</th>
                            <th scope="col">Snapchat Profile</th>
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
            ajax: '{{ route('account_verify_requests') }}',
            columns: [
                {data: 'user_name', name: 'user_name'},
                {data: 'facebook_profile', name: 'facebook_profile'},
                {data: 'instagram_profile', name: 'instagram_profile'},
                {data: 'twitter_profile', name: 'twitter_profile'},
                {data: 'youtube_profile', name: 'youtube_profile'},
                {data: 'tiktok_profile', name: 'tiktok_profile'},
                {data: 'snapchat_profile', name: 'snapchat_profile'},
                {data: 'actions', name: 'actions'}
            ]
        });
    </script>
@endpush
