@component('mail::message')
# Dear {{$user_name}}

We are happy to let you know that we have approved your application for a Trender’s account.
<br>
<br>
Ready to get started? Sign into your account now and add your bank account information so you get paid while doing what you love.
<br>
<br>
Your Username is:
<br>
<br>
Custom Url: <b>{{$custom_url}}</b>
<br>
<br>
Your custom url shows your verified trender’s account which can be shared with your followers, fans, supporters, and advertisers. It also helps you collect payments in the form of Gem(s) which can be redeemed for cash into your bank account.
<br>
<br>
Over the next few days, we'll be in touch again with helpful information about getting paid, finding campaigns, and withdrawing the money you've earned.
<br>
<br>
If you have any questions, Contact us
<br>
<br>
Your Account PIN: <b>{{$account_pin}}</b>
<br>
<br>
Keep this pin safe and do not disclose it to anyone. Use this pin when contacting us about your account.
<br>
<br>
Be sure to check our Youtube on how to get started - https://www.youtube.com/@igotrend

Thanks, Let’s Trend Together<br>
{{ config('app.name') }}
@endcomponent
