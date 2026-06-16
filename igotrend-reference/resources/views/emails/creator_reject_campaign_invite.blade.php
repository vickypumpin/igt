@component('mail::message')
# Campaign Request Rejected

Dear {{$brand_user_name}}.
<br>
Unfortunately! Your campaign request has been rejected  by {{$influencer_user_name}}
<br>
Feel free to add other trenders that align with your campaign goals.
<br>
Let’s Trend Together

Thanks,<br>
{{ config('app.name') }}
@endcomponent
