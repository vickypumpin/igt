@extends('admin.layout.auth')
@section('title',' Admin Forgot Password')
@section('page_header_title',' Admin Forgot Password')
@section('content')
    <div class=" pt-32pt pt-sm-64pt pb-32pt">
        <div class="container page__container">
            <div class="col-sm-6 mx-auto">
                @if (session('status'))
                    <div class="alert alert-soft-warning">
                        <div class="d-flex flex-wrap">
                            <div class="mr-8pt">
                                <i class="material-icons">check_circle</i>
                            </div>
                            <div class="flex" style="min-width: 180px">
                                <small class="text-black-100">
                                    An email with password reset instructions has been sent to your email address, if it exists on our system.
                                </small>
                            </div>
                        </div>
                    </div>
                @endif
                <form action="{{ route('adminPasswordEmail') }}" method="post">
                    @csrf
                    <div class="form-group">
                        <label class="form-label" for="email">Email:</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Your email address ..." autocomplete value="{{old('email')}}">
                        <small class="form-text text-muted">We will email you with info on how to reset your password.</small>
                        @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="text-center">
                        <button class="btn btn-accent btn-lg">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

@endsection
