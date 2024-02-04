<x-layout>

    <div class="m-auto lg:w-5/12 md:w-7/12 w-11/12">

        <form id="hire_me_form" action="{{ route('hire-me') }}" method="POST" class="flex flex-col m-8">
            @csrf
            <p class="text-gruvbox-white mb-4">
                First of all, I'm very excited to hear that you are interested
                in working with me! I love hearing new project ideas, so go
                ahead and fill out the form below with your contact info, and
                a brief overview of the project in mind, and I will get back to
                you asap!
            </p>
            <label for="email">Email</label>
            <input name="email" type="email" placeholder="foo@example.com" class="p-4 m-4">

            <label for="organization">Organization</label>
            <input name="name" type="text" placeholder="Organization" class="p-4 m-4">

            <label for="first_name">First Name</label>
            <input name="first_name" type="text" placeholder="First Name" class="p-4 m-4">

            <label for="last_name">Last Name</label>
            <input name="last_name" type="text" placeholder="Last Name" class="p-4 m-4">

            <label>Phone Number</label>
            <input name="tel" type="tel" placeholder="123-456-7890" class="p-4 m-4">

            <label for="description">Description</label>
            <textarea name="description" placeholder="Description" class="p-4 m-4"></textarea>
        </form>

        <button type="button" class="hover:bg-gruvbox-purple bg-gruvbox-green text-gruvbox-black text-2xl font-bold p-4 mt-4 mb-4">Submit</button>
    </div>

</x-layout>
