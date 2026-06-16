@component('mail::message')
# Dear {{ucwords($influencer_user_name)}}

Unfortunately, your campaign request has been rejected.
<br>
Stay Strong and wait for the next big move.
<br>
Let’s Trend Together

Thanks,<br>
{{ config('app.name') }}
@endcomponent
