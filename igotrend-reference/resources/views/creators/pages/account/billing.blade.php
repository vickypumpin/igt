@extends('creators.layout.app')
@section('title','Payment Information')
@section('page_title','Account')
@section('page_route','Account / Edit Billing')
@section('content')
    <div class="container-fluid page__container">
        <div class="row">
            <div class="col-lg-9 pr-lg-0">
                <div class="page-section">
                    <div class="alert alert-soft-accent alert-dismissible fade show" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div class="d-flex flex-wrap align-items-start">
                            <div class="mr-8pt">
                                <i class="material-icons">access_time</i>
                            </div>
                            <div class="flex" style="min-width: 180px">
                                <small class="text-black-100">
                                    <strong>Alert! - </strong> For security reasons note that the name on your bank account and IGT profile must match!
                                </small>
                            </div>
                        </div>
                    </div>
                    <h4>Payment Information</h4>
                    <form action="{{route('update_payment_information')}}" method="post">
                        @csrf
                        <div class="list-group list-group-form">
                            <div class="list-group-item d-flex align-items-center">
                                <div class="flex text-center"> <span>
                                        <i class="material-icons text-primary ml-4pt icon-16pt">account_balance</i>
                                    </span> &nbsp; <strong>Your Bank Account Information</strong>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">First name</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" value="{{auth()->user()->first_name}}" placeholder="Your first name ..." readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="form-label col-form-label col-sm-3">Last name</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" value="{{auth()->user()->last_name}}" placeholder="Your last name ..." readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label for="bank_name" class="form-label col-form-label col-sm-3">Bank name</label>
                                    <div class="col-sm-9">
                                        <select class="form-control" name="bank_name" id="bank_name">
                                            <option value="">Select your Bank</option>
                                            @foreach($banks as $bank)
                                                <option value="{{$bank->code}}" @if($bank->code == auth()->user()->bank_name) selected @endif>{{ucwords($bank->name)}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label for="account_number" class="col-form-label form-label col-sm-3">Account number</label>
                                    <div class="col-sm-9">
                                        <input id="account_number" type="text" name="account_number" class="form-control" value="{{auth()->user()->account_number}}" placeholder="Bank Account number.." />
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <div class="col-sm-3"></div>
                                    <div class="col-sm-9">
                                        <button type="submit" class="btn btn-accent" @if(auth()->user()->is_payment_info_locked == \App\Models\User::PAYMENT_INFO_LOCKED) disabled @endif>Update Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>


            </div>
            <div class="col-lg-3 page-nav">
                <div class="page-section pt-lg-112pt">
                    <nav class="nav page-nav__menu">
                        <a class="nav-link {{active_class('creator_billing')}}" href="{{route('creator_billing')}}">Payment Information</a>
                        <a class="nav-link {{active_class('creator_payment_history')}}" href="{{route('creator_payment_history')}}">Payment History</a>
                        <a class="nav-link {{active_class('creator_rate_info')}}" href="{{route('creator_rate_info')}}">Rate Review</a>
                    </nav>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')

@endpush
