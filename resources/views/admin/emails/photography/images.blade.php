@component('mail::message')
# Photoshoot Gallery

Hey {{ $photoshoot->client->first_name }} {{ $photoshoot->client->last_name }},

Below is a link to our recent photoshoot <b>{{ $photoshoot->title }}</b>. I literally just made that gallery, and this automated email, so things
are probably not working correctly. Hit me up if you need any edits.<br>

Good seeing ya buddy!<br>


@component('mail::button', ['url' => route('public.photoshoot.show', ['photoshoot' => $photoshoot->id, 'token' => base64_encode($photoshoot->public_token)])])
Gallery
@endcomponent

Thanks,<br><br>
Trever Hillis<br><br>
<small>Revert Creations</small><br>
<small>trever@revertcreations.com</small><br>
<small>(505) 974-9035</small><br>
@endcomponent
