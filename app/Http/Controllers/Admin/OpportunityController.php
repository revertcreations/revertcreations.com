<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessOpportunityIngest;
use App\Models\Opportunity;
use App\Models\OpportunityIngest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OpportunityController extends Controller
{
    public function index(Request $request)
    {
        $sort = strtolower($request->query('sort', 'updated_at'));
        $direction = strtolower($request->query('direction', 'desc')) === 'asc' ? 'asc' : 'desc';

        $query = Opportunity::query();

        $showArchived = $request->query('archived') === '1';
        if ($showArchived) {
            $query->archived();
        } else {
            $query->active();
        }

        $query->orderByDesc('is_favorite');

        switch ($sort) {
            case 'stage':
                $query->orderBy('stage', $direction);
                break;
            case 'priority':
                $orderExpression = "CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END";
                $query->orderByRaw($orderExpression . ($direction === 'desc' ? ' DESC' : ' ASC'));
                break;
            case 'fit_score':
                $query->orderBy('fit_score', $direction);
                break;
            case 'next_action_at':
                $query->orderBy('next_action_at', $direction);
                break;
            default:
                $sort = 'updated_at';
                $query->orderByDesc('updated_at');
                break;
        }

        if ($sort !== 'updated_at') {
            $query->orderByDesc('updated_at');
        }

        $opportunities = $query->paginate(20)->withQueryString();

        return view('admin.opportunities.index', [
            'opportunities' => $opportunities,
            'currentSort' => $sort,
            'currentDirection' => $direction,
            'workflowStates' => config('opportunity_pipeline.workflow_states', []),
            'showArchived' => $showArchived,
            'recentIngests' => OpportunityIngest::latest()->take(5)->get(),
        ]);
    }

    public function create()
    {
        return view('admin.opportunities.create', [
            'opportunity' => new Opportunity(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateOpportunity($request);
        Opportunity::create($data);

        return redirect()->route('admin.opportunities.index')->with('status', 'Opportunity created.');
    }

    public function show(Opportunity $opportunity)
    {
        return view('admin.opportunities.show', compact('opportunity'));
    }

    public function edit(Opportunity $opportunity)
    {
        return view('admin.opportunities.edit', compact('opportunity'));
    }

    public function update(Request $request, Opportunity $opportunity)
    {
        $data = $this->validateOpportunity($request, $opportunity);
        $opportunity->update($data);

        return redirect()->route('admin.opportunities.index')->with('status', 'Opportunity updated.');
    }

    public function destroy(Opportunity $opportunity)
    {
        $opportunity->delete();

        return redirect()->route('admin.opportunities.index')->with('status', 'Opportunity removed.');
    }

    public function updateWorkflow(Request $request, Opportunity $opportunity)
    {
        $workflowStates = array_keys(config('opportunity_pipeline.workflow_states', []));
        if (empty($workflowStates)) {
            $workflowStates = ['sourced', 'researching', 'outreach', 'interviewing', 'offer', 'rejected', 'closed'];
        }

        $data = $request->validate([
            'workflow_state' => ['required', Rule::in($workflowStates)],
            'note' => ['nullable', 'string', 'max:500'],
            'redirect' => ['nullable', 'url'],
        ]);

        $opportunity->workflow_state = $data['workflow_state'];
        $opportunity->last_action_at = now();

        if (!empty($data['note'])) {
            $timestamp = now()->format('Y-m-d H:i');
            $existing = $opportunity->notes ? ($opportunity->notes . PHP_EOL . PHP_EOL) : '';
            $opportunity->notes = $timestamp . ' — ' . trim($data['note']) . PHP_EOL . $existing;
        }

        $opportunity->save();

        $redirect = $data['redirect'] ?? $request->headers->get('referer') ?? route('admin.opportunities.index');

        return redirect($redirect)->with('status', 'Workflow updated.');
    }

    public function archive(Request $request, Opportunity $opportunity)
    {
        $opportunity->archived_at = now();
        $opportunity->public_visibility = false;
        $opportunity->save();

        return back()->with('status', 'Opportunity archived.');
    }

    public function restore(Request $request, Opportunity $opportunity)
    {
        $opportunity->archived_at = null;
        $opportunity->save();

        return back()->with('status', 'Opportunity restored.');
    }

    public function toggleFavorite(Request $request, Opportunity $opportunity)
    {
        $opportunity->is_favorite = ! $opportunity->is_favorite;
        $opportunity->save();

        $message = $opportunity->is_favorite ? 'Added to favorites.' : 'Removed from favorites.';
        return back()->with('status', $message);
    }

    public function toggleVisibility(Request $request, Opportunity $opportunity)
    {
        $opportunity->public_visibility = ! $opportunity->public_visibility;
        $opportunity->save();

        $message = $opportunity->public_visibility
            ? 'Now visible on public pipeline.'
            : 'Hidden from public pipeline.';

        $redirect = $request->input('redirect');
        if ($redirect && filter_var($redirect, FILTER_VALIDATE_URL)) {
            return redirect($redirect)->with('status', $message);
        }

        return back()->with('status', $message);
    }

    public function capture(Request $request)
    {
        $retryIngest = null;

        if ($request->filled('retry')) {
            $retryIngest = OpportunityIngest::find($request->query('retry'));
        }

        return view('admin.opportunities.capture', [
            'retryIngest' => $retryIngest,
        ]);
    }

    public function storeCapture(Request $request)
    {
        $data = $request->validate([
            'posting_url' => ['required', 'url', 'max:2048'],
            'raw_html' => ['nullable', 'string'],
            'job_text' => ['nullable', 'string'],
            'note' => ['nullable', 'string'],
            'generate_note' => ['sometimes', 'boolean'],
        ]);

        $ingest = OpportunityIngest::create([
            'source_url' => $data['posting_url'],
            'raw_html' => $data['raw_html'] ?? null,
            'raw_text' => $data['job_text'] ?? null,
            'note' => $data['note'] ?? null,
            'generate_note' => $request->boolean('generate_note'),
            'status' => 'queued',
        ]);

        return redirect()->route('admin.opportunities.index')->with('status', 'Opportunity capture queued for processing.');
    }

    private function validateOpportunity(Request $request, ?Opportunity $opportunity = null): array
    {
        $workflowStates = array_keys(config('opportunity_pipeline.workflow_states', []));
        if (empty($workflowStates)) {
            $workflowStates = ['sourced', 'researching', 'outreach', 'interviewing', 'offer', 'rejected', 'closed'];
        }

        $validated = $request->validate([
            'slug' => ['required', 'max:255', Rule::unique('opportunities', 'slug')->ignore($opportunity?->id)],
            'company_name' => ['nullable', 'max:255'],
            'industry' => ['nullable', 'max:255'],
            'role_title' => ['required', 'max:255'],
            'status' => ['required', 'max:120'],
            'workflow_state' => ['required', Rule::in($workflowStates)],
            'stage' => ['nullable', 'max:255'],
            'priority' => ['required', Rule::in(['high', 'medium', 'low'])],
            'source' => ['nullable', 'max:120'],
            'source_channel' => ['nullable', 'max:255'],
            'public_visibility' => ['sometimes', 'boolean'],
            'summary' => ['nullable'],
            'next_action_at' => ['nullable', 'date'],
            'last_action_at' => ['nullable', 'date'],
            'notes' => ['nullable'],
            'links' => ['nullable'],
            'is_remote' => ['sometimes', 'boolean'],
            'async_level' => ['nullable', 'integer', 'min:0', 'max:5'],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'min:0'],
            'salary_currency' => ['nullable', 'max:8'],
            'domain_tags' => ['nullable', 'string'],
            'fit_score' => ['nullable', 'integer', 'min:0', 'max:10'],
            'archived' => ['sometimes', 'boolean'],
            'is_favorite' => ['sometimes', 'boolean'],
        ]);

        $validated['public_visibility'] = $request->boolean('public_visibility');
        $validated['is_remote'] = $request->boolean('is_remote');
        $validated['is_favorite'] = $request->boolean('is_favorite');
        $validated['last_action_at'] = $validated['last_action_at'] ?? null;

        $archived = $request->boolean('archived');
        if ($archived) {
            $validated['archived_at'] = $opportunity?->archived_at ?? now();
            $validated['public_visibility'] = false;
        } else {
            $validated['archived_at'] = null;
        }

        unset($validated['archived']);

        if (!empty($validated['links']) && is_string($validated['links'])) {
            $decoded = json_decode($validated['links'], true);
            $validated['links'] = $decoded ?: null;
        }

        if (!empty($validated['domain_tags'])) {
            $validated['domain_tags'] = collect(explode(',', $validated['domain_tags']))
                ->map(fn ($tag) => trim($tag))
                ->filter()
                ->values()
                ->all();
        } else {
            $validated['domain_tags'] = null;
        }

        return $validated;
    }
}
