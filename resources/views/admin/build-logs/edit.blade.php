<x-admin-layout>
    <div class="max-w-4xl mx-auto py-10 px-6 text-white">
        <h1 class="text-3xl font-semibold mb-6">Edit Build Log Entry</h1>

        @if ($errors->any())
            <div class="mb-4 p-3 bg-red-700 rounded">
                <ul class="list-disc list-inside text-sm">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('admin.build-logs.update', $buildLog) }}" method="POST" class="space-y-6">
            @method('PUT')
            @include('admin.build-logs._form')
        </form>
    </div>
</x-admin-layout>
