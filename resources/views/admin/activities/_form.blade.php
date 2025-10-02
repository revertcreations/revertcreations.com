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
    $checkboxClass = 'h-4 w-4 rounded border-gruvbox-purple/40 bg-[#2b2130] text-gruvbox-purple focus:ring-gruvbox-purple/60'
)

<div class="grid md:grid-cols-2 gap-6">
    <div>
        <label class="{{ $labelClass }}" for="headline">Headline</label>
        <input id="headline" name="headline" type="text" value="{{ old('headline', $activity->headline) }}" class="{{ $inputClass }}">
        @error('headline')<span class="{{ $errorClass }}">{{ $message }}</span>@enderror
    </div>
    <div>
        <label class="{{ $labelClass }}" for="occurred_at">Occurred At</label>
        <input id="occurred_at" name="occurred_at" type="datetime-local" value="{{ old('occurred_at', optional($activity->occurred_at)->format('Y-m-d\TH:i')) }}" class="{{ $inputClass }}">
    </div>

    <div>
        <label class="{{ $labelClass }}" for="category">Category</label>
        <input id="category" name="category" type="text" value="{{ old('category', $activity->category) }}" class="{{ $inputClass }}">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="link">Link</label>
        <input id="link" name="link" type="url" value="{{ old('link', $activity->link) }}" class="{{ $inputClass }}">
        @error('link')<span class="{{ $errorClass }}">{{ $message }}</span>@enderror
    </div>
</div>

<div class="mt-6">
    <label class="{{ $labelClass }}" for="body">Body</label>
    <textarea id="body" name="body" rows="3" class="{{ $inputClass }}">{{ old('body', $activity->body) }}</textarea>
</div>

<div class="mt-6">
    <label class="{{ $labelClass }}" for="tags">Tags (comma separated)</label>
    <input id="tags" name="tags" type="text" value="{{ old('tags', $activity->tags ? implode(', ', $activity->tags) : '') }}" class="{{ $inputClass }}">
</div>

<div class="mt-6 flex items-center gap-3">
    <input id="public_visibility" name="public_visibility" type="checkbox" value="1" @checked(old('public_visibility', $activity->public_visibility ?? true)) class="{{ $checkboxClass }}">
    <label for="public_visibility" class="text-sm text-gruvbox-white/80">Visible on public activity feed</label>
</div>

<div class="mt-8 flex flex-wrap gap-3">
    <button type="submit" class="primary-btn">Save Activity</button>
    <a href="{{ route('admin.activities.index') }}" class="ghost-btn">Cancel</a>
</div>
