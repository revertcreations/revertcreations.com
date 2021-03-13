<x-layout>
    <meta name="csrf-token" content="{{ csrf_token() }}">


        <i class="mt-1 bg-gray-800 text-gray-200 text-5xl">Photoshoot Photoshoot</i>

        <p class="m-5">
            Hi there <span class=" underline font-bold text-lg">{{ $photoshoot->client->first_name }}</span>! Looks like we got some business to go over, how very exciting!
            Below you will see my photoshoot for the upcoming photoshoot that we have discussed. Feel free to edit any of the details below. Once you are happy
            with the terms on your side, check the agreement checkbox below, and click the "I Agree" button. I'll be notified, and review all changes, if any. Once we both agree,
            I'll send you an email a copy of the finalized agreement, along with pre-shoot invoices, if any.
        </p>


        <br>

        <i class="mt-1 bg-gray-300 text-3xl">Photoshoot</i>

        <div class="m-5 self-center justify-around flex flex-col md:flex-row">

            <div class="flex flex-col mx-1">

                <label for="title">Photoshoot Name</label>
                <div>
                    <input name="title" class="w-full border-none mt-1 text-gray-800 font-bold text-2xl" type="text" value="{{ $photoshoot->title }}">
                </div>

                <label for="description">Brief Description</label>
                <div>
                    <textarea data-autoresize name="description" class="w-full h-full inline border-none mt-1 text-gray-800 font-bold text-2xl" rows="6" cols="50" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>{{ $photoshoot->description }}</textarea>
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="arrival_at" class="block text-sm font-medium text-gray-700">
                        Start Date / Time
                    </label>
                    <input x-bind-contract type="text" name="arrival_at" id="arrival_at" class="w-full inline border-none mt-1 text-gray-800 font-bold text-4xl" value="{{ $photoshoot->contract->event_starts }}">
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="event_starts" class="block text-sm font-medium text-gray-700">
                        Start Date / Time
                    </label>
                    <input x-bind-contract type="text" name="event_starts" id="event_starts" class="w-full inline border-none mt-1 text-gray-800 font-bold text-4xl" value="{{ $photoshoot->contract->event_starts }}">
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="event_ends" class="block text-sm font-medium text-gray-700">
                        End Date / Time
                    </label>
                    <input x-bind-contract type="text" name="event_ends" id="event_ends" class="w-full inline border-none mt-1 text-gray-800 font-bold text-4xl" value="{{ $photoshoot->contract->event_ends }}">
                </div>
            </div>
        </div>


    <script type="text/javascript">

    </script>
</x-layout>
