
@extends('admin.layout.dashboard')
@section('title','Chat Logs')
@section('page_title','Chat Logs')
@section('page_route','Messaging / Chat Logs')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="page-separator">
                <div class="page-separator__text">Explore Chat</div>
            </div>
            <div class="card mb-32pt">
                <div class="card-body">
                    <form method="get" action="{{route('explore_chat')}}">
                        <div class="row">
                            <div class="col-12 col-md-5">
                                <div class="form-group">
                                    <label for="from">From</label>
                                    <select class="form-control" id="from" name="from" required>
                                        <option value="">select from user</option>
                                        @foreach($users as $user)
                                            <option value="{{$user->id}}">{{$user->first_name.' '.$user->last_name}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-md-5">
                                <div class="form-group">
                                    <label for="to">To</label>
                                    <select class="form-control" id="to" name="to" required >
                                        <option value="">select to user</option>
                                        @foreach($users as $user)
                                            <option value="{{$user->id}}">{{$user->first_name.' '.$user->last_name}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-md-2" style="margin-top: 35px">
                                <button class="btn btn-primary btn-sm" >Explore Chat</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="page-separator">
                <div class="page-separator__text">Users Messages</div>
            </div>
            <div class="card mb-32pt">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <div class="form-group">
                                <label for="from_user">From</label>
                                <select class="form-control" id="from_user">
                                    <option value="">select from user</option>
                                    @foreach($users as $user)
                                        <option value="{{$user->id}}">{{$user->first_name.' '.$user->last_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="form-group">
                                <label for="to_user">To</label>
                                <select class="form-control" id="to_user" >
                                    <option value="">select to user</option>
                                    @foreach($users as $user)
                                        <option value="{{$user->id}}">{{$user->first_name.' '.$user->last_name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    <table id="user_messages" class="table-striped table table-borderless ">
                        <thead>
                        <tr>
                            <th scope="col">From </th>
                            <th scope="col">To </th>
                            <th scope="col">Message</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="page-separator">
                <div class="page-separator__text">Admin & Users Chat</div>
            </div>
            <div class="card mb-32pt">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <div class="form-group">
                                <label for="from_user">From</label>
                                <select class="form-control" id="from_admin_user">
                                    <option value="">select from user</option>
                                    @foreach($from_users_array as $from_user)
                                        <option value="{{$from_user['id']}}">{{$from_user['name']}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="form-group">
                                <label for="to_user">To</label>
                                <select class="form-control" id="to_admin_user" >
                                    <option value="">select to user</option>
                                    @foreach($to_users_array as $to_user)
                                        <option value="{{$to_user['id']}}">{{$to_user['name']}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    <table id="admin_users_messages" class="table-striped table table-borderless ">
                        <thead>
                        <tr>
                            <th scope="col">From User</th>
                            <th scope="col">To User</th>
                            <th scope="col">Message</th>
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
        const user_messages =   $("#user_messages").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            'ajax': {
                url: "{{route('get_user_messages')}}",
                data: function (d) {
                    d.from = $('#from_user :selected').val();
                    d.to = $('#to_user :selected').val();
                }
            },
            columns: [
                {data: 'from', name: 'from.first_name'},
                {data: 'to', name: 'to.first_name'},
                {data: 'message', name: 'message'},
            ]
        });
        const admin_messages =   $("#admin_users_messages").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            'ajax': {
                url: "{{route('get_admin_users_messages')}}",
                data: function (d) {
                    d.from = $('#from_admin_user :selected').val();
                    d.to = $('#to_admin_user :selected').val();
                }
            },
            columns: [
                {data: 'from', name: 'from'},
                {data: 'to', name: 'to'},
                {data: 'message', name: 'message'},
            ]
        });
        $(document).on("change","#from_user",function(e) {
            e.preventDefault();

        });
        $( "#from_user" ).change(function() {
            $('#from_user').find(":selected").val();
            user_messages.ajax.reload();

        });
        $( "#to_user" ).change(function() {
            $('#to_user').find(":selected").val();
            user_messages.ajax.reload();
        });
        $( "#from_admin_user" ).change(function() {
            $('#from_admin_user').find(":selected").val();
            admin_messages.ajax.reload();

        });
        $( "#to_admin_user" ).change(function() {
            $('#to_admin_user').find(":selected").val();
            admin_messages.ajax.reload();
        });
    </script>
@endpush
