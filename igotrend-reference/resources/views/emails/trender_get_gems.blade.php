@component('mail::message')
# Dear {{$user_name}}

You've received a gift from <b>{{$sender_name}}</b> on <b>{{ config('app.name') }}</b>. To view or redeem your Gems, simply log in to your account and head to the ‘Rewards’ section.
There, you’ll find <b>{{$sender_name}}</b> heartfelt gesture waiting for you.
<br>
We believe that these unexpected acts of kindness are what make our community so unique and wonderful.



Thanks Enjoy,<br>
{{ config('app.name') }}
@endcomponent
