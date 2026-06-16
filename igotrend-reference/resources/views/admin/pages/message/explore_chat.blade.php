@extends('admin.layout.dashboard')
@section('title','Explore Chat')
@section('page_title','Explore Chat')
@section('page_route','Messaging / Explore Chat')
@push('css')
    <style>
        .fs-13{
            font-size: 13px !important;
        }
    </style>
@endpush
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="row">
                <div class="col-12 offset-0 col-md-10 offset-md-1">
                    <div class="card card-body text-center">
                        <div class="row" style="border-radius: 15px;">
                            <div class="col-md-12">
                                <div class="pt-3 messages_div px-2" id="messages_div" style="position: relative; height: 400px;  overflow-y:auto;">
                                    @if($messages->count() == 0)
                                        <h4 class="no_message_text">No Messages Found</h4>
                                    @else
                                        @foreach($messages as $message)
                                            @if($message->from_user == $from)
                                                <div class="d-flex flex-row justify-content-start message">
                                                    <img src="{{get_user_image($message->from_user)}}"
                                                         style="width: 35px; height: 100%;">
                                                    <div>
                                                        <p class="small p-2 ms-3 mb-1 text-justify fs-13" >{{$message->message}}</p>
                                                        <p class="small ms-3 mb-3 text-muted text-right">{{\Carbon\Carbon::parse($message->created_at)->format('d-m-y h:i A') }} </p>
                                                    </div>
                                                </div>
                                            @else
                                                <div class="d-flex flex-row justify-content-end message">
                                                    <div>
                                                        <p class="small p-2 me-3 mb-1  text-justify fs-13">{{$message->message}}</p>
                                                        <p class="small me-3 mb-3 text-muted text-left">{{\Carbon\Carbon::parse($message->created_at)->format('d-m-y h:i A') }}</p>
                                                    </div>
                                                    <img src="{{get_user_image($message->from_user)}}"
                                                         style="width: 35px; height: 100%;">
                                                </div>
                                            @endif
                                        @endforeach
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
@endpush
