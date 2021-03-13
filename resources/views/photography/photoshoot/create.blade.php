<x-layout>

    <form class="" id="photoshoot_form" action="{{ route('public.photoshoot.store') }}" method="POST">
        @csrf

        <i class="mt-1 bg-black text-white text-5xl">Photoshoot Inquiry</i>

        <br>

        <i class="mt-1 text-3xl">Details</i>

        <div class="m-5 self-center justify-around flex flex-col md:flex-row">


            <div class="flex flex-col">

                <label for="organization">Organization</label>
                <input name="client_organization" id="organization" class="border-1 mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ old('organization') }}">

                <label for="first_name">First Name</label>
                <input id="first_name" name="first_name" class="border-1 mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ old('first_name') }}">

                <label for="last_name">Last Name</label>
                <input id="last_name" name="last_name" class="border-1 mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ old('last_name') }}">

                <label for="email">Email</label>
                <input id="email" name="email" class="border-1 mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ old('email') }}">

                <label for="phone">Phone</label>
                <input id="phone" name="phone" class="border-1 mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ old('phone') }}">

                <label for="website">Website</label>
                <input name="website" class="border-1 mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ old('website') }}">

            </div>

            <div class="flex flex-col mx-1">

                <label for="title">Photoshoot Name</label>
                <div>
                    <input name="title" class="w-full border-1 mt-1 text-gray-800 font-bold text-2xl" type="text" value="{{ old('title') }}">
                </div>

                <label for="description">Brief Description</label>
                <div>
                    <textarea data-autoresize name="description" class="w-full h-full inline border-1 mt-1 text-gray-800 font-bold text-2xl" rows="6" cols="50" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>{{ old('description') }}</textarea>
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="event_date">
                        Event Date
                    </label>
                    <input type="text" name="event_date" id="event_date" class="w-full inline border-1 mt-1 text-gray-800 font-bold text-4xl" value="{{ old('arrival_at') }}">
                </div>
            </div>

        </div>

        <i class="mt-1 text-3xl">Book Me</i>

        <div class="mt-8 self-center m-auto justify-center flex-col max-w-7xl pb-60">
            <div class="m-3 flex flex-col">
                <button
                    id="contract_agreement_button"
                    type="submit"
                    class=""
                >
                    <h2 class="self-end text-6xl mt-3 mb-3 logo-link photography hover:border-black border-2">SEND</h2>
                </button>
            </div>
        </div>
    </form>


    <script type="text/javascript">

    </script>
</x-layout>
