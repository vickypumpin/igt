@component('mail::message')
# Campaign Request Accepted

Dear {{$brand_user_name}}.
<br>
Yay! Your campaign request has been accepted by {{$influencer_user_name}}
<br>
Hurry now to your dashboard to view updates.
<br>
Let’s Trend Together


Thanks,<br>
{{ config('app.name') }}
@endcomponent
