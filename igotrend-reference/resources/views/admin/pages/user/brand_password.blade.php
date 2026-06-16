
@extends('admin.layout.dashboard')
@section('title','Brand update password')
@section('page_title','Brand update password')
@section('page_route','Users / Brand update password')
@section('content')
    <div class="container-fluid page__container">
        <form action="{{route('user-password-update',$user)}}" method="post">
            @csrf
            <div class="row">
                <div class="col-lg-9 pr-lg-0">
                    <div class="page-section">
                        <div class="list-group list-group-form">
                            <div class="list-group-item">
                                <div class="form-group row mb-0">
                                    <label class="col-form-label col-sm-3">New password</label>
                                    <div class="col-sm-9">
                                        <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" placeholder="new password ...">
                                        @error('password')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row mb-0">
                                    <label class="col-form-label col-sm-3">Confirm password</label>
                                    <div class="col-sm-9">
                                        <input type="password" name="password_confirmation"  class="form-control" placeholder="Confirm password ...">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-lg-3 page-nav">
                    <div class="page-section pt-lg-112pt">
                        <nav class="nav page-nav__menu">
                            <a class="nav-link {{ active_class('userAccountInfo') }}" href="{{route('userAccountInfo',$user)}}">Basic Information</a>
                            <a class="nav-link {{ active_class('user-password') }}" href="{{route('user-password',$user)}}">Change Password</a>
                        </nav>
                        <div class="page-nav__content">
                            <button type="submit" class="btn btn-accent">Update Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection

