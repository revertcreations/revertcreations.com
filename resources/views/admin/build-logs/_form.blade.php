@csrf

@php(
    $inputClass = 'w-full rounded-md border border-gruvbox-purple/40 bg-[#2b2130] px-3 py-2 text-sm text-gruvbox-white placeholder:text-gruvbox-gray focus:outline-none focus:ring-2 focus:ring-gruvbox-purple/50 focus:border-gruvbox-purple/60 transition'
)
@php(
    $labelClass = 'block text-xs font-semibold uppercase tracking-wide text-gruvbox-gray mb-2'
)
@php(
    $errorClass = 'mt-1 text-sm text-gruvbox-light-red'
)
@php(
    $helpTextClass = 'text-xs text-gruvbox-light-blue/70 mt-1'
)
@php(
    $checkboxClass = 'h-4 w-4 rounded border-gruvbox-purple/40 bg-[#2b2130] text-gruvbox-purple focus:ring-gruvbox-purple/60'
)

<div class="grid md:grid-cols-2 gap-6">
    <div>
        <label class="{{ $labelClass }}" for="title">Title</label>
        <input id="title" name="title" type="text" value="{{ old('title', $buildLog->title) }}" class="{{ $inputClass }}">
        @error('title')<span class="{{ $errorClass }}">{{ $message }}</span>@enderror
    </div>
    <div>
        <label class="{{ $labelClass }}" for="logged_at">Logged At</label>
        <input id="logged_at" name="logged_at" type="datetime-local" value="{{ old('logged_at', optional($buildLog->logged_at)->format('Y-m-d\TH:i')) }}" class="{{ $inputClass }}">
    </div>

    <div>
        <label class="{{ $labelClass }}" for="phase">Phase</label>
        <input id="phase" name="phase" type="text" value="{{ old('phase', $buildLog->phase) }}" class="{{ $inputClass }}">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="category">Category</label>
        <input id="category" name="category" type="text" value="{{ old('category', $buildLog->category) }}" class="{{ $inputClass }}">
    </div>
</div>

<div class="mt-6">
    <label class="{{ $labelClass }}" for="description">Description</label>
    <textarea id="description" name="description" rows="3" class="{{ $inputClass }}">{{ old('description', $buildLog->description) }}</textarea>
</div>

<div class="mt-6 grid md:grid-cols-2 gap-6">
    <div>
        <label class="{{ $labelClass }}" for="agent_contribution">Agent Contribution</label>
        <textarea id="agent_contribution" name="agent_contribution" rows="3" class="{{ $inputClass }}">{{ old('agent_contribution', $buildLog->agent_contribution) }}</textarea>
    </div>
    <div>
        <label class="{{ $labelClass }}" for="review_notes">Review Notes</label>
        <textarea id="review_notes" name="review_notes" rows="3" class="{{ $inputClass }}">{{ old('review_notes', $buildLog->review_notes) }}</textarea>
    </div>
</div>

<div class="mt-6">
    <label class="{{ $labelClass }}" for="links">Links (JSON)</label>
    <textarea id="links" name="links" rows="3" class="{{ $inputClass }}">{{ old('links', $buildLog->links ? json_encode($buildLog->links) : null) }}</textarea>
    <p class="{{ $helpTextClass }}">Example: {"loom": "https://...", "figma": "https://..."}</p>
</div>

<div class="mt-6 flex items-center gap-3">
    <input id="public_visibility" name="public_visibility" type="checkbox" value="1" @checked(old('public_visibility', $buildLog->public_visibility ?? true)) class="{{ $checkboxClass }}">
    <label for="public_visibility" class="text-sm text-gruvbox-white/80">Visible on public build log</label>
</div>

<div class="mt-8 flex flex-wrap gap-3">
    <button type="submit" class="primary-btn">Save Build Log</button>
    <a href="{{ route('admin.build-logs.index') }}" class="ghost-btn">Cancel</a>
</div>
