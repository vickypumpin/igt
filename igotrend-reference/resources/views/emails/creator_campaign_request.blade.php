@component('mail::message')
# {{ucwords($brand_user_name)}} Wants to work with you

Hey {{ucwords($trender_name)}},
<br>
{{ ucwords($company_name) }} would like you to be part of the trenders driving their campaign <b>{{ucwords($campaign_name)}} </b>.
<br>
Hurry now to your dashboard and accept or decline their request.
<br>
Let’s Trend Together


Thanks,<br>
{{ config('app.name') }}
@endcomponent
