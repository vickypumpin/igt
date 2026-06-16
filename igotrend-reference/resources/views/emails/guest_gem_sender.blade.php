@component('mail::message')
# Dear {{$sender_name}}

We are pleased to inform you that your GEMS to <b>{{$to_user_name}}</b> on <b>{{ config('app.name') }}</b> has been received and appreciated.
<br>
Your thoughtful gesture has brought joy and appreciation to <b>{{$to_user_name}}</b> , and we thank you for spreading kindness within our community.
<br>
If you wish to connect with <b>{{$to_user_name}}</b>, feel free to reach out to them directly through {{ config('app.name') }}.
<br>
Thank you for being part of  <b>{{ config('app.name') }}</b>, where these meaningful interactions happen.


Thanks Best regards,<br>
{{ config('app.name') }}
@endcomponent
