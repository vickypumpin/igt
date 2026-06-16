@component('mail::message')
# Dear {{$user_name}}

We regret to inform you that your payment details for <a href="{{url('/')}}" target="_blank">{{env('APP_NAME')}}</a> have been rejected.
<br>
Please log in to your account and update your payment details to ensure uninterrupted access to iGotrend.
<br>
Thank you for your attention to this matter.

Best regards,<br>
{{ config('app.name') }}
@endcomponent
