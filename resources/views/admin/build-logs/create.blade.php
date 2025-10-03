<x-admin-layout>
    <div class="space-y-6">
        <x-admin.page-header
            title="New Build Log Entry"
            eyebrow="Control room journal"
        >
            <x-slot:actions>
                <a href="{{ route('admin.build-logs.index') }}" class="ghost-btn">Back to logs</a>
            </x-slot:actions>
        </x-admin.page-header>

        @if ($errors->any())
            <x-admin.flash type="error">
                <p class="font-semibold">We couldn’t save yet:</p>
                <ul class="list-disc list-inside space-y-1 text-sm text-gruvbox-light-red/90">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </x-admin.flash>
        @endif

        <div class="card-surface p-6">
            <form action="{{ route('admin.build-logs.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
                @include('admin.build-logs._form')
            </form>
        </div>
    </div>
</x-admin-layout>
