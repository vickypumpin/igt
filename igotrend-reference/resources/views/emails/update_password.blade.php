@component('mail::message')
# Dear {{$user_name}}

We hope this email finds you well. We are writing to inform you that your password has been successfully changed for your <b><a href="{{url('/')}}">IGoTrend.com</a></b> account.
<br>
<br>
If you initiated this password change, you can disregard this message. However, if you did not request this change or believe it to be an unauthorized action, please contact our support team immediately at support@igotrend.com.
<br>
<br>
Here are some key details regarding your password change:
<br>
Username/Email: <b>{{ $user_name }} / {{ $user_email }}</b>
<br>
Date and Time of Change: <b>{{ \Illuminate\Support\Carbon::now()->toDateTimeString() }}</b>
<br>
IP Address of Change: <b>{{ $ip_address }}</b>
<br>
PIN: <b>{{ $user_pin }}</b>
<br>
<br>
If you notice any suspicious activity or if there's anything else we can assist you with, please do not hesitate to reach out to us. Your account security is of utmost importance to us, and we appreciate your vigilance.
<br><br>
Thank you for choosing <b><a href="{{url('/')}}">IGoTrend.com</a></b>.
<br><br>
Best regards,<br>
{{ config('app.name') }}
@endcomponent
