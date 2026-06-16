@extends('admin.layout.dashboard')
@section('title','Email / SMS')
@section('page_title','Email / SMS')
@section('page_route','Messages / Email')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">

            <!-- ############## email model ############### -->
            <div class="page-separator">
                <div class="page-separator__text">Email / SMS Promotions</div>
            </div>

            <form method="post" action="{{route('admin_email_send')}}">
                @csrf
                <div class="card pb-32pt pb-lg-64pt">
                    <div class="card o-hidden mb-0">
                        <div class="card-body table--elevated">
                            <div class="form-group m-0" role="group" aria-labelledby="label-title">
                                <div class="form-row align-items-center">
                                    <label id="label-title" for="subject" class="col-md-3 col-form-label form-label">Subject:</label>
                                    <div class="col-md-9">
                                        <input id="subject" type="text" placeholder="Your Subject ..." name="subject" required class="form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-header bg-transparent">
                            <h5 class="text-uppercase mb-0">Sender / From</h5>
                        </div>
                        <div class="card-body table--elevated">
                            <div class="form-group m-0" role="group" aria-labelledby="label-topic">
                                <div class="form-row align-items-center">
                                    <label id="label-topic" for="from" class="col-md-3 col-form-label form-label">FROM:</label>
                                    <div class="col-md-9">
                                        <select id="from" class="form-control custom-select w-auto" name="from">
                                            <option value="customer service">Customer Service</option>
                                            <option value="billing finance">Billing / Finance</option>
                                            <option value="support">Support</option>
                                            <option value="marketing dept">Marketing Dept</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-header bg-transparent">
                            <h5 class="text-uppercase mb-0">Reciever(s) / Destination(s)</h5>
                        </div>

                        <div class="list-group list-group-flush">

                            <div class="list-group-item p-3">
                                <div class="form-group m-0" role="group" aria-labelledby="label-title">
                                    <div class="form-row align-items-center">
                                        <label id="label-title" for="to" class="col-md-3 col-form-label form-label">To :</label>
                                        <div class="col-md-9">
                                            <input id="to" name="to" type="text" placeholder="igtusername ..."  class="form-control" required>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="list-group-item p-3">
                                <div class="form-group m-0" role="group" aria-labelledby="label-topic">
                                    <div class="form-row align-items-center">
                                        <label id="label-topic" for="bcc" class="col-md-3 col-form-label form-label">BCC:</label>
                                        <div class="col-md-9">
                                            <select id="bcc" name="bcc" class="form-control custom-select w-auto" required>
                                                <option value="none">None</option>
                                                <option value="all_users">All Users</option>
                                                <option value="brands">Brands / Advertisers</option>
                                                <option value="creators">Content Creators</option>
                                                <option value="influencer">Influencers</option>
                                                <option value="administrator">Administrator</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                <div class="list-group">
                    <div class="list-group-item">
                        <div role="group" aria-labelledby="label-question" class="m-0 form-group">
                            <div class="form-row">
                                <label id="label-question" for="message" class="col-md-3 col-form-label form-label">Message Body</label>
                                <div class="col-md-9">
                                    <textarea id="message" class="form-control" name="message" placeholder="email message" required></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <div class="custom-control custom-checkbox custom-control-inline">
                            <input id="notify" type="checkbox" class="custom-control-input" name="sms_notify" @if(old('sms_notify')) checked @endif value="1">
                            <label for="notify" class="custom-control-label">SMS / Text Notification</label>
                        </div>
                        <small id="description-notify" class="form-text text-muted">The user(s) will also receive SMS/text on their mobile phone.</small>
                    </div>
                    <div class="list-group-item">
                        <div class="form-group m-0" role="group" aria-labelledby="label-topic">
                            <div class="form-row align-items-center">
                                <label id="label-topic" for="sms_users" class="col-md-2 col-form-label form-label">SMS Users:</label>
                                <div class="col-md-2">
                                    <select id="sms_users" class="form-control custom-select w-auto" name="sms_users">
                                        <option value="brands" @if(old('sms_users')) selected @endif>Brands</option>
                                        <option value="creators" @if(old('sms_users')) selected @endif>Creators</option>
                                        <option value="both" @if(old('sms_users')) selected @endif>Both</option>
                                        <option value="none" @if(old('none')) selected @endif>None</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <button type="submit" class="btn btn-primary float-right">Send Message!<i class="material-icons font-size-16pt text-white">send</i></button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection
