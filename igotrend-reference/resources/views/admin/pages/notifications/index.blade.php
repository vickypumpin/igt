@extends('admin.layout.dashboard')
@section('title','Notifications')
@section('page_route','Settings / Notifications')
{{-- Content --}}
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">


            <div class="card">
                <div class="card o-hidden mb-0">
                    <div class="card-header bg-transparent">
                        <h5 class="text-uppercase mb-0">Messages Board</h5>
                    </div>
                    <div class="card-body">
                        <form method="post" action="{{route('notification_update')}}">
                            @csrf
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea placeholder="message" class="form-control" name="message" id="message" rows="3">{{$settings->message_notification}}</textarea>
                            </div>
                            <button class="btn btn-primary btn-sm">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

