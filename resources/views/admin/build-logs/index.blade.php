<x-admin-layout>
    <div class="space-y-6">
        <x-admin.page-header
            title="Build Log"
            eyebrow="Shiproom chronicle"
        >
            <x-slot:actions>
                <a href="{{ route('admin.build-logs.create') }}" class="primary-btn">New Entry</a>
            </x-slot:actions>
        </x-admin.page-header>

        @if (session('status'))
            <x-admin.flash type="success">
                {{ session('status') }}
            </x-admin.flash>
        @endif

        <div class="card-surface overflow-hidden">
            @if ($buildLogs->count())
                <div class="divide-y divide-[#2f2f2f]">
                    @foreach ($buildLogs as $log)
                        <article class="flex flex-col gap-4 p-6">
                            <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-gruvbox-gray">
                                <span>{{ optional($log->logged_at)->format('M j, Y g:i A') ?? '—' }}</span>
                                <div class="flex flex-wrap items-center gap-2">
                                    @if ($log->phase)
                                        <span class="badge bg-gruvbox-purple/25 text-gruvbox-light-purple">{{ $log->phase }}</span>
                                    @endif
                                    @if ($log->project)
                                        <span class="badge bg-gruvbox-blue/25 text-gruvbox-light-blue">{{ $log->project }}</span>
                                    @endif
                                </div>
                            </div>

                            <div class="space-y-2">
                                <h2 class="text-xl font-semibold text-gruvbox-light-yellow">{{ $log->title }}</h2>
                                @if ($log->description)
                                    <p class="text-sm text-gruvbox-white/80">{{ \Illuminate\Support\Str::limit($log->description, 200) }}</p>
                                @endif
                            </div>

                            <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-gruvbox-gray">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="badge {{ $log->public_visibility ? 'bg-gruvbox-green/25 text-gruvbox-green' : 'bg-gruvbox-red/25 text-gruvbox-light-red' }}">{{ $log->public_visibility ? 'Public' : 'Private' }}</span>
                                    @if ($log->category)
                                        <span class="badge bg-gruvbox-yellow/20 text-gruvbox-light-yellow">{{ $log->category }}</span>
                                    @endif
                                </div>
                                <div class="flex flex-wrap items-center gap-2">
                                    <a href="{{ route('admin.build-logs.show', $log) }}" class="inline-flex items-center rounded-md bg-gruvbox-purple/30 px-3 py-1 text-gruvbox-light-purple hover:bg-gruvbox-purple/40">View</a>
                                    <a href="{{ route('admin.build-logs.edit', $log) }}" class="inline-flex items-center rounded-md bg-gruvbox-green/25 px-3 py-1 text-gruvbox-green hover:bg-gruvbox-green/35">Edit</a>
                                    <form action="{{ route('admin.build-logs.destroy', $log) }}" method="POST" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="inline-flex items-center rounded-md bg-gruvbox-red/25 px-3 py-1 text-gruvbox-light-red hover:bg-gruvbox-red/35" onclick="return confirm('Delete this log entry?')">Delete</button>
                                    </form>
                                </div>
                            </div>
                        </article>
                    @endforeach
                </div>
            @else
                <p class="p-8 text-center text-sm text-gruvbox-gray">No build log entries yet.</p>
            @endif
        </div>

        <div class="mt-6 text-right">
            {{ $buildLogs->links('vendor.pagination.gruvbox') }}
        </div>
    </div>
</x-admin-layout>
