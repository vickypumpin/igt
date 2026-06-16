@extends('layouts.auth')
@section('title','Reset Password')
@section('page_header_title','Reset Password')
@section('content')
    <div class="mt-4">
        <div class="container page__container">
            <div class="col-sm-6 mx-auto">
                @if (session('status'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        An email with password reset instructions has been sent to your email address
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                @endif
                <form action="{{ route('password.email') }}" method="post">
                    @csrf
                    <div class="form-group">
                        <label class="form-label" for="email">Email:</label>
                        <input type="email" id="email" name="email" class="form-control  @error('email') is-invalid @enderror" placeholder="Your email address ..." autocomplete value="{{old('email')}}">
                        <small class="form-text text-muted">We will email you with info on how to reset your password.</small>
                        @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="text-center">
                        <button class="btn btn-secondary btn-lg">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
