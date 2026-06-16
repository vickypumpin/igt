@extends('admin.layout.auth')
@section('title','Reset Admin Password')
@section('page_header_title','Reset Admin Password')
@section('content')
    <div class=" pt-32pt pt-sm-64pt pb-32pt">
        <div class="container page__container">
            <div class="col-sm-6 mx-auto">
                <form method="POST" action="{{ route('adminPasswordUpdate') }}">
                    @csrf
                    <input type="hidden" name="token" value="{{ $token }}">
                    <div class="form-group">
                        <label class="form-label" for="password">Password:</label>
                        <input type="password" id="password" name="password" class="form-control @error('password') is-invalid @enderror" placeholder="Password">

                        @error('password')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="password-confirm">Confirm Password:</label>
                        <input type="password" id="password-confirm" class="form-control" placeholder="Confirm Password" name="password_confirmation">
                    </div>
                    <div class="text-center">
                        <button class="btn btn-accent btn-lg">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
