<x-admin-layout>
    <div class="space-y-6">
        <x-admin.page-header
            title="New Opportunity"
            eyebrow="Pipeline command center"
        >
            <x-slot:actions>
                <a href="{{ route('admin.opportunities.index') }}" class="ghost-btn">Back to list</a>
            </x-slot:actions>
        </x-admin.page-header>

        @if ($errors->any())
            <x-admin.flash type="error">
                <p class="font-semibold">We hit a few validation issues:</p>
                <ul class="list-disc list-inside space-y-1 text-sm text-gruvbox-light-red/90">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </x-admin.flash>
        @endif

        <div class="card-surface p-6">
            <form action="{{ route('admin.opportunities.store') }}" method="POST" class="space-y-6">
                @include('admin.opportunities._form')
            </form>
        </div>
    </div>
</x-admin-layout>
