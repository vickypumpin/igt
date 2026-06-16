@component('mail::message')
# Dear {{$user_name}}

We're currently reviewing your GEM redemption request. Additionally, your payment is in the process and may take 1-3 business days to reflect in your account.
<br>
Keep up the excellent work, Trender!
<br>
Let's continue trending together.



Thanks,<br>
{{ config('app.name') }}
@endcomponent
