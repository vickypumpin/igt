@component('mail::message')
# Dear {{ucwords($influencer_user_name)}}

Yay! Your campaign request has been accepted
<br>
Hurry now to your dashboard  to get started.
<br>
Let’s Trend Together

Thanks,<br>
{{ config('app.name') }}
@endcomponent
