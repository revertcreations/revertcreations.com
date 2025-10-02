@csrf

@php($workflowStates = config('opportunity_pipeline.workflow_states', []))

<div class="grid md:grid-cols-2 gap-6">
    <div>
        <label class="block text-sm font-medium mb-1" for="slug">Slug</label>
        <input id="slug" name="slug" type="text" value="{{ old('slug', $opportunity->slug) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
        @error('slug')<span class="text-red-400 text-sm">{{ $message }}</span>@enderror
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="role_title">Role Title</label>
        <input id="role_title" name="role_title" type="text" value="{{ old('role_title', $opportunity->role_title) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
        @error('role_title')<span class="text-red-400 text-sm">{{ $message }}</span>@enderror
    </div>

    <div>
        <label class="block text-sm font-medium mb-1" for="company_name">Company</label>
        <input id="company_name" name="company_name" type="text" value="{{ old('company_name', $opportunity->company_name) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="industry">Industry</label>
        <input id="industry" name="industry" type="text" value="{{ old('industry', $opportunity->industry) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>

    <div>
        <label class="block text-sm font-medium mb-1" for="status">Status</label>
        <input id="status" name="status" type="text" value="{{ old('status', $opportunity->status) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" placeholder="e.g. open, paused, closed">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="workflow_state">Workflow</label>
        <select id="workflow_state" name="workflow_state" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
            @foreach ($workflowStates as $value => $label)
                <option value="{{ $value }}" @selected(old('workflow_state', $opportunity->workflow_state ?? 'sourced') === $value)>{{ $label }}</option>
            @endforeach
        </select>
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="stage">Stage</label>
        <input id="stage" name="stage" type="text" value="{{ old('stage', $opportunity->stage) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>

    <div>
        <label class="block text-sm font-medium mb-1" for="source">Source</label>
        <input id="source" name="source" type="text" value="{{ old('source', $opportunity->source) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" placeholder="e.g. agent-scraped, referral, manual">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="source_channel">Source Channel</label>
        <input id="source_channel" name="source_channel" type="text" value="{{ old('source_channel', $opportunity->source_channel) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" placeholder="e.g. Greenhouse API, LinkedIn alert">
    </div>

    <div>
        <label class="block text-sm font-medium mb-1" for="priority">Priority</label>
        <select id="priority" name="priority" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
            @foreach (['high', 'medium', 'low'] as $priority)
                <option value="{{ $priority }}" @selected(old('priority', $opportunity->priority ?? 'medium') === $priority)>
                    {{ ucfirst($priority) }}
                </option>
            @endforeach
        </select>
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="next_action_at">Next Action</label>
        <input id="next_action_at" name="next_action_at" type="datetime-local" value="{{ old('next_action_at', optional($opportunity->next_action_at)->format('Y-m-d\TH:i')) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="last_action_at">Last Action</label>
        <input id="last_action_at" name="last_action_at" type="datetime-local" value="{{ old('last_action_at', optional($opportunity->last_action_at)->format('Y-m-d\TH:i')) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
</div>

<div class="mt-6">
    <label class="block text-sm font-medium mb-1" for="summary">Summary</label>
    <textarea id="summary" name="summary" rows="3" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">{{ old('summary', $opportunity->summary) }}</textarea>
</div>

<div class="mt-6">
    <label class="block text-sm font-medium mb-1" for="notes">Notes</label>
    <textarea id="notes" name="notes" rows="4" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">{{ old('notes', $opportunity->notes) }}</textarea>
</div>

<div class="mt-6">
    <label class="block text-sm font-medium mb-1" for="links">Links (JSON)</label>
    <textarea id="links" name="links" rows="3" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">{{ old('links', $opportunity->links ? json_encode($opportunity->links) : null) }}</textarea>
    <p class="text-xs text-gray-400 mt-1">Example: {"jd": "https://...", "deck": "https://..."}</p>
</div>

<div class="mt-6 grid md:grid-cols-2 gap-6">
    <div class="flex items-center space-x-3">
        <input id="public_visibility" name="public_visibility" type="checkbox" value="1" @checked(old('public_visibility', $opportunity->public_visibility ?? true))>
        <label for="public_visibility" class="text-sm">Visible on public pipeline</label>
    </div>
    <div class="flex items-center space-x-3">
        <input id="archived" name="archived" type="checkbox" value="1" @checked(old('archived', $opportunity->archived_at ? 1 : 0))>
        <label for="archived" class="text-sm">Archive opportunity</label>
    </div>
    <div class="flex items-center space-x-3">
        <input id="is_favorite" name="is_favorite" type="checkbox" value="1" @checked(old('is_favorite', $opportunity->is_favorite ?? false))>
        <label for="is_favorite" class="text-sm">Mark as favorite</label>
    </div>

    <div class="flex items-center space-x-3">
        <input id="is_remote" name="is_remote" type="checkbox" value="1" @checked(old('is_remote', $opportunity->is_remote ?? false))>
        <label for="is_remote" class="text-sm">Remote role</label>
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="async_level">Async level (0-5)</label>
        <input id="async_level" name="async_level" type="number" min="0" max="5" value="{{ old('async_level', $opportunity->async_level) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="salary_min">Salary min (USD)</label>
        <input id="salary_min" name="salary_min" type="number" value="{{ old('salary_min', $opportunity->salary_min) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="salary_max">Salary max (USD)</label>
        <input id="salary_max" name="salary_max" type="number" value="{{ old('salary_max', $opportunity->salary_max) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="domain_tags">Domain tags (comma separated)</label>
        <input id="domain_tags" name="domain_tags" type="text" value="{{ old('domain_tags', $opportunity->domain_tags ? implode(', ', $opportunity->domain_tags) : '') }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="fit_score">Fit score (0-10)</label>
        <input id="fit_score" name="fit_score" type="number" min="0" max="10" value="{{ old('fit_score', $opportunity->fit_score) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
</div>

<div class="mt-8">
    <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded">Save</button>
    <a href="{{ route('admin.opportunities.index') }}" class="ml-3 text-gray-300 hover:underline">Cancel</a>
</div>
