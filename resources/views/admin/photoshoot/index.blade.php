<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Photoshoots
          </h1>
          <a class="text-gray-300 bg-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium self-end" href="{{ route('photoshoot.create') }}">
            Create
          </a>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

            <!-- This example requires Tailwind CSS v2.0+ -->
            <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" class="relative px-6 py-3">
                                            <span class="sr-only">Edit</span>
                                        </th>

                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">

                                    @forelse($photoshoots as $photoshoot)
                                    <tr class="odd:bg-white even:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ $photoshoot->title }}</div>
                                            <div class="text-sm text-gray-700">{{ $photoshoot->client->orginazation }}</div>
                                        </td>

                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ (strlen($photoshoot->description) > 50 ? substr($photoshoot->description, 0, 50).'...' : $photoshoot->description) }}</div>
                                        </td>

                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {{ $photoshoot->status }}
                                            </span>
                                        </td>

                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a target="_blank" href="{{ route('public.photoshoot.edit', ['photoshoot' => $photoshoot->id, 'token' => base64_encode($photoshoot->public_token)]) }}" class="text-indigo-600 hover:text-indigo-900">Preview</a>
                                        </td>

                                        @if($photoshoot->contract->status == 'client_pending')
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a target="_blank" href="{{ route('admin.contract.email', ['contract' => $photoshoot->id]) }}" onclick="event.preventDefault(); document.getElementById('submit-form-{{ $photoshoot->id }}').submit();" class="text-indigo-600 hover:text-indigo-900">Email</a>
                                        </td>

                                        <form id="submit-form-{{ $photoshoot->id }}" action="{{ route('admin.contract.email', ['contract' => $photoshoot->contract->id]) }}" method="POST" class="hidden">
                                            @csrf
                                        </form>
                                        @elseif($photoshoot->status == 'approved')
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a target="_blank" href="{{ route('photoshoot.edit', ['photoshoot' => $photoshoot->id]) }}" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                                        </td>

                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a target="_blank" href="{{ route('admin.photoshoot.email', ['photoshoot' => $photoshoot->id]) }}" onclick="event.preventDefault(); document.getElementById('submit-form-{{ $photoshoot->id }}').submit();" class="text-indigo-600 hover:text-indigo-900">Email</a>
                                        </td>

                                        <form id="submit-form-{{ $photoshoot->id }}" action="{{ route('admin.photoshoot.email', ['photoshoot' => $photoshoot->id]) }}" method="POST" class="hidden">
                                            @csrf
                                        </form>
                                        @endif

                                    </tr>
                                    @empty
                                    <tr>
                                        <h1>You better go get some of these!</h1>
                                    </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </main>

</x-admin-layout>
