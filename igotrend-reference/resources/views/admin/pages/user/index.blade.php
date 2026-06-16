
@extends('admin.layout.dashboard')
@section('title','Users')
@section('page_title','Users')
@section('page_route','Users')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="page-separator">
                <div class="page-separator__text">Overview</div>
            </div>
            <div class="row card-group-row mb-lg-8pt">
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Active </strong>
                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($active_users,2,',','.')}}</span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Pending </strong>

                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($pending_users,2,',','.')}}</span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">insert_invitation</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Locked</strong>
                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($locked_users,2,',','.')}}</span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">lock_outline</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-separator">
                <div class="page-separator__text">Brands / Advertisers Mgt</div>
            </div>
            <div class="card mb-32pt">
                <div class="card-body">
                    <table id="brandUsersData" class="table-striped table table-borderless ">
                        <thead>
                        <tr>
                            <th scope="col">Pin</th>
                            <th scope="col">Photo</th>
                            <th scope="col">User Name</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Role</th>
                            <th scope="col">Status</th>
                            <th scope="col">Locked Status</th>
                            <th scope="col">Company Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Company Type</th>
                            <th scope="col">Company Size</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Country</th>
                            <th scope="col">State</th>
                            <th scope="col">Created</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="page-separator">
                <div class="page-separator__text">Content Creators / Influencers Mgt</div>
            </div>
            <div class="card mb-32pt">
                <div class="card-body">
                    <table id="creatorUsersData" class="table-striped table table-borderless ">
                        <thead>
                        <tr>
                            <th scope="col">Pin</th>
                            <th scope="col">Photo</th>
                            <th scope="col">User Name</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Status</th>
                            <th scope="col">Locked Status</th>
                            <th scope="col">Email</th>
                            <th scope="col">Content Category</th>
                            <th scope="col">Creator Category</th>
                            <th scope="col">Dob</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Role</th>
                            <th scope="col">Country</th>
                            <th scope="col">State</th>
                            <th scope="col">Bank Name</th>
                            <th scope="col">Account Number</th>
                            <th scope="col">Facebook</th>
                            <th scope="col">Instagram</th>
                            <th scope="col">Snapchat</th>
                            <th scope="col">Twitter</th>
                            <th scope="col">Youtube</th>
                            <th scope="col">TikTok</th>
                            <th scope="col">Gems</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Created</th>
                            <th scope="col">Creator Price</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="page-separator">
                <div class="page-separator__text">Trashed users</div>
            </div>
            <div class="card mb-32pt">
                <div class="card-body">
                    <table id="trashedUsersData" class="table-striped table table-borderless ">
                        <thead>
                        <tr>
                            <th scope="col">User Name</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Role</th>
                            <th scope="col">Country</th>
                            <th scope="col">State</th>
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
@push('modal')
    <!-- Modal -->
    <div class="modal fade" id="user_info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Inf0</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="user_info_modal_body">

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="facebook_info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Facebook Info</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="facebook_info_form">
                        @csrf
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="facebook_followers">Facebook Followers</label>
                                    <input type="text" class="form-control" name="facebook_followers" id="facebook_followers" placeholder="facebook followers">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="facebook_post">Facebook Post</label>
                                    <input type="text" class="form-control" name="facebook_post" id="facebook_post" placeholder="facebook post">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="facebook_story">Facebook Story</label>
                                    <input type="text" class="form-control" name="facebook_story" id="facebook_story" placeholder="facebook story">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="facebook_friends">Facebook Friends</label>
                                    <input type="text" class="form-control" name="facebook_friends" id="facebook_friends" placeholder="facebook friends">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="facebook_like_percentage">Likes Percentage</label>
                                    <input type="text" class="form-control" name="facebook_like_percentage" id="facebook_like_percentage" placeholder="like percentage">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="instagram_info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Instagram Info</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="instagram_info_form">
                        @csrf
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="instagram_followers">Instagram Followers</label>
                                    <input type="text" class="form-control" name="instagram_followers" id="instagram_followers" placeholder="instagram followers">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="instagram_post">Instagram Post</label>
                                    <input type="text" class="form-control" name="instagram_post" id="instagram_post" placeholder="instagram post">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="instagram_story">Instagram Story</label>
                                    <input type="text" class="form-control" name="instagram_story" id="instagram_story" placeholder="instagram story">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="instagram_friends">Instagram Friends</label>
                                    <input type="text" class="form-control" name="instagram_friends" id="instagram_friends" placeholder="instagram friends">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="instagram_like_percentage">Likes Percentage</label>
                                    <input type="text" class="form-control" name="instagram_like_percentage" id="instagram_like_percentage" placeholder="like percentage">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="snapchat_info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Snapchat Info</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post"  id="snapchat_info_form" >
                        @csrf
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="snapchat_followers">Snapchat Followers</label>
                                    <input type="text" class="form-control" name="snapchat_followers" id="snapchat_followers" placeholder="snapchat followers">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="snapchat_post">Snapchat Post</label>
                                    <input type="text" class="form-control" name="snapchat_post" id="snapchat_post" placeholder="snapchat post">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="snapchat_story">Snapchat Story</label>
                                    <input type="text" class="form-control" name="snapchat_story" id="snapchat_story" placeholder="snapchat story">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="snapchat_friends">Snapchat Friends</label>
                                    <input type="text" class="form-control" name="snapchat_friends" id="snapchat_friends" placeholder="snapchat friends">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="snapchat_like_percentage">Likes Percentage</label>
                                    <input type="text" class="form-control" name="snapchat_like_percentage" id="snapchat_like_percentage" placeholder="like percentage">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="twitter_info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Twitter Info</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="twitter_info_form">
                        @csrf
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="twitter_followers">Twitter Followers</label>
                                    <input type="text" class="form-control" name="twitter_followers" id="twitter_followers" placeholder="twitter followers">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="twitter_post">Twitter Post</label>
                                    <input type="text" class="form-control" name="twitter_post" id="twitter_post" placeholder="twitter post">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="twitter_friends">Twitter Friends</label>
                                    <input type="text" class="form-control" name="twitter_friends" id="twitter_friends" placeholder="twitter friends">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="twitter_like_percentage">Likes Percentage</label>
                                    <input type="text" class="form-control" name="twitter_like_percentage" id="twitter_like_percentage" placeholder="like percentage">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="youtube_info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Youtube Info</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="youtube_info_form" >
                        @csrf
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="youtube_followers">Youtube Followers</label>
                                    <input type="text" class="form-control" name="youtube_followers" id="youtube_followers" placeholder="youtube followers">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="youtube_post">Youtube Post</label>
                                    <input type="text" class="form-control" name="youtube_post" id="youtube_post" placeholder="youtube post">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="youtube_friends">Youtube Friends</label>
                                    <input type="text" class="form-control" name="youtube_friends" id="youtube_friends" placeholder="youtube friends">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="youtube_like_percentage">Likes Percentage</label>
                                    <input type="text" class="form-control" name="youtube_like_percentage" id="youtube_like_percentage" placeholder="like percentage">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="tiktok_info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update TikTok Info</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="tiktok_info_form">
                        @csrf
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="tiktok_followers">TikTok Followers</label>
                                    <input type="text" class="form-control" name="tiktok_followers" id="tiktok_followers" placeholder="tiktok followers">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="tiktok_post">TikTok Post</label>
                                    <input type="text" class="form-control" name="tiktok_post" id="tiktok_post" placeholder="tiktok post">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="tiktok_friends">TikTok Friends</label>
                                    <input type="text" class="form-control" name="tiktok_friends" id="tiktok_friends" placeholder="tiktok friends">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="tiktok_like_percentage">Likes Percentage</label>
                                    <input type="text" class="form-control" name="tiktok_like_percentage" id="tiktok_like_percentage" placeholder="like percentage">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endpush
@push("page-scripts")
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $("#brandUsersData").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            scrollX: true,
            ajax: '{{ route('brandUsers') }}',
            columns: [
                {data: 'pin', name: 'pin'},
                {data: 'photo', name: 'photo'},
                {data: 'user_name', name: 'user_name'},
                {data: 'first_name', name: 'first_name'},
                {data: 'last_name', name: 'last_name'},
                {data: 'gender', name: 'gender',searchable:false},
                {data: 'role', name: 'role'},
                {data: 'status', name: 'status'},
                {data: 'locked_status', name: 'locked_status'},
                {data: 'company_name', name: 'company_name'},
                {data: 'email', name: 'email'},
                {data: 'company_type_name', name: 'companyType.name'},
                {data: 'company_size', name: 'company_size'},
                {data: 'phone', name: 'phone'},
                {data: 'country_name', name: 'country.name'},
                {data: 'state_name', name: 'state.name'},
                {data: 'created_at', name: 'created_at'},
                {data: 'actions', name: 'actions'}
            ]
        });
        $("#creatorUsersData").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            scrollX: true,
            ajax: '{{ route('creatorUsers') }}',
            columns: [
                {data: 'pin', name: 'pin'},
                {data: 'photo', name: 'photo'},
                {data: 'user_name', name: 'user_name'},
                {data: 'first_name', name: 'first_name'},
                {data: 'last_name', name: 'last_name'},
                {data: 'gender', name: 'gender',searchable:false},
                {data: 'status', name: 'status'},
                {data: 'locked_status', name: 'locked_status'},
                {data: 'email', name: 'email'},
                {data: 'content_categories_name', name: 'content_categories_name'},
                {data: 'creator_categories_name', name: 'creator_categories_name'},
                {data: 'dob', name: 'dob'},
                {data: 'phone', name: 'phone'},
                {data: 'role', name: 'role'},
                {data: 'country_name', name: 'country.name'},
                {data: 'state_name', name: 'state.name'},
                {data: 'bank_name', name: 'bank_name'},
                {data: 'account_number', name: 'account_number'},
                {data: 'facebook_profile', name: 'facebook_profile'},
                {data: 'instagram_profile', name: 'instagram_profile'},
                {data: 'snapchat_profile', name: 'snapchat_profile'},
                {data: 'twitter_profile', name: 'twitter_profile'},
                {data: 'youtube_profile', name: 'youtube_profile'},
                {data: 'tiktok_profile', name: 'tiktok_profile'},
                {data: 'gems', name: 'gems'},
                {data: 'balance', name: 'balance'},
                {data: 'created_at', name: 'created_at'},
                {data: 'content_creator_rate', name: 'content_creator_rate'},
                {data: 'actions', name: 'actions'}
            ]
        });
        $("#trashedUsersData").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('trashedUsers') }}',
            columns: [
                {data: 'user_name', name: 'user_name'},
                {data: 'first_name', name: 'first_name'},
                {data: 'last_name', name: 'last_name'},
                {data: 'email', name: 'email'},
                {data: 'phone', name: 'phone'},
                {data: 'role', name: 'role'},
                {data: 'country_name', name: 'country.name'},
                {data: 'state_name', name: 'state.name'},
                {data: 'actions', name: 'actions'}
            ]
        });
        $(document).on("click",".user_update_info",function(e) {
            e.preventDefault();
            const path = $(this).attr("data-url");
            $.ajax({
                url: path,
                type: "GET",
                success: function (data) {
                    $('#user_info_modal_body').html(data.body)
                    $('#user_info_modal').modal('show');
                }
            });
        });
        $(document).on("click",".facebook_profile",function(e) {
            e.preventDefault();
            const path = $(this).attr("data-url");
            $.ajax({
                url: path,
                type: "GET",
                success: function (data) {
                    $('#facebook_followers').val(data.user.facebook_followers);
                    $('#facebook_post').val(data.user.facebook_post);
                    $('#facebook_story').val(data.user.facebook_story);
                    $('#facebook_friends').val(data.user.facebook_friends);
                    $('#facebook_like_percentage').val(data.user.facebook_like_percentage);
                }
            });
            $('#facebook_info_modal').modal('show');
            const update_url = $(this).data('update-url');
            $('#facebook_info_form').attr('action', update_url);
        });
        $(document).on("click",".instagram_profile",function(e) {
            e.preventDefault();
            $('#instagram_info_modal').modal('show');
            const update_url = $(this).data('update-url');
            $('#instagram_info_form').attr('action', update_url);
            const path = $(this).attr("data-url");
            $.ajax({
                url: path,
                type: "GET",
                success: function (data) {
                    $('#instagram_followers').val(data.user.instagram_followers);
                    $('#instagram_post').val(data.user.instagram_post);
                    $('#instagram_story').val(data.user.instagram_story);
                    $('#instagram_friends').val(data.user.instagram_friends);
                    $('#instagram_like_percentage').val(data.user.instagram_like_percentage);
                }
            });

        });
        $(document).on("click",".snapchat_profile",function(e) {
            e.preventDefault();
            const path = $(this).attr("data-url");
            $.ajax({
                url: path,
                type: "GET",
                success: function (data) {
                    $('#snapchat_followers').val(data.user.snapchat_followers);
                    $('#snapchat_post').val(data.user.snapchat_post);
                    $('#snapchat_story').val(data.user.snapchat_story);
                    $('#snapchat_friends').val(data.user.snapchat_friends);
                    $('#snapchat_like_percentage').val(data.user.snapchat_like_percentage);
                }
            });
            $('#snapchat_info_modal').modal('show');
            const update_url = $(this).data('update-url');
            $('#snapchat_info_form').attr('action', update_url);
        });
        $(document).on("click",".twitter_profile",function(e) {
            e.preventDefault();
            $('#twitter_info_modal').modal('show');
            const update_url = $(this).data('update-url');
            $('#twitter_info_form').attr('action', update_url);
            const path = $(this).attr("data-url");
            $.ajax({
                url: path,
                type: "GET",
                success: function (data) {
                    $('#twitter_followers').val(data.user.twitter_followers);
                    $('#twitter_post').val(data.user.twitter_post);
                    $('#twitter_friends').val(data.user.twitter_friends);
                    $('#twitter_like_percentage').val(data.user.twitter_like_percentage);
                }
            });

        });
        $(document).on("click",".youtube_profile",function(e) {
            e.preventDefault();
            $('#youtube_info_modal').modal('show');
            const update_url = $(this).data('update-url');
            $('#youtube_info_form').attr('action', update_url);
            const path = $(this).attr("data-url");
            $.ajax({
                url: path,
                type: "GET",
                success: function (data) {
                    $('#youtube_followers').val(data.user.youtube_followers);
                    $('#youtube_post').val(data.user.youtube_post);
                    $('#youtube_friends').val(data.user.youtube_friends);
                    $('#youtube_like_percentage').val(data.user.youtube_like_percentage);
                }
            });

        });
        $(document).on("click",".tiktok_profile",function(e) {
            e.preventDefault();
            $('#tiktok_info_modal').modal('show');
            const update_url = $(this).data('update-url');
            $('#tiktok_info_form').attr('action', update_url);
            const path = $(this).attr("data-url");
            $.ajax({
                url: path,
                type: "GET",
                success: function (data) {
                    $('#tiktok_followers').val(data.user.tiktok_followers);
                    $('#tiktok_post').val(data.user.tiktok_post);
                    $('#tiktok_friends').val(data.user.tiktok_friends);
                    $('#tiktok_like_percentage').val(data.user.tiktok_like_percentage);
                }
            });
        });
    </script>

@endpush
