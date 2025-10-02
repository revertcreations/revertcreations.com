<x-admin-layout>
    <div class="space-y-6">
        <x-admin.page-header
            title="Capture Opportunity"
            eyebrow="Pipeline automation"
        >
            <x-slot:actions>
                <a href="{{ route('admin.opportunities.index') }}" class="ghost-btn">Back to list</a>
            </x-slot:actions>
        </x-admin.page-header>

        @if ($errors->any())
            <x-admin.flash type="error">
                <p class="font-semibold">Please address the following issues:</p>
                <ul class="list-disc list-inside space-y-1 text-sm text-gruvbox-light-red/90">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </x-admin.flash>
        @endif

        @if (!empty($retryIngest))
            <x-admin.flash type="info">
                <p class="font-semibold">Retrying capture for {{ $retryIngest->source_url }}</p>
                <p class="text-sm">We prefilled the form with the saved HTML/text so you can requeue quickly.</p>
            </x-admin.flash>
        @endif

        <div class="card-surface p-6">
            @php(
                $inputClass = 'w-full rounded-md border border-gruvbox-purple/40 bg-[#2b2130] px-3 py-2 text-sm text-gruvbox-white placeholder:text-gruvbox-gray focus:outline-none focus:ring-2 focus:ring-gruvbox-purple/50 focus:border-gruvbox-purple/60 transition'
            )
            @php(
                $labelClass = 'block text-xs font-semibold uppercase tracking-wide text-gruvbox-gray mb-2'
            )
            @php(
                $helpTextClass = 'text-xs text-gruvbox-light-blue/70 mt-1'
            )
            @php(
                $checkboxClass = 'h-4 w-4 rounded border-gruvbox-purple/40 bg-[#2b2130] text-gruvbox-purple focus:ring-gruvbox-purple/60'
            )

            <form action="{{ route('admin.opportunities.capture.store') }}" method="POST" class="space-y-6">
                @csrf

                <div>
                    <label for="posting_url" class="{{ $labelClass }}">Job posting URL</label>
                    <input id="posting_url" name="posting_url" type="url" value="{{ old('posting_url', optional($retryIngest)->source_url) }}" class="{{ $inputClass }}" placeholder="https://…" required>
                    <p class="{{ $helpTextClass }}">We’ll respect robots.txt before fetching. If crawling is blocked, paste the HTML or text below.</p>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label for="raw_html" class="{{ $labelClass }}">Raw HTML (optional)</label>
                        <textarea id="raw_html" name="raw_html" rows="10" class="{{ $inputClass }}" placeholder="Paste page source if available">{{ old('raw_html', optional($retryIngest)->raw_html) }}</textarea>
                        <p class="{{ $helpTextClass }}">Helpful when automation can’t fetch the page directly.</p>
                    </div>
                    <div>
                        <label for="job_text" class="{{ $labelClass }}">Job text (optional)</label>
                        <textarea id="job_text" name="job_text" rows="10" class="{{ $inputClass }}" placeholder="Plain-text description">{{ old('job_text', optional($retryIngest)->raw_text) }}</textarea>
                        <p class="{{ $helpTextClass }}">Paste clean text from the posting if copying HTML is cumbersome.</p>
                    </div>
                </div>

                <div>
                    <label for="note" class="{{ $labelClass }}">Personal note (optional)</label>
                    <textarea id="note" name="note" rows="3" class="{{ $inputClass }}" placeholder="Why this looks interesting, follow-up ideas, etc.">{{ old('note', optional($retryIngest)->note) }}</textarea>
                </div>

                <div class="flex items-center gap-3">
                    <input id="generate_note" name="generate_note" type="checkbox" value="1" @checked(old('generate_note', optional($retryIngest)->generate_note)) class="{{ $checkboxClass }}">
                    <label for="generate_note" class="text-sm text-gruvbox-white/80">Ask AI to draft a quick-fit note (uses Trever’s ideal-role criteria)</label>
                </div>

                <div class="pt-4 flex flex-wrap gap-3">
                    <button type="submit" class="primary-btn">Queue Capture</button>
                    <a href="{{ route('admin.opportunities.index') }}" class="ghost-btn">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</x-admin-layout>
