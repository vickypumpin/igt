@component('mail::message')
# Dear {{ucwords($user_name)}}

Unfortunately! Your campaign <b>{{ucwords($campaign_name)}}</b> submission(s) has been rejected. Kindly head back to your dashboard and review you submission(s).
<br>
Feel free to reach out for support or check our FAQ page.
<br>
Let's Trend Together,


Thanks,<br>
{{ config('app.name') }}
@endcomponent
