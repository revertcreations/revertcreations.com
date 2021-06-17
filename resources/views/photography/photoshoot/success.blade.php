<x-layout>

    <span>
        <i class="mt-1 bg-black text-white text-4xl">Thanks!</i>
    </span>
        <br>

        <i class="mt-1 text-3xl">{{ ($photoshoot->status == 'approved' ? 'Contract Approved' : 'Reviewing Changes') }}</i>

        <p class="m-4">
            Awesome, <span class=" underline font-bold text-lg">{{ $photoshoot->client->first_name }}</span>!<br><br>
            @if($photoshoot->status == 'approved')
            I'm looking forward to the upcoming photoshoot! I'll be in contact if anything else comes up until then.<br>
            Once the photoshoot complete, I'll send an email out for a link to a gallery for image review.<br><br>


            @else
            I can't wait to review this, and get back to you.<br>
            If all is well, we can get to work right away!
            @endif
        </p>

        <p class="m-4">
            Thanks,<br>
            Trever
        </p>

</x-layout>
