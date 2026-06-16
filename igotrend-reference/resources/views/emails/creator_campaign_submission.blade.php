@component('mail::message')
# Dear {{ucwords($brand_user_name)}}

<b>{{ucwords($trender_user_name)}}</b> has just posted his/her submission(s).
<br>
Hurry now to your dashboard  to review!
<br>
Let’s Trend Together



Thanks,<br>
{{ config('app.name') }}
@endcomponent
