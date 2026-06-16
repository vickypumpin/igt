@extends('admin.layout.dashboard')
@section('title','Payments')
@section('page_title','Payments')
@section('page_route','Setting / Payments')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="page-separator">
                <div class="page-separator__text">Transactions</div>
            </div>

            <div class="row card-group-row mb-lg-8pt">
                <div class="col-lg-6 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Successful </strong>
                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($success_full_payments,3)}}</span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">check_circle</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar bg-accent" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 card-group-row__col">
                    <div class="card card-group-row__card">
                        <div class="card-body d-flex flex-row align-items-center">
                            <div class="flex">
                                <p class="d-flex align-items-center mb-0">
                                    <strong>Pending </strong>

                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>
                                </p>
                                <span class="h2 m-0">{{number_format($pending_payments,3)}}</span>
                            </div>
                            <i class="material-icons icon-32pt text-20 ml-8pt">insert_invitation</i>
                        </div>
                        <div class="progress" style="height: 3px;">
                            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                {{--                <div class="col-lg-4 col-md-6 card-group-row__col">--}}
                {{--                    <div class="card card-group-row__card">--}}
                {{--                        <div class="card-body d-flex flex-row align-items-center">--}}
                {{--                            <div class="flex">--}}
                {{--                                <p class="d-flex align-items-center mb-0">--}}
                {{--                                    <strong>Failed</strong>--}}
                {{--                                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>--}}
                {{--                                </p>--}}
                {{--                                <span class="h2 m-0">6,000</span>--}}
                {{--                            </div>--}}
                {{--                            <i class="material-icons icon-32pt text-20 ml-8pt">cancel</i>--}}
                {{--                        </div>--}}
                {{--                        <div class="progress" style="height: 3px;">--}}
                {{--                            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>--}}
                {{--                        </div>--}}
                {{--                    </div>--}}
                {{--                </div>--}}
            </div>



            <!-- ############## payment list ############### -->
            <div class="page-separator">
                <div class="page-separator__text">Brands/ Advertisers Payments</div>
            </div>

            <div class="card mb-32pt">
                <div class="card-body">
                    <table class="table " id="brand_payments">
                        <thead>
                        <tr>
                            <th > Name / Campaign </th>
                            <th > User Name </th>
                            <th >
                                Trans.Ref
                            </th>
                            <th >
                                Amount
                            </th>
                            <th >
                                Charges
                            </th>
                            <th >
                                Status
                            </th>
                            <th >
                                Created
                            </th>
                            <th ></th>
                        </tr>
                        </thead>
                        <tbody  >
                        </tbody>
                    </table>
                </div>

            </div>

            <div class="page-separator">
                <div class="page-separator__text">Gems Payments</div>
            </div>

            <div class="card mb-32pt">
                <div class="card-body">
                    <table class="table " id="gem_payments">
                        <thead>
                        <tr>
                            <th > Trender Name  </th>
                            <th >
                                Trans.Ref
                            </th>
                            <th >
                                Amount
                            </th>
                            <th >
                                Charges
                            </th>
                            <th >
                                Status
                            </th>
                            <th >
                                Created
                            </th>
                        </tr>
                        </thead>
                        <tbody  >
                        </tbody>
                    </table>
                </div>

            </div>



            <div class="page-separator">
                <div class="page-separator__text">Influencers / Creators Payments</div>
            </div>

            <div class="card mb-32pt">
                <div class="card-header">
                    <form class="form-inline">
                        <label class="sr-only" for="inlineFormRole">Role</label>
                        <select id="users_role" class="custom-select mb-2 mr-sm-2 mb-sm-0">
                            <option value="all">All Roles</option>
                            <option value="influencers">Influencers</option>
                            <option value="content_creators">Content Creators</option>
                        </select>
                    </form>
                </div>
                <div class="card-body">
                    <table class="table " id="creator_payments">
                        <thead>
                        <tr>
                            <th >Campaign</th>
                            <th >User</th>
                            <th >Role</th>
                            <th >Trans.Ref </th>
                            <th >Bank Name</th>
                            <th >Account No.</th>
                            <th >Amount</th>
                            <th >Status</th>
                            <th >Created</th>
                            <th ></th>
                        </tr>
                        </thead>
                        <tbody >
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ############# End list #################  -->
            <div class="page-separator"></div>
        </div>
    </div>
@endsection
@push("page-scripts")
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>

        $("#brand_payments").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            scrollX: true,
            ajax: '{{ route('brand_payments') }}',
            columns: [
                {data: 'campaign_name', name: 'campaign.name'},
                {data: 'user', name: 'user.first_name'},
                {data: 'tx_ref', name: 'tx_ref'},
                {data: 'amount', name: 'amount'},
                {data: 'tax_amount', name: 'tax_amount'},
                {data: 'status', name: 'status'},
                {data: 'created_at', name: 'created_at'},
                {data: 'actions', name: 'actions'}
            ]
        });

        $("#gem_payments").DataTable({
            serverSide: true,
            processing: true,
            scrollX: true,
            ajax: '{{ route('admin_gem_payments') }}',
            columns: [
                {data: 'trender_name', name: 'trender.first_name'},
                {data: 'tx_ref', name: 'tx_ref'},
                {data: 'amount', name: 'amount'},
                {data: 'tax_amount', name: 'tax_amount'},
                {data: 'status', name: 'status'},
                {data: 'created_at', name: 'created_at'},
            ]
        });

        $("#creator_payments").DataTable({
            serverSide: true,
            processing: true,
            scrollX: true,
            "ajax": {
                "url": '{{ route('admin_creator_payments') }}',
                "data": function ( d ) {
                    d.user_type = $('#users_role').val();
                }
            },
            columns: [
                {data: 'campaign_name', name: 'campaign.name'},
                {data: 'user_name', name: 'user.first_name'},
                {data: 'user_role', name: 'user_role'},
                {data: 'tx_ref', name: 'tx_ref'},
                {data: 'bank_name', name: 'bank_name'},
                {data: 'account_number', name: 'account_number'},
                {data: 'amount', name: 'amount'},
                {data: 'status', name: 'status'},
                {data: 'created_at', name: 'created_at'},
                {data: 'actions', name: 'actions'}
            ]
        });

        $( "#users_role" ).change(function() {
            $('#creator_payments').DataTable().ajax.reload();
        });
    </script>

@endpush
