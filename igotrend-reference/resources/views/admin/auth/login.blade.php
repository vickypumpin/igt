@extends('admin.layout.auth')
@section('title','Admin Login')
@section('page_header_title','Admin Login')
@section('content')
    <div class=" pt-32pt pt-sm-64pt pb-32pt">
        <div class="container page__container">
            <form action="{{ route('adminLogin') }}" method="post" class="col-md-5 p-0 mx-auto">
                @csrf
                <div class="form-group">
                    <label class="form-label" for="email">Email:</label>
                    <input id="email" type="email" name="email" class="form-control @error('email') is-invalid @enderror @if ($message = session('error')) is-invalid   @endif" placeholder="Email" value="{{old('email')}}">
                    @error('email')
                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                    @enderror
                    @if ($message = session('error'))
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                    @endif
                </div>
                <div class="form-group">
                    <label class="form-label" for="password">Password:</label>
                    <input id="password" type="password" name="password" class="form-control @error('password') is-invalid @enderror" placeholder="Password">
                    @error('password')
                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                    @enderror
                    <p class="text-right"><a href="{{route('adminPasswordRequest')}}" class="small">Forgot your password?</a></p>
                </div>
                <div class="text-center">
                    <button class="btn btn-lg btn-accent">Login</button>
                </div>
            </form>
        </div>
    </div>
@endsection



