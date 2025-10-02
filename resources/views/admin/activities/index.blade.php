<x-admin-layout>
    <div class="space-y-6">
        <x-admin.page-header
            title="Activity Feed"
            eyebrow="Studio operations feed"
        >
            <x-slot:actions>
                <a href="{{ route('admin.activities.create') }}" class="primary-btn">New Activity</a>
            </x-slot:actions>
        </x-admin.page-header>

        @if (session('status'))
            <x-admin.flash type="success">
                {{ session('status') }}
            </x-admin.flash>
        @endif

        <div class="card-surface overflow-hidden">
            @if ($activities->count())
                <div class="divide-y divide-[#2f2f2f]">
                    @foreach ($activities as $activity)
                        <article class="flex flex-col gap-4 p-6">
                            <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-gruvbox-gray">
                                <span>{{ optional($activity->occurred_at)->format('M j, Y g:i A') ?? '—' }}</span>
                                <span class="badge bg-gruvbox-purple/25 text-gruvbox-light-purple">{{ $activity->category ?? 'General' }}</span>
                            </div>

                            <div class="space-y-2">
                                <h2 class="text-xl font-semibold text-gruvbox-light-yellow">{{ $activity->headline }}</h2>
                                @if ($activity->body)
                                    <p class="text-sm text-gruvbox-white/80">{{ $activity->body }}</p>
                                @endif
                            </div>

                            @if (!empty($activity->tags))
                                <div class="flex flex-wrap gap-2">
                                    @foreach ($activity->tags as $tag)
                                        <span class="badge bg-gruvbox-blue/25 text-gruvbox-light-blue">#{{ $tag }}</span>
                                    @endforeach
                                </div>
                            @endif

                            <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-gruvbox-gray">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="badge {{ $activity->public_visibility ? 'bg-gruvbox-green/25 text-gruvbox-green' : 'bg-gruvbox-red/25 text-gruvbox-light-red' }}">{{ $activity->public_visibility ? 'Public' : 'Private' }}</span>
                                </div>
                                <div class="flex flex-wrap items-center gap-2">
                                    @if ($activity->link)
                                        <a href="{{ $activity->link }}" target="_blank" class="inline-flex items-center rounded-md bg-gruvbox-blue/30 px-3 py-1 text-gruvbox-light-blue hover:bg-gruvbox-blue/40">Artifact</a>
                                    @endif
                                    <a href="{{ route('admin.activities.edit', $activity) }}" class="inline-flex items-center rounded-md bg-gruvbox-green/25 px-3 py-1 text-gruvbox-green hover:bg-gruvbox-green/35">Edit</a>
                                    <form action="{{ route('admin.activities.destroy', $activity) }}" method="POST" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="inline-flex items-center rounded-md bg-gruvbox-red/25 px-3 py-1 text-gruvbox-light-red hover:bg-gruvbox-red/35" onclick="return confirm('Delete this activity?')">Delete</button>
                                    </form>
                                </div>
                            </div>
                        </article>
                    @endforeach
                </div>
            @else
                <p class="p-8 text-center text-sm text-gruvbox-gray">No activity logged yet.</p>
            @endif
        </div>

        <div class="mt-6 text-right">
            {{ $activities->links('vendor.pagination.gruvbox') }}
        </div>
    </div>
</x-admin-layout>
