@extends('admin.layout.dashboard')
@section('title','Campaign Reports')
@section('page_title','Contacts & Rewards')
@section('page_route','Campaign Mgt / Contacts & Rewards')
@push('cs')
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <style>
        .select2-container--default .select2-selection--multiple .select2-selection__choice {
            margin-top: 2px !important;
        }
        .select2-selection { overflow: hidden; }
        .select2-selection__rendered { white-space: normal; word-break: break-all; }
    </style>
@endpush
@section('content')
    <div class="container-fluid page__container">
        <div class="container-fluid page__container">
            <div class="page-section">

                <div class="page-separator">
                    <div class="page-separator__text">Overview</div>
                </div>
                <div class="py-32pt navbar-submenu">
                    <div class="container-fluid page__container">
                        <div class="progression-bar progression-bar--active-accent">

                            <a href="#" class="progression-bar__item progression-bar__item--complete">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon">done</i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Rewards Information</span>
                            </span>
                            </a>
                            <a href="{{route('admin_reward_contacts')}}" class="progression-bar__item progression-bar__item--complete progression-bar__item--active">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon"></i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Payment details</span>
                            </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="py-32pt py-lg-64pt">
                    <div class="container-fluid page__container">
                        <div class="col-lg-08 p-0 mx-auto">
                            <form method="post" action="{{route('admin_pay_reward')}}">
                                @csrf
                                <div class="row">
                                    <div class="list-group list-group-form" style="max-width: 396px !important;">
                                        <div class="list-group-item d-flex align-items-center">

                                            <div class="flex text-center">
                                            <span>
                                                <i class="material-icons text-primary ml-4pt icon-16pt">card_giftcard</i>
                                            </span> &nbsp;
                                                <strong>INSERT TOPUP INFORMATION</strong></div>
                                        </div>

                                        <div class="list-group-item">
                                            <fieldset role="group" aria-labelledby="label-type" class="m-0 form-group">
                                                <div class="form-row align-items-center">
                                                    <label for="payment_cc" id="label-type" class="col-md-3 col-form-label form-label">Reward type</label>
                                                    <div role="group" aria-labelledby="label-type" class="col-md-9">
                                                        <div role="group" class="btn-group btn-group-toggle" data-toggle="buttons">
                                                            <label class="btn btn-outline-secondary active">
                                                                <input type="radio" id="payment_cc" name="payment_type" value="mobile_airtime" checked aria-checked="true" />
                                                                Mobile Airtime
                                                            </label>
                                                            <label class="btn btn-outline-secondary">
                                                                <input type="radio" id="payment_pp" name="payment_type" value="gems" aria-checked="true"  />
                                                                Gems
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 text-center d-none" id="gem_price">
                                                        <span> 1 Gem = {{isset($setting->gem_price) ? $setting->gem_price : 0}} N</span>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div class="list-group-item">
                                            <div class="form-group row align-items-center mb-0">
                                                <label class="form-label col-form-label col-sm-3" id="amount_label">Amount</label>
                                                <div class="col-sm-9">
                                                    <input type="number" class="form-control" placeholder="1000" name="amount" id="amount" required >
                                                </div>
                                            </div>
                                        </div>
                                        <div class="list-group-item">
                                            <div class="form-group row align-items-center mb-0">
                                                <label class="col-form-label form-label col-sm-3">Campaign</label>
                                                <div class="col-sm-9">
                                                    <select class="form-control custom-select" name="campaign"  id="campaign" >
                                                        <option selected value="">Please select campaign</option>
                                                        @foreach($campaigns as $campaign)
                                                            <option value="{{$campaign->id}}" data-url="{{route('get_campaign_users',$campaign)}}">{{$campaign->name}}</option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="list-group-item">
                                            <div class="form-group row align-items-center mb-0">
                                                <label class="col-form-label form-label col-sm-3">IGT User</label>
                                                <div class="col-sm-9">
                                                    <select class="form-control users w-100" name="users[]" multiple required>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card mb-0">
                                            <div class="card-body">
                                                <h5>Reward summary</h5>
                                                <div class="d-flex mb-8pt">
                                                    <div class="flex"><strong class="text-70">Rewards</strong></div>
                                                    <strong>Total</strong>
                                                </div>

                                                <div class="alert alert-soft-warning">
                                                    <div class="d-flex flex-wrap align-items-start">
                                                        <div class="mr-8pt">
                                                            <i class="material-icons">check</i>
                                                        </div>
                                                        <div class="flex" style="min-width: 180px">
                                                            <strong class="text-black-100">
                                                                <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex naira_img" width="14" hieght="14">
                                                                <span class="total_amount">0</span>
                                                                X
                                                                <span class="total_count">0</span>
                                                                Trenders
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-flex mb-16pt pb-16pt border-bottom">
                                                    <div class="flex"><strong class="text-70">Total Reward</strong></div>
                                                    <strong>
                                                        <img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex naira_img" width="14" hieght="14">
                                                        <span class="total_pay_amount">0</span>
                                                    </strong>
                                                </div>
                                                <div class="custom-control custom-checkbox">
                                                    <input type="checkbox" class="custom-control-input" checked>
                                                    <label class="custom-control-label">Terms and conditions</label>
                                                    <small class="form-text text-muted">By checking here and continuing, I agree to the IGT Terms of Use</small>
                                                </div>

                                                <div class="list-group-item">
                                                    <div class="form-group row align-items-center mb-0">
                                                        <div class="col-sm-3"></div>
                                                        <div class="col-sm-9">
                                                            <button type="submit"  class="btn btn-accent">Proceed to Pay</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="page-separator">
                    <div class="page-separator__text">Reward  History</div>
                </div>
                <div class="card mb-0">
                    <div class="card-header">
                        <form class="form-inline">
                            <div class="d-flex flex-column justify-content-center navbar-height">
                                <div class="px-3 form-group mb-0">
                                    <div class="input-group input-group-merge input-group-rounded flex-nowrap">
                                        <select id="filter_campaign" class="form-control custom-select">
                                            <option selected value="">Please select campaign</option>
                                            @foreach($campaigns as $campaign)
                                                <option value="{{$campaign->id}}">{{$campaign->name}}</option>
                                            @endforeach
                                        </select>
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <span class="material-icons">filter_list</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card-body">
                        <table class="table mb-0 thead-border-top-0 table-nowrap" id="contacts">
                            <thead>
                            <tr>
                                <th>
                                    Trender
                                </th>
                                <th >
                                    Category
                                </th>
                                <th >
                                    Level
                                </th>
                                <th >
                                    Type
                                </th>
                                <th >
                                    Platform
                                </th>
                                <th >
                                    Amount
                                </th>
                            </tr>
                            </thead>
                            <tbody  class="list">

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $('.users').select2({
            placeholder: "Select a user",
            allowClear: true,
            multiple:true,
        });
        $('.users').on('select2:close', function() {
            let amount = $('#amount').val()
            let select = $(this)
            let count = select.select2('data').length
            $('.total_count').text(count);
            const total_pay_amount = count * amount;
            $('.total_pay_amount').text(total_pay_amount);
        });
        $('#amount').on('change', function(e) {
            let amount = $(this).val()
            let count = $('.users').select2('data').length;
            $('.total_amount').text(amount);
            const total_pay_amount = count * amount;
            $('.total_pay_amount').text(total_pay_amount);
        });
        let count = $('.users').select2('data').length;
        $('.total_count').text(count);
        $('input[type=radio][name=payment_type]').change(function() {
            if (this.value === 'gems') {
                $('#gem_price').removeClass('d-none');
                $('#amount_label').text('Quantity');
                $('.naira_img').addClass('d-none');
            } else if (this.value === 'mobile_airtime') {
                if(!$( "#gem_price" ).hasClass( "d-none")){
                    $('#gem_price').addClass('d-none');
                }
                if(!$('.naira_img').hasClass( "d-none")){
                    $('.naira_img').addClass('d-none');
                }
                $('#amount_label').text('Amount');
            }
        });
        $("#contacts").DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            // scrollX: true,
            "ajax": {
                "url": '{{ route('admin_get_reward_data') }}',
                "data": function ( d ) {
                    d.campaign = $("#filter_campaign option:selected").val()
                }
            },
            columns: [
                {data: 'trender', name: 'trender'},
                {data: 'category', name: 'category'},
                {data: 'level', name: 'level'},
                {data: 'type', name: 'type'},
                {data: 'plateform', name: 'plateform'},
                {data: 'amount', name: 'amount'},
            ]
        });
        $("#filter_campaign").change(function(){
            $('#contacts').DataTable().ajax.reload();
        });
        $("#campaign").change(function(){
            const url = $('#campaign').find(":selected").data('url');
            $.ajax({
                url: url,
                type: "get",
                success: function (response) {

                    if(response.status){
                        $('.users').empty();
                        $('.users').val(null).trigger('change');
                        const users = response.users
                        var _options =""
                        $.each(users, function(i, value) {
                            _options +=('<option value="'+ value.id+'">'+ value.first_name +' '+value.last_name +'</option>');
                        });
                        $('.users').append(_options);
                        $(".users option:first").attr('selected','selected');

                        let amount = $('#amount').val()
                        let count = $('.users').select2('data').length
                        $('.total_count').text(count);
                        const total_pay_amount = count * amount;
                        $('.total_pay_amount').text(total_pay_amount);

                    }else {
                        $('.users').empty();
                        $('.users').val(null).trigger('change');
                    }
                }
            });
        });
    </script>
    <div id="trenderModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content justify-content-center">
                <div class="modal-header">
                    <h6 class="modal-title">
                        <h5>Trender's Informations and Rate(s)</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </h6>
                </div>
                <div class="modal-body">
                    <div id="trender_modal_info"></div>
                </div>
                <!-- End modal html  -->
            </div>
        </div>
    </div>
    <script>
        $(document).on("click",".view_trender_info",function(e) {
            e.preventDefault();
            const url = $(this).data('url');
            $.ajax({
                url: url,
                type: "GET",
                success: function (data) {
                    if(data.status){
                        $('#trender_modal_info').html(data.info);
                        $('#trenderModal').modal('show');
                    }
                }
            });
        });
    </script>
@endpush
