@extends('admin.layout.dashboard')
@section('title','Api Configuration')
@section('page_title','Api Configuration')
@section('page_route','Setting / api gateways')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="page-separator">
                <div class="page-separator__text">Payment API</div>
            </div>
            <div class="card mb-0 p-relative o-hidden">
                <div class="card-header py-12pt d-flex align-items-center">
                    <strong>FlutterWave</strong>
                </div>
                <div class="progress rounded-0" style="height: 4px;">
                    <div class="progress-bar bg-secondary" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <form method="post" action="{{route('update_flutter_wave')}}">
                    @csrf
                    <div class="list-group list-group-form" style="margin-bottom: 0px !important;">
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3" for="public_key">Public Key</label>
                                <div class="col-sm-9">
                                    <input type="hidden" class="form-control @error('flutter_wave_public_key') is-invalid @enderror" name="flutter_wave_public_key" id="public_key" placeholder="public key" value="{{old('flutter_wave_public_key') ? old('flutter_wave_public_key') : $setting->flutter_wave_public_key }}">
                                    @error('flutter_wave_public_key')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3" for="secret_key">Secret Key</label>
                                <div class="col-sm-9">
                                    <input type="hidden" class="form-control @error('flutter_wave_secret_key') is-invalid @enderror" name="flutter_wave_secret_key" id="secret_key" placeholder="secret key" value="{{old('flutter_wave_secret_key') ? old('flutter_wave_secret_key') :  $setting->flutter_wave_secret_key }}">
                                    @error('flutter_wave_secret_key')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3" for="encryption_key">Encryption Key</label>
                                <div class="col-sm-9">
                                    <input type="hidden" class="form-control @error('flutter_wave_encryption_key') is-invalid @enderror" name="flutter_wave_encryption_key" id="encryption_key" placeholder="encryption key" value="{{old('flutter_wave_encryption_key') ? old('flutter_wave_encryption_key') :  $setting->flutter_wave_encryption_key}}">
                                    @error('flutter_wave_encryption_key')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <button type="submit" class="btn btn-success float-right">Update!
                                <i class="material-icons font-size-16pt text-white">update</i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <br>
            <!-- ############## API model ############### -->
            <div class="page-separator">
                <div class="page-separator__text">SMS API</div>
            </div>
            <div class="card mb-0 p-relative o-hidden">
                <div class="card-header py-12pt d-flex align-items-center">
                    <strong>Twilio</strong>
                </div>
                <div class="progress rounded-0" style="height: 4px;">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>

                <form method="post" action="{{route('update_twilio')}}">
                    @csrf
                    <div class="list-group list-group-form">
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3">Account SSID</label>
                                <div class="col-sm-9">
                                    <input type="text" name="account_sid" class="form-control @error('account_sid') is-invalid @enderror" placeholder="ID ..." value="{{$setting->account_sid}}">
                                    @error('account_sid')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3">Auth Token</label>
                                <div class="col-sm-9">
                                    <input type="hidden" name="auth_token" class="form-control @error('auth_token') is-invalid @enderror" placeholder="Auth token ..." value="{{$setting->auth_token}}">
                                    @error('auth_token')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3">Mobile</label>
                                <div class="col-sm-9">
                                    <input type="text" name="from_number" class="form-control @error('from_number') is-invalid @enderror" placeholder="No. ..." value="{{$setting->from_number}}">
                                    @error('from_number')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <button type="submit" class="btn btn-success float-right">
                            Update!
                            <i class="material-icons font-size-16pt text-white">update</i>
                        </button>
                    </div>

                </form>
            </div>
            <br>
            <div class="card mb-0 p-relative o-hidden">
                <div class="card-header py-12pt d-flex align-items-center">
                    <strong>Sms Live 247</strong>
                </div>
                <div class="progress rounded-0" style="height: 4px;">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>

                <form method="post" action="{{route('update_sms_247')}}">
                    @csrf
                    <div class="list-group list-group-form">
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3">Api Key</label>
                                <div class="col-sm-9">
                                    <input type="hidden" name="sms_live_247_api_key" class="form-control @error('sms_live_247_api_key') is-invalid @enderror" placeholder="ID ..." value="{{$setting->sms_live_247_api_key}}">
                                    @error('sms_live_247_api_key')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <button type="submit" class="btn btn-success float-right">
                            Update!
                            <i class="material-icons font-size-16pt text-white">update</i>
                        </button>
                    </div>

                </form>
            </div>

            <div class="page-separator">
                <div class="page-separator__text">Chat Gpt</div>
            </div>
            <div class="card mb-0 p-relative o-hidden">
                <div class="card-header py-12pt d-flex align-items-center">
                    <strong>Chat Gpt</strong>
                </div>
                <div class="progress rounded-0" style="height: 4px;">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>

                <form method="post" action="{{route('update_chat_gpt')}}">
                    @csrf
                    <div class="list-group list-group-form">
                        <div class="list-group-item">
                            <div class="form-group row mb-0">
                                <label class="col-form-label col-sm-3">Chat Gpt Api Key</label>
                                <div class="col-sm-9">
                                    <input type="hidden" name="chat_gpt_api_key" class="form-control @error('chat_gpt_api_key') is-invalid @enderror" placeholder="Api key ..." value="{{$setting->chat_gpt_api_key}}">
                                    @error('chat_gpt_api_key')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <button type="submit" class="btn btn-success float-right">
                            Update!
                            <i class="material-icons font-size-16pt text-white">update</i>
                        </button>
                    </div>

                </form>
            </div>
            <br>
            {{--            <br>--}}
            {{--            <div class="page-separator">--}}
            {{--                <div class="page-separator__text">Recharge API</div>--}}
            {{--            </div>--}}

            {{--            <div class="card mb-0 p-relative o-hidden">--}}
            {{--                <div class="card-header py-12pt d-flex align-items-center">--}}
            {{--                    <strong>TransferTo/DTone</strong>--}}
            {{--                </div>--}}
            {{--                <div class="progress rounded-0" style="height: 4px;">--}}
            {{--                    <div class="progress-bar bg-warning" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>--}}
            {{--                </div>--}}

            {{--                <div class="list-group list-group-form">--}}
            {{--                    <div class="list-group-item">--}}
            {{--                        <div class="form-group row mb-0">--}}
            {{--                            <label class="col-form-label col-sm-3">ID</label>--}}
            {{--                            <div class="col-sm-9">--}}
            {{--                                <input type="text" class="form-control" placeholder="ID ...">--}}
            {{--                            </div>--}}
            {{--                        </div>--}}
            {{--                    </div>--}}
            {{--                    <div class="list-group-item">--}}
            {{--                        <div class="form-group row mb-0">--}}
            {{--                            <label class="col-form-label col-sm-3">Auth Token</label>--}}
            {{--                            <div class="col-sm-9">--}}
            {{--                                <input type="text" class="form-control" placeholder="Auth token ...">--}}
            {{--                            </div>--}}
            {{--                        </div>--}}
            {{--                    </div>--}}
            {{--                    <div class="list-group-item">--}}
            {{--                        <div class="form-group row mb-0">--}}
            {{--                            <label class="col-form-label col-sm-3">Key</label>--}}
            {{--                            <div class="col-sm-9">--}}
            {{--                                <input type="text" class="form-control" placeholder="No. ...">--}}
            {{--                            </div>--}}
            {{--                        </div>--}}
            {{--                    </div>--}}
            {{--                </div>--}}
            {{--                <div class="list-group-item">--}}
            {{--                    <button type="button" class="btn btn-success float-right">Update!<i class="material-icons font-size-16pt text-white">update</i></button>--}}
            {{--                </div>--}}
            {{--            </div>--}}

            {{--            <br>--}}

            {{--            <div class="page-separator">--}}
            {{--                <div class="page-separator__text">Social API</div>--}}
            {{--            </div>--}}

            {{--            <div class="card mb-0 p-relative o-hidden">--}}
            {{--                <div class="card-header py-12pt d-flex align-items-center">--}}
            {{--                    <strong>Instagram Insights</strong>--}}
            {{--                    <a href="#" class="d-inline-block mx-16pt"><i class="material-icons text-50">more_horiz</i></a>--}}
            {{--                    <div class="text-50">1</div>--}}
            {{--                    <div class="flex"></div>--}}
            {{--                    <label class="form-label mb-0" for="active">Active</label>--}}
            {{--                    <div class="custom-control custom-checkbox-toggle ml-8pt">--}}
            {{--                        <input checked="" type="checkbox" id="active" class="custom-control-input">--}}
            {{--                        <label class="custom-control-label" for="active">Active</label>--}}
            {{--                    </div>--}}
            {{--                    <a href="#"><i class="material-icons text-20">keyboard_arrow_down</i></a>--}}
            {{--                </div>--}}
            {{--                <div class="progress rounded-0" style="height: 4px;">--}}
            {{--                    <div class="progress-bar bg-warning" role="progressbar" style="width: 100%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>--}}
            {{--                </div>--}}
            {{--                <div class="list-group list-group-form">--}}
            {{--                    <div class="list-group-item">--}}
            {{--                        <div class="form-group row mb-0">--}}
            {{--                            <label class="col-form-label col-sm-3">ID</label>--}}
            {{--                            <div class="col-sm-9">--}}
            {{--                                <input type="text" class="form-control" placeholder="ID ...">--}}
            {{--                            </div>--}}
            {{--                        </div>--}}
            {{--                    </div>--}}
            {{--                    <div class="list-group-item">--}}
            {{--                        <div class="form-group row mb-0">--}}
            {{--                            <label class="col-form-label col-sm-3">Auth Token</label>--}}
            {{--                            <div class="col-sm-9">--}}
            {{--                                <input type="text" class="form-control" placeholder="Auth token ...">--}}
            {{--                            </div>--}}
            {{--                        </div>--}}
            {{--                    </div>--}}
            {{--                    <div class="list-group-item">--}}
            {{--                        <div class="form-group row mb-0">--}}
            {{--                            <label class="col-form-label col-sm-3">Key</label>--}}
            {{--                            <div class="col-sm-9">--}}
            {{--                                <input type="text" class="form-control" placeholder="No. ...">--}}
            {{--                            </div>--}}
            {{--                        </div>--}}
            {{--                    </div>--}}
            {{--                </div>--}}
            {{--                <div class="list-group-item">--}}
            {{--                    <button type="button" class="btn btn-success float-right">Update!<i class="material-icons font-size-16pt text-white">update</i></button>--}}
            {{--                </div>--}}
            {{--            </div>--}}
        </div>
    </div>
@endsection
