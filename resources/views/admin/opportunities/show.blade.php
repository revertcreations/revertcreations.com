<x-admin-layout>
    <div class="max-w-4xl mx-auto py-10 px-6 text-white space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-semibold">{{ $opportunity->role_title }}</h1>
            <a href="{{ route('admin.opportunities.edit', $opportunity) }}" class="px-4 py-2 bg-blue-600 rounded">Edit</a>
        </div>
        <dl class="grid md:grid-cols-2 gap-4 bg-gray-900 p-6 rounded">
            <div>
                <dt class="text-sm text-gray-400">Company</dt>
                <dd class="text-lg">{{ $opportunity->company_name ?? 'Confidential' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Priority</dt>
                <dd class="text-lg capitalize">{{ $opportunity->priority }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Stage</dt>
                <dd class="text-lg">{{ $opportunity->stage ?? '—' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Status</dt>
                <dd class="text-lg">{{ $opportunity->status }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Source</dt>
                <dd class="text-lg">{{ $opportunity->source ?? '—' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Source Channel</dt>
                <dd class="text-lg">{{ $opportunity->source_channel ?? '—' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Next Action</dt>
                <dd class="text-lg">{{ optional($opportunity->next_action_at)->toDayDateTimeString() ?? '—' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Visible Publicly</dt>
                <dd class="text-lg">{{ $opportunity->public_visibility ? 'Yes' : 'No' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Remote</dt>
                <dd class="text-lg">{{ $opportunity->is_remote ? 'Yes' : 'No' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Async Level</dt>
                <dd class="text-lg">{{ $opportunity->async_level ?? '—' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Salary Range</dt>
                <dd class="text-lg">
                    @if ($opportunity->salary_min)
                        {{ $opportunity->salary_currency ?? 'USD' }} {{ number_format($opportunity->salary_min) }}
                        @if ($opportunity->salary_max)
                            – {{ number_format($opportunity->salary_max) }}
                        @endif
                    @else
                        —
                    @endif
                </dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Fit score</dt>
                <dd class="text-lg">{{ $opportunity->fit_score ?? '—' }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Domain tags</dt>
                <dd class="text-lg">{{ $opportunity->domain_tags ? implode(', ', $opportunity->domain_tags) : '—' }}</dd>
            </div>
        </dl>
        <div class="bg-gray-900 p-6 rounded">
            <h2 class="text-xl font-semibold mb-2">Summary</h2>
            <p class="text-gray-300 whitespace-pre-line">{{ $opportunity->summary ?? '—' }}</p>
        </div>
        <div class="bg-gray-900 p-6 rounded">
            <h2 class="text-xl font-semibold mb-2">Notes</h2>
            <p class="text-gray-300 whitespace-pre-line">{{ $opportunity->notes ?? '—' }}</p>
        </div>
        @if ($opportunity->links)
            <div class="bg-gray-900 p-6 rounded">
                <h2 class="text-xl font-semibold mb-2">Links</h2>
                <ul class="list-disc list-inside text-gray-300">
                    @foreach ($opportunity->links as $label => $url)
                        <li><a href="{{ $url }}" target="_blank" class="text-blue-400 underline">{{ $label }}</a></li>
                    @endforeach
                </ul>
            </div>
        @endif
    </div>
</x-admin-layout>
