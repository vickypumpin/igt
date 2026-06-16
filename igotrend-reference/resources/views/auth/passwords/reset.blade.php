
@extends('layouts.auth')
@section('title','Reset Password')
@section('page_header_title','Reset Password')
@section('content')
    <div class="mt-4">
        <div class="container page__container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <form method="POST" action="{{ route('password.update') }}">
                        @csrf

                        <input type="hidden" name="token" value="{{ $token }}">
                        <div class="form-group">
                            <label class="form-label" for="email">Email:</label>
                            <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ $email ?? old('email') }}" required autocomplete="email" autofocus>
                            @error('email')
                            <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label for="password" class="col-form-label">Password</label>
                            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password"  placeholder="password">

                            @error('password')
                            <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label for="password-confirm" class="col-form-label">Confirm Password</label>
                            <input id="password-confirm" type="password" class="form-control" name="password_confirmation"  placeholder="confirm password">
                        </div>
                        <div class="text-center">
                            <button class="btn btn-secondary btn-lg" type="submit">Reset Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
