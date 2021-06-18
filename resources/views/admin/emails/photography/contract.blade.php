@component('mail::message')
# Photography Contract

Hey {{ $contract->client->first_name }} {{ $contract->client->last_name }},

Below is a link to our contract proposal for the upcoming <b>{{ $contract->photoshoot->title }}</b>. Nothing is final until you check
the box at the bottom, and click the "I Agree" button. You are able to edit most of the details. If there are any changes I'll recieve
a notification, look over the edits,and get back to you asap.<br>

Feel free to email me back with any questions or concerns.


@component('mail::button', ['url' => route('public.photoshoot.edit', ['photoshoot' => $contract->photoshoot->id, 'token' => base64_encode($contract->photoshoot->public_token)])])
Contract Proposal
@endcomponent

Look forward to working with you,<br><br>
Trever Hillis<br><br>
<small>Revert Creations</small><br>
<small>trever@revertcreations.com</small><br>
<small>(505) 974-9035</small><br>
@endcomponent
