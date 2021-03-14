<x-layout>

    <form class="" id="photoshoot_form" action="{{ route('public.photoshoot.store') }}" method="POST">
        @csrf

        <i class="mt-1 bg-black text-white text-4xl">Photoshoot Inquiry</i>

        <br>

        <i class="mt-1 text-3xl">Details</i>

        <div class="m-5 self-center justify-around flex flex-col md:flex-row">


            <div class="flex flex-col">

                <label for="organization">
                    Organization
                    @error('organization')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <input
                    x-bind-contract
                    name="organization"
                    id="organization"
                    class="border-1 @error('organization') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-4xl"
                    type="text"
                    value="{{ old('organization') }}">

                <label for="first_name">
                    First Name <small class="text-red-600">*required</small>
                    @error('first_name')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <input
                    x-bind-contract
                    id="first_name"
                    name="first_name"
                    class="border-1 @error('first_name') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-4xl"
                    type="text"
                    value="{{ old('first_name') }}">

                <label for="last_name">
                    Last Name <small class="text-red-600">*required</small>
                    @error('last_name')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <input
                    x-bind-contract
                    id="last_name"
                    name="last_name"
                    class="border-1 @error('last_name') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-4xl"
                    type="text"
                    value="{{ old('last_name') }}">

                <label for="email">
                    Email <small class="text-red-600">*required</small>
                    @error('email')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <input
                    x-bind-contract
                    id="email"
                    name="email"
                    class="border-1 @error('email') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-4xl"
                    type="text"
                    value="{{ old('email') }}">

                <label for="phone">
                    Phone
                    @error('phone')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <input
                    x-bind-contract
                    id="phone"
                    name="phone"
                    class="border-1 @error('phone') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-4xl"
                    type="text"
                    value="{{ old('phone') }}">

                <label for="website">
                    Website
                    @error('website')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <input
                    name="website"
                    class="border-1 @error('website') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-4xl"
                    type="text"
                    value="{{ old('website') }}">

            </div>

            <div class="flex flex-col mx-1">

                <label for="title">
                    Photoshoot Title <small class="text-red-600">*required</small>
                    @error('title')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <input
                    name="title"
                    class="w-full border-1 @error('title') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-2xl"
                    type="text"
                    value="{{ old('title') }}">

                <label for="description">
                    Brief Description <small class="text-red-600">*required</small>
                    @error('description')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <textarea
                    data-autoresize
                    name="description"
                    class="w-full h-full border-1 inline @error('description') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-2xl"
                    rows="6"
                    cols="50"
                    oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>{{ old('description') }}</textarea>


                <label for="event_date">
                    Shoot Date / Time
                    @error('event_date')
                    <span class="bg-red-600 text-black text-center font-bold">{{ $message }}</span>
                    @enderror
                </label>
                <input
                    id="event_date"
                    x-bind-contract
                    type="text"
                    name="event_date"
                    class="w-full inline @error('event_date') border-2 border-red-600 @else border-black @enderror mt-1 font-bold text-4xl"
                    value="{{ old('event_date') }}"
                >
            </div>
        </div>

        <i class="mt-1 text-3xl">Send Request</i>

        <div class="mt-8 self-center m-auto justify-center flex-col max-w-7xl pb-60">
            <div class="m-3 flex flex-col">
                <button
                    id="contract_agreement_button"
                    type="submit"
                    class=""
                >
                    <h2 class="self-end text-6xl mt-3 mb-3 logo-link photography hover:border-black border-1">SEND</h2>
                </button>
            </div>
        </div>
    </form>


    <script type="text/javascript">

    </script>
</x-layout>
