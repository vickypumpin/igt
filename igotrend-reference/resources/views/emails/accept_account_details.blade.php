@component('mail::message')
# Dear {{$user_name}}

Congratulations! 🎉 We're excited to let you know that your payment details for <a href="{{url('/')}}" target="_blank">{{env('APP_NAME')}}</a>  have been approved!
<br>
This means you now have full access to all premium features, enabling you to monetize your influence, connect with top brands, and unleash your creativity like never before.
<br>
Welcome to the iGotrend community! Let's make magic together!


Best regards,<br>
{{ config('app.name') }}
@endcomponent
