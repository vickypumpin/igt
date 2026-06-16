@extends('admin.layout.dashboard')
@section('title','Mail Settings')
@section('page_title','Mail Setting')
@section('page_route','Setting / Mail Setting')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <form method="post" action="{{route('email.settings.update')}}" enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="mail_mailer">Mail Mailer</label>
                                    <input id="mail_mailer" name="mail_mailer" type="text"
                                           class="form-control @error('mail_mailer') is-invalid @enderror"
                                           placeholder="mail mailer" value="{{ isset($setting->mail_mailer) ? $setting->mail_mailer  : old('mail_mailer')}}"/>
                                    @error('mail_mailer')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="mail_host">Mail Host</label>
                                    <input id="mail_host" name="mail_host" type="text"
                                           class="form-control @error('mail_host') is-invalid @enderror"
                                           placeholder="mail host" value="{{ isset($setting->mail_host ) ? $setting->mail_host : old('mail_host') }}"/>
                                    @error('mail_host')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="mail_port">MAIL PORT</label>
                                    <input id="mail_port" name="mail_port" type="text"
                                           class="form-control @error('mail_port') is-invalid @enderror"
                                           placeholder="mail port" value="{{ isset($setting->mail_port) ? $setting->mail_port : old('mail_port ')}}"/>
                                    @error('mail_port')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="mail_username">MAIL USERNAME</label>
                                    <input id="mail_username" name="mail_username" type="text"
                                           class="form-control @error('mail_username') is-invalid @enderror"
                                           placeholder="mail username" value="{{ isset($setting->mail_username ) ? $setting->mail_username  : old('mail_username')}}" />
                                    @error('mail_username')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="mail_password">MAIL PASSWORD</label>
                                    <input id="mail_password" name="mail_password" type="text"
                                           class="form-control @error('mail_password') is-invalid @enderror"
                                           placeholder="mail password" value="{{ isset($setting->mail_password)? $setting->mail_password : old('mail_password') }}"/>
                                    @error('mail_password')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="mail_encryption">MAIL ENCRYPTION</label>
                                    <input id="mail_encryption" name="mail_encryption" type="text"
                                           class="form-control @error('mail_encryption') is-invalid @enderror"
                                           placeholder="mail encryption" value="{{ isset($setting->mail_encryption) ? $setting->mail_encryption : old('mail_encryption')  }}"/>
                                    @error('mail_encryption')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="mail_from">MAIL FROM</label>
                                    <input id="mail_from" name="mail_from" type="text"
                                           class="form-control @error('mail_from') is-invalid @enderror"
                                           placeholder="mail encryption" value="{{ isset($setting->mail_from) ? $setting->mail_from : old('mail_from')  }}"/>
                                    @error('mail_from')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                        </div>

                        <div class="form-group">
                            <button type="submit" class="btn btn-accent float-right">Update</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
