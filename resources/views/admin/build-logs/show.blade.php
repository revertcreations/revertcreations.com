<x-admin-layout>
    <div class="max-w-4xl mx-auto py-10 px-6 text-white space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-semibold">{{ $buildLog->title }}</h1>
            <a href="{{ route('admin.build-logs.edit', $buildLog) }}" class="px-4 py-2 bg-blue-600 rounded">Edit</a>
        </div>

        <div class="bg-gray-900 p-6 rounded space-y-4">
            <div class="flex gap-4 text-sm text-gray-400">
                <span>{{ optional($buildLog->logged_at)->toDayDateTimeString() }}</span>
                <span>{{ $buildLog->phase ?? '—' }}</span>
                <span>{{ $buildLog->category ?? '—' }}</span>
                <span>{{ $buildLog->public_visibility ? 'Public' : 'Private' }}</span>
            </div>
            @if ($buildLog->image_url)
                <div class="rounded border border-gray-800 bg-black/40 overflow-hidden">
                    <img src="{{ $buildLog->image_url }}" alt="{{ $buildLog->title }} image" class="w-full object-cover">
                </div>
            @endif
            <div>
                <h2 class="text-xl font-semibold mb-2">Summary</h2>
                <p class="text-gray-300 whitespace-pre-line">{{ $buildLog->description }}</p>
            </div>
            @if ($buildLog->agent_contribution)
                <div>
                    <h2 class="text-xl font-semibold mb-2">Agent Contribution</h2>
                    <p class="text-gray-300 whitespace-pre-line">{{ $buildLog->agent_contribution }}</p>
                </div>
            @endif
            @if ($buildLog->review_notes)
                <div>
                    <h2 class="text-xl font-semibold mb-2">Review Notes</h2>
                    <p class="text-gray-300 whitespace-pre-line">{{ $buildLog->review_notes }}</p>
                </div>
            @endif
            @if ($buildLog->links)
                <div>
                    <h2 class="text-xl font-semibold mb-2">Links</h2>
                    <ul class="list-disc list-inside text-blue-300">
                        @foreach ($buildLog->links as $label => $url)
                            <li><a href="{{ $url }}" target="_blank" class="underline">{{ $label }}</a></li>
                        @endforeach
                    </ul>
                </div>
            @endif
        </div>
    </div>
</x-admin-layout>
