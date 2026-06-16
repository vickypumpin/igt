
<div class="d-flex flex-row justify-content-start message">
    <img src="{{get_user_image($message->from_user)}}"
         style="width: 35px; height: 100%;">
    <div>
        <p class="small p-2 ms-3 mb-1 text-justify fs-13" >{{$message->message}}</p>
        <p class="small ms-3 mb-3 rounded-3 text-muted text-right">{{\Carbon\Carbon::parse($message->created_at)->format('d-m-y h:i A')}} </p>
    </div>
</div>
