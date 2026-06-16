@extends('admin.layout.dashboard')
@section('title','Localization')
@section('page_title','Localization')
@section('page_route','Setting / Localization')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">

            <!-- ############## API model ############### -->
            <div class="card o-hidden mb-0">

                <form method="post" action="{{route('localization_save')}}">
                    @csrf
                    <div class="card-header bg-transparent">
                        <h5 class="text-uppercase mb-0">Status</h5>
                    </div>
                    <div class="card-body table--elevated">
                        <div class="form-group m-0" role="group" aria-labelledby="label-topic">
                            <div class="container">
                                <div class="row">
                                    <div class="col-sm">
                                        <div class="form-row align-items-center">
                                            <div class="custom-control custom-checkbox-toggle custom-control-inline mr-1">
                                                <input @if($setting->registration_status == 1) checked @endif value="1"  name="registration_status" type="checkbox" id="registration" class="custom-control-input" >
                                                <label class="custom-control-label" for="registration">Yes</label>
                                            </div>
                                            <label class="form-label mb-0" for="registration">Registration</label>
                                        </div>
                                    </div>
                                    <div class="col-sm">
                                        <div class="form-row align-items-center">
                                            <div class="custom-control custom-checkbox-toggle custom-control-inline mr-1">
                                                <input @if($setting->login_status == 1) checked @endif value="1" name="login_status"  type="checkbox" id="login" class="custom-control-input">
                                                <label class="custom-control-label" for="login">Yes</label>
                                            </div>
                                            <label class="form-label mb-0" for="login">Login</label>
                                        </div>
                                    </div>
                                    <div class="col-sm">
                                        <div class="form-row align-items-center">
                                            <div class="custom-control custom-checkbox-toggle custom-control-inline mr-1">
                                                <input @if($setting->sms_notify == 1) checked @endif value="1" type="checkbox" name="sms_notify" id="smsnotify" class="custom-control-input">
                                                <label class="custom-control-label" for="smsnotify">Yes</label>
                                            </div>
                                            <label class="form-label mb-0" for="smsnotify">SMS Notify</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-header bg-transparent">
                        <h5 class="text-uppercase mb-0">Charges</h5>
                    </div>
                    <div class="list-group list-group-flush">

                        <div class="list-group-item p-3">
                            <div class="form-group m-0" role="group" aria-labelledby="label-title">
                                <div class="form-row align-items-center">
                                    <label id="label-title" for="creatorfee" class="col-md-3 col-form-label form-label">Brands / Advertisers :</label>
                                    <div class="input-group input-group-merge col-sm-6">
                                        <input id="creatorfee" name="brand_service_fee" type="number" class="form-control form-control-appended"  value="{{old('brand_fee') ?? $setting->brand_service_fee}}" placeholder="brand fee" required>
                                        <div class="input-group-append">
                                            <div class="input-group-text">
                                                <span class="fa fa-percent sidebar-menu-icon sidebar-menu-icon--left"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="list-group-item p-3">
                            <div class="form-group m-0" role="group" aria-labelledby="label-title">
                                <div class="form-row align-items-center">
                                    <label id="label-title" for="brandfee" class="col-md-3 col-form-label form-label">Creator / Influencer :</label>
                                    <div class="input-group input-group-merge col-sm-6">
                                        <input id="brandfee" name="creator_service_fee" type="number" class="form-control form-control-appended"  value="{{old('creator_fee') ?? $setting->creator_service_fee}}" placeholder="creator fee" required>
                                        <div class="input-group-append">
                                            <div class="input-group-text">
                                                <span class="fa fa-percent sidebar-menu-icon sidebar-menu-icon--left"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="list-group-item p-3">
                            <div class="form-group m-0" role="group" aria-labelledby="label-title">
                                <div class="form-row align-items-center">
                                    <label id="label-title" for="adminfee" class="col-md-3 col-form-label form-label">Gems Service Fees :</label>
                                    <div class="input-group input-group-merge col-sm-6">
                                        <input id="adminfee" name="gem_service_fee" type="number" class="form-control form-control-appended"  value="{{old('gem_service_fee') ?? $setting->gem_service_fee }}" placeholder="gem service fee" required>
                                        <div class="input-group-append">
                                            <div class="input-group-text">
                                                <span class="fa fa-percent sidebar-menu-icon sidebar-menu-icon--left"></span>
                                            </div>
                                        </div>
                                    </div>
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
            <!-- ############# End localization #################  -->
            <div class="page-separator"></div>
        </div>
    </div>
@endsection

