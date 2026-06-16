@extends('brands.layout.app')
@section('title','Billing')
@section('page_title','Billing')
@section('page_route','Billing')
@section('content')
    <div class="container-fluid page__container">
        <div class="row">
            <div class="col-lg-9 pr-lg-0">
                <div class="page-section">
                    <h4>Subscription</h4>
                    <div class="list-group list-group-form">
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3">Your current plan</label>
                                <div class="col-sm-9 d-flex align-items-center">
                                    <div class="flex">Premium Advertiser</div>
                                    <!-- <a href="billing-upgrade.html" class="text-secondary">Change plan</a> -->
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3">Fees</label>
                                <div class="col-sm-9">
                                    <p>You will be charged a 0% deduction per campaign</p>
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3">Payment method</label>
                                <div class="col-sm-9 d-flex align-items-center">
                                    <span><i class="material-icons text-primary ml-4pt icon-16pt">account_balance</i></span>
                                    <div class="flex">&nbsp; Bank Deposit / Transfer / Debit & Credit Cards </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 page-nav">
                <div class="page-section pt-lg-112pt">
                    <nav class="nav page-nav__menu">
                        <a class="nav-link" href="{{route('brand_billing')}}">Subscription</a>
                        <a class="nav-link active" href="{{route('payment_history')}}">Payment History</a>
                    </nav>
                </div>
            </div>
        </div>
    </div>
@endsection
