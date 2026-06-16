@component('mail::message')
# {{ucwords($creator_name)}} Wants to work with you

Dear  {{ucwords($brand_name)}},
<br>
{{ ucwords($creator_name) }} would like to be part of your campaign <b>{{ucwords($campaign_name)}} </b>  you posted on IGT marketplace.
<br>
Hurry now to your dashboard and accept or decline their request.
<br>
Let’s Trend Together


Thanks,<br>
{{ config('app.name') }}
@endcomponent
