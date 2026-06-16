@extends('layouts.auth')
@section('title','Email Verify')
@section('page_header_title','Email Verify')
@section('content')
    <div class="container page__container mt-4  mb-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    @if (session('resent'))
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            A fresh verification link has been sent to your email address.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    @endif
                    <div class="card-header bg-info text-white">Verify Your Email Address</div>
                    <div class="card-body">
                        Before proceeding, please check your email for a verification link. If you did not receive the email,
                        <form class="d-inline" method="POST" action="{{ route('verification.resend') }}">
                            @csrf
                            <button type="submit" class="btn btn-link p-0 m-0 align-baseline">{{ __('click here to request another') }}</button>.
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
