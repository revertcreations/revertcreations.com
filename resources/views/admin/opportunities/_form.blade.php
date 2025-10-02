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

@php($workflowStates = config('opportunity_pipeline.workflow_states', []))

<div class="grid md:grid-cols-2 gap-6">
    <div>
        <label class="{{ $labelClass }}" for="slug">Slug</label>
        <input id="slug" name="slug" type="text" value="{{ old('slug', $opportunity->slug) }}" class="{{ $inputClass }}">
        @error('slug')<span class="{{ $errorClass }}">{{ $message }}</span>@enderror
    </div>
    <div>
        <label class="{{ $labelClass }}" for="role_title">Role Title</label>
        <input id="role_title" name="role_title" type="text" value="{{ old('role_title', $opportunity->role_title) }}" class="{{ $inputClass }}">
        @error('role_title')<span class="{{ $errorClass }}">{{ $message }}</span>@enderror
    </div>

    <div>
        <label class="{{ $labelClass }}" for="company_name">Company</label>
        <input id="company_name" name="company_name" type="text" value="{{ old('company_name', $opportunity->company_name) }}" class="{{ $inputClass }}">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="industry">Industry</label>
        <input id="industry" name="industry" type="text" value="{{ old('industry', $opportunity->industry) }}" class="{{ $inputClass }}">
    </div>

    <div>
        <label class="{{ $labelClass }}" for="status">Status</label>
        <input id="status" name="status" type="text" value="{{ old('status', $opportunity->status) }}" class="{{ $inputClass }}" placeholder="e.g. open, paused, closed">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="workflow_state">Workflow</label>
        <select id="workflow_state" name="workflow_state" class="{{ $inputClass }}">
            @foreach ($workflowStates as $value => $label)
                <option value="{{ $value }}" @selected(old('workflow_state', $opportunity->workflow_state ?? 'sourced') === $value)>{{ $label }}</option>
            @endforeach
        </select>
    </div>
    <div>
        <label class="{{ $labelClass }}" for="stage">Stage</label>
        <input id="stage" name="stage" type="text" value="{{ old('stage', $opportunity->stage) }}" class="{{ $inputClass }}">
    </div>

    <div>
        <label class="{{ $labelClass }}" for="source">Source</label>
        <input id="source" name="source" type="text" value="{{ old('source', $opportunity->source) }}" class="{{ $inputClass }}" placeholder="e.g. agent-scraped, referral, manual">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="source_channel">Source Channel</label>
        <input id="source_channel" name="source_channel" type="text" value="{{ old('source_channel', $opportunity->source_channel) }}" class="{{ $inputClass }}" placeholder="e.g. Greenhouse API, LinkedIn alert">
    </div>

    <div>
        <label class="{{ $labelClass }}" for="priority">Priority</label>
        <select id="priority" name="priority" class="{{ $inputClass }}">
            @foreach (['high', 'medium', 'low'] as $priority)
                <option value="{{ $priority }}" @selected(old('priority', $opportunity->priority ?? 'medium') === $priority)>
                    {{ ucfirst($priority) }}
                </option>
            @endforeach
        </select>
    </div>
    <div>
        <label class="{{ $labelClass }}" for="next_action_at">Next Action</label>
        <input id="next_action_at" name="next_action_at" type="datetime-local" value="{{ old('next_action_at', optional($opportunity->next_action_at)->format('Y-m-d\TH:i')) }}" class="{{ $inputClass }}">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="last_action_at">Last Action</label>
        <input id="last_action_at" name="last_action_at" type="datetime-local" value="{{ old('last_action_at', optional($opportunity->last_action_at)->format('Y-m-d\TH:i')) }}" class="{{ $inputClass }}">
    </div>
</div>

<div class="mt-6">
    <label class="{{ $labelClass }}" for="summary">Summary</label>
    <textarea id="summary" name="summary" rows="3" class="{{ $inputClass }}">{{ old('summary', $opportunity->summary) }}</textarea>
</div>

<div class="mt-6">
    <label class="{{ $labelClass }}" for="notes">Notes</label>
    <textarea id="notes" name="notes" rows="4" class="{{ $inputClass }}">{{ old('notes', $opportunity->notes) }}</textarea>
</div>

<div class="mt-6">
    <label class="{{ $labelClass }}" for="links">Links (JSON)</label>
    <textarea id="links" name="links" rows="3" class="{{ $inputClass }}">{{ old('links', $opportunity->links ? json_encode($opportunity->links) : null) }}</textarea>
    <p class="{{ $helpTextClass }}">Example: {"jd": "https://...", "deck": "https://..."}</p>
</div>

<div class="mt-6 grid md:grid-cols-2 gap-6">
    <div class="flex items-center gap-3">
        <input id="public_visibility" name="public_visibility" type="checkbox" value="1" @checked(old('public_visibility', $opportunity->public_visibility ?? true)) class="{{ $checkboxClass }}">
        <label for="public_visibility" class="text-sm text-gruvbox-white/80">Visible on public pipeline</label>
    </div>
    <div class="flex items-center gap-3">
        <input id="archived" name="archived" type="checkbox" value="1" @checked(old('archived', $opportunity->archived_at ? 1 : 0)) class="{{ $checkboxClass }}">
        <label for="archived" class="text-sm text-gruvbox-white/80">Archive opportunity</label>
    </div>
    <div class="flex items-center gap-3">
        <input id="is_favorite" name="is_favorite" type="checkbox" value="1" @checked(old('is_favorite', $opportunity->is_favorite ?? false)) class="{{ $checkboxClass }}">
        <label for="is_favorite" class="text-sm text-gruvbox-white/80">Mark as favorite</label>
    </div>

    <div class="flex items-center gap-3">
        <input id="is_remote" name="is_remote" type="checkbox" value="1" @checked(old('is_remote', $opportunity->is_remote ?? false)) class="{{ $checkboxClass }}">
        <label for="is_remote" class="text-sm text-gruvbox-white/80">Remote role</label>
    </div>
    <div>
        <label class="{{ $labelClass }}" for="async_level">Async level (0-5)</label>
        <input id="async_level" name="async_level" type="number" min="0" max="5" value="{{ old('async_level', $opportunity->async_level) }}" class="{{ $inputClass }}">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="salary_min">Salary min (USD)</label>
        <input id="salary_min" name="salary_min" type="number" value="{{ old('salary_min', $opportunity->salary_min) }}" class="{{ $inputClass }}">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="salary_max">Salary max (USD)</label>
        <input id="salary_max" name="salary_max" type="number" value="{{ old('salary_max', $opportunity->salary_max) }}" class="{{ $inputClass }}">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="domain_tags">Domain tags (comma separated)</label>
        <input id="domain_tags" name="domain_tags" type="text" value="{{ old('domain_tags', $opportunity->domain_tags ? implode(', ', $opportunity->domain_tags) : '') }}" class="{{ $inputClass }}">
    </div>
    <div>
        <label class="{{ $labelClass }}" for="fit_score">Fit score (0-10)</label>
        <input id="fit_score" name="fit_score" type="number" min="0" max="10" value="{{ old('fit_score', $opportunity->fit_score) }}" class="{{ $inputClass }}">
    </div>
</div>

<div class="mt-8 flex flex-wrap gap-3">
    <button type="submit" class="primary-btn">Save Opportunity</button>
    <a href="{{ route('admin.opportunities.index') }}" class="ghost-btn">Cancel</a>
</div>
