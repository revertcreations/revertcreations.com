<x-admin-layout>
    <div class="space-y-6">
        <x-admin.page-header
            title="New Activity"
            eyebrow="Operations timeline"
        >
            <x-slot:actions>
                <a href="{{ route('admin.activities.index') }}" class="ghost-btn">Back to feed</a>
            </x-slot:actions>
        </x-admin.page-header>

        @if ($errors->any())
            <x-admin.flash type="error">
                <p class="font-semibold">Please resolve these fields:</p>
                <ul class="list-disc list-inside space-y-1 text-sm text-gruvbox-light-red/90">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </x-admin.flash>
        @endif

        <div class="card-surface p-6">
            <form action="{{ route('admin.activities.store') }}" method="POST" class="space-y-6">
                @include('admin.activities._form')
            </form>
        </div>
    </div>
</x-admin-layout>
