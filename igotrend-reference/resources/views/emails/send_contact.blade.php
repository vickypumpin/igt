// This is the demo secret key. In production, we recommend
// you store your secret key(s) safely.
const SECRET_KEY = '0x4AAAAAAAffV7VYDnkgugwoLTa0Jo_Q5us';

async function handlePost(request) {
	const body = await request.formData();
	// Turnstile injects a token in "cf-turnstile-response".
	const token = body.get('cf-turnstile-response');
	const ip = request.headers.get('CF-Connecting-IP');

	// Validate the token by calling the
	// "/siteverify" API endpoint.
	let formData = new FormData();
	formData.append('secret', SECRET_KEY);
	formData.append('response', token);
	formData.append('remoteip', ip);

	const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	const result = await fetch(url, {
		body: formData,
		method: 'POST',
	});

	const outcome = await result.json();
	if (!outcome.success) {
		return new Response('The provided Turnstile token was not valid! \n' + JSON.stringify(outcome));
	}
	return new Response('Turnstile token successfuly validated. \n' + JSON.stringify(outcome));

@component('mail::message')
# Hi Admin

New Contact query  from <b>{{$user_name}}</b> which company name is <b>{{$company_name}} </b> and company email is <b>{{$company_email}}</b> and company phone is <b>{{$company_phone}}</b>
or message is
<br>
{{$message}}


Thanks,<br>
{{ config('app.name') }}
@endcomponent

}
