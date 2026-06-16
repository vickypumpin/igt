@extends('layouts.auth')
@section('title','Login')
@section('content')
    <div class="page-pattern">
        <div class="pageheader bg-shape">
            <div class="container">
                <div class="row">
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div class="page-caption">
                            <div class="page-caption-para-text">
                                <h1 class="page-caption-title">Log In</h1>
                                <p class="page-caption-para-text">Access you Account and start creating campaigns today!. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pattern-bottom">
            <div class="pattern-slide"></div>
        </div>
    </div>

    <!-- pageheader close -->
    <div class="pt-xl-8 pb-xl-6 py-8">
        <div class="container">
            <div class="row">
                @if($setting->login_status == 1)
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div class="d-flex row">
                            <div class="col-lg-4 col-md-12 col-12 pr-0 d-none d-lg-block">
                                <img src="{{asset('images/accpic.png')}}" alt="" class="img-fluid w-100" />
                            </div>
                            <div class="border col-lg-8 col-md-12 col-12 pl-0 border-left-0  rounded-right ">

                                @if($message = Session::get("danger"))
                                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                        {{ $message }}.
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                @endif

                                <div class="card-body px-4 py-4">
                                    <h3 class="h4 mb-3">Welcome back please login to your account.</h3>
                                    <br>
                                    <form method="post" action="{{route('login')}}">
                                        @csrf
                                        <div class="form-group">
                                            <label for="email"> Email<span class="text-danger">*</span></label>
                                            <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" id="email" aria-describedby="email" placeholder=""
                                                   required autocomplete="off" value="{{old('email')}}">
                                            @error('email')
                                            <span class="invalid-feedback" role="alert">
                                                                                <strong>{{ $message }}</strong>
                                                                            </span>
                                            @enderror
                                        </div>
                                        <div class="form-group">
                                            <label for="password"> Password<span class="text-danger">*</span></label>
                                            <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" id="password" placeholder="" required autocomplete="off">
                                            @error('password')
                                            <span class="invalid-feedback" role="alert">
                                                                                <strong>{{ $message }}</strong>
                                                                            </span>
                                            @enderror
                                        </div>

                                        <button type="submit" class="btn btn-secondary">Login</button>
                                    </form>
                                    <div class="d-flex justify-content-between font-14 font-weight-semi-bold mt-5">
                                        <a href="{{ route('password.request') }}"  data-target="#forgotpassword">Forgot Password ?</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                @else
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                        <h3>This service currently unavailable</h3>
                    </div>
                @endif
            </div>
        </div>
    </div>
    {{--    <div class=" pt-32pt pt-sm-64pt pb-32pt">--}}
    {{--        <div class="container page__container">--}}
    {{--            <form method="POST" action="{{ route('login') }}" class="col-md-5 p-0 mx-auto">--}}
    {{--                @csrf--}}
    {{--                <div class="form-group">--}}
    {{--                    <label class="form-label" for="role">Roles</label>--}}
    {{--                    <select id="role" class="form-control custom-select" name="role" required>--}}
    {{--                        <option selected value="">Choose Role</option>--}}
    {{--                        <option value="1">Brands / Advertiser</option>--}}
    {{--                        <option value="2">Creator / Influencer</option>--}}
    {{--                    </select>--}}
    {{--                </div>--}}
    {{--                <div class="form-group">--}}
    {{--                    <label class="form-label" for="email">Email or Phone No.:</label>--}}
    {{--                    <input id="email" type="text" class="form-control  @error('email') is-invalid @enderror" placeholder="">--}}
    {{--                    @error('email')--}}
    {{--                    <span class="invalid-feedback" role="alert">--}}
    {{--                                        <strong>{{ $message }}</strong>--}}
    {{--                                    </span>--}}
    {{--                    @enderror--}}
    {{--                </div>--}}
    {{--                <div class="form-group">--}}
    {{--                    <label class="form-label" for="password">Password:</label>--}}
    {{--                    <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" placeholder="">--}}
    {{--                    @error('password')--}}
    {{--                    <span class="invalid-feedback" role="alert">--}}
    {{--                                        <strong>{{ $message }}</strong>--}}
    {{--                                    </span>--}}
    {{--                    @enderror--}}
    {{--                    <p class="text-right"><a href="{{ route('password.request') }}" class="small">Forgot your password?</a></p>--}}
    {{--                </div>--}}
    {{--                <div class="text-center">--}}
    {{--                    <button class="btn btn-lg btn-accent">Login</button>--}}
    {{--                </div>--}}
    {{--            </form>--}}
    {{--        </div>--}}
    {{--    </div>--}}
@endsection
