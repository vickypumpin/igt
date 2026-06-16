@extends('creators.layout.app')
@section('title','Edit Account')
@section('page_title','Account')
@section('page_route','Account / Edit Account')
@section('content')
    <div class="container-fluid page__container">
        <form action="{{route('creator_update_password')}}" method="post">
            @csrf
            <div class="row">
                <div class="col-lg-9 pr-lg-0">
                    <div class="page-section">
                        <div class="list-group list-group-form">
                            <div class="list-group-item">
                                <div class="form-group row mb-0">
                                    <label class="col-form-label col-sm-3">Current password</label>
                                    <div class="col-sm-9">
                                        <input type="password" name="current_password" class="form-control  @error('current_password') is-invalid @enderror" placeholder="Current Password">
                                        @error('current_password')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row mb-0">
                                    <label class="col-form-label col-sm-3">New password</label>
                                    <div class="col-sm-9">
                                        <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" placeholder="Password ...">
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
                            <a class="nav-link {{ active_class('creator_edit_account') }}" href="{{route('creator_edit_account')}}">Basic Information</a>
                            <a class="nav-link {{ active_class('edit_social_profile') }}" href="{{route('edit_social_profile')}}">Social Profile</a>
                            <a class="nav-link {{ active_class('creator_edit_password') }}" href="{{route('creator_edit_password')}}">Change Password</a>
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
