@component('mail::message')
# Dear {{ucwords($user_name)}}

Congratulations! Your campaign <b>{{ucwords($campaign_name)}}</b> submission(s) has been approved. Also, your payment is being processed and may take 1-3 business day(s) to drop into your account.
<br>
Keep up the good work Trender!
<br>
Let's Trend Together

Thanks,<br>
{{ config('app.name') }}
@endcomponent
