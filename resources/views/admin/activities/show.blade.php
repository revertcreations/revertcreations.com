<x-admin-layout>
    <div class="max-w-4xl mx-auto py-10 px-6 text-white space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-semibold">{{ $activity->headline }}</h1>
            <a href="{{ route('admin.activities.edit', $activity) }}" class="px-4 py-2 bg-blue-600 rounded">Edit</a>
        </div>

        <div class="bg-gray-900 p-6 rounded space-y-4">
            <p class="text-gray-400 text-sm">{{ optional($activity->occurred_at)->toDayDateTimeString() }}</p>
            <p class="text-gray-300 whitespace-pre-line">{{ $activity->body }}</p>
            <div class="flex flex-wrap gap-2 text-xs text-gray-400">
                @foreach (($activity->tags ?? []) as $tag)
                    <span class="px-2 py-1 bg-gray-800 rounded">#{{ $tag }}</span>
                @endforeach
                <span class="px-2 py-1 bg-gray-800 rounded">{{ $activity->public_visibility ? 'Public' : 'Private' }}</span>
            </div>
            @if ($activity->link)
                <a href="{{ $activity->link }}" target="_blank" class="text-blue-400 hover:underline">External link</a>
            @endif
        </div>
    </div>
</x-admin-layout>
