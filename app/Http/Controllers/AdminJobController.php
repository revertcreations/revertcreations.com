<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobSource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

class AdminJobController extends Controller
{
    public function index(Request $request): View
    {
        $filters = [
            'status' => $request->string('status')->toString() ?: 'new',
            'source' => $request->string('source')->toString(),
            'search' => $request->string('search')->toString(),
            'match' => $request->float('match', null),
            'archived' => $request->boolean('archived', false),
        ];

        $allowedSorts = ['title', 'company', 'match_score', 'status', 'posted_at'];
        $sort = $request->string('sort')->toString();
        $filters['sort'] = in_array($sort, $allowedSorts, true) ? $sort : 'match_score';

        $direction = strtolower($request->string('direction')->toString() ?? '');
        $filters['direction'] = in_array($direction, ['asc', 'desc'], true)
            ? $direction
            : ($filters['sort'] === 'match_score' ? 'desc' : 'desc');

        $query = JobListing::query()
            ->with('jobSource')
            ->when(!$filters['archived'], fn ($q) => $q->where('is_archived', false))
            ->when($filters['status'] && $filters['status'] !== 'all', function ($q) use ($filters) {
                return $q->where('status', $filters['status']);
            })
            ->when($filters['source'], function ($q) use ($filters) {
                return $q->whereHas('jobSource', function ($relation) use ($filters) {
                    $relation->where('slug', $filters['source']);
                });
            })
            ->when($filters['search'], function ($q) use ($filters) {
                return $q->where(function ($inner) use ($filters) {
                    $inner->where('title', 'like', '%'.$filters['search'].'%')
                        ->orWhere('company', 'like', '%'.$filters['search'].'%');
                });
            })
            ->when(!is_null($filters['match']), function ($q) use ($filters) {
                return $q->where('match_score', '>=', $filters['match']);
            })
        ;

        switch ($filters['sort']) {
            case 'title':
                $query->orderBy('title', $filters['direction']);
                break;
            case 'company':
                $query->orderBy('company', $filters['direction']);
                break;
            case 'match_score':
                $query->orderBy('match_score', $filters['direction']);
                break;
            case 'status':
                $query->orderBy('status', $filters['direction']);
                break;
            case 'posted_at':
            default:
                $query->orderBy('posted_at', $filters['direction']);
                break;
        }

        $query->orderBy('collected_at', 'desc')->orderBy('created_at', 'desc');

        $jobs = $query->paginate(20)->withQueryString();

        $sources = JobSource::query()->orderBy('name')->get();

        $statusOptions = [
            'all' => 'All',
            JobListing::STATUS_NEW => 'New',
            JobListing::STATUS_INTERESTED => 'Interested',
            JobListing::STATUS_APPLIED => 'Applied',
            JobListing::STATUS_INTERVIEWING => 'Interviewing',
            JobListing::STATUS_DENIED => 'Denied',
            JobListing::STATUS_ACCEPTED => 'Accepted',
            JobListing::STATUS_ARCHIVED => 'Archived',
        ];

        return view('admin.jobs.index', compact('jobs', 'sources', 'filters', 'statusOptions'));
    }

    public function create(): View
    {
        $sources = JobSource::query()->orderBy('name')->pluck('name', 'id');

        return view('admin.jobs.create', compact('sources'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'job_source_id' => ['required', 'exists:job_sources,id'],
            'title' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_remote' => ['nullable', 'boolean'],
            'employment_type' => ['nullable', 'string', 'max:255'],
            'source_url' => ['required', 'url', 'max:2048'],
            'apply_url' => ['nullable', 'url', 'max:2048'],
            'summary' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'tags' => ['nullable', 'string'],
            'match_score' => ['nullable', 'numeric', 'between:0,100'],
            'posted_at' => ['nullable', 'date'],
            'applied_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:'.implode(',', [
                JobListing::STATUS_NEW,
                JobListing::STATUS_INTERESTED,
                JobListing::STATUS_APPLIED,
                JobListing::STATUS_INTERVIEWING,
                JobListing::STATUS_DENIED,
                JobListing::STATUS_ACCEPTED,
                JobListing::STATUS_ARCHIVED,
            ])],
        ]);

        $tags = collect(explode(',', (string) ($validated['tags'] ?? '')))
            ->map(fn ($tag) => trim($tag))
            ->filter()
            ->values()
            ->all();

        JobListing::create([
            'job_source_id' => $validated['job_source_id'],
            'external_id' => md5($validated['source_url']),
            'title' => $validated['title'],
            'company' => $validated['company'] ?? null,
            'location' => $validated['location'] ?? null,
            'is_remote' => $request->boolean('is_remote', true),
            'employment_type' => $validated['employment_type'] ?? null,
            'source_url' => $validated['source_url'],
            'apply_url' => $validated['apply_url'] ?? null,
            'summary' => $validated['summary'] ?? null,
            'description' => $validated['description'] ?? null,
            'tags' => $tags,
            'match_score' => $validated['match_score'] ?? null,
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
            'posted_at' => isset($validated['posted_at']) ? Carbon::parse($validated['posted_at']) : null,
            'applied_at' => isset($validated['applied_at']) ? Carbon::parse($validated['applied_at']) : null,
            'collected_at' => now(),
        ]);

        return redirect()->route('jobs.index')->with('status', 'Job created.');
    }

    public function show(JobListing $job): View
    {
        $job->load('jobSource');

        $statusOptions = [
            JobListing::STATUS_NEW => 'New',
            JobListing::STATUS_INTERESTED => 'Interested',
            JobListing::STATUS_APPLIED => 'Applied',
            JobListing::STATUS_INTERVIEWING => 'Interviewing',
            JobListing::STATUS_DENIED => 'Denied',
            JobListing::STATUS_ACCEPTED => 'Accepted',
            JobListing::STATUS_ARCHIVED => 'Archived',
        ];

        return view('admin.jobs.show', compact('job', 'statusOptions'));
    }

    public function edit(JobListing $job): View
    {
        $job->load('jobSource');
        $sources = JobSource::query()->orderBy('name')->pluck('name', 'id');

        $statusOptions = [
            JobListing::STATUS_NEW => 'New',
            JobListing::STATUS_INTERESTED => 'Interested',
            JobListing::STATUS_APPLIED => 'Applied',
            JobListing::STATUS_INTERVIEWING => 'Interviewing',
            JobListing::STATUS_DENIED => 'Denied',
            JobListing::STATUS_ACCEPTED => 'Accepted',
            JobListing::STATUS_ARCHIVED => 'Archived',
        ];

        return view('admin.jobs.edit', compact('job', 'sources', 'statusOptions'));
    }

    public function update(Request $request, JobListing $job): RedirectResponse
    {
        $validated = $request->validate([
            'job_source_id' => ['sometimes', 'exists:job_sources,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_remote' => ['nullable', 'boolean'],
            'employment_type' => ['nullable', 'string', 'max:255'],
            'source_url' => ['sometimes', 'url', 'max:2048'],
            'apply_url' => ['nullable', 'url', 'max:2048'],
            'summary' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'tags' => ['nullable', 'string'],
            'match_score' => ['nullable', 'numeric', 'between:0,100'],
            'posted_at' => ['nullable', 'date'],
            'status' => ['required', 'string', 'in:'.implode(',', [
                JobListing::STATUS_NEW,
                JobListing::STATUS_INTERESTED,
                JobListing::STATUS_APPLIED,
                JobListing::STATUS_INTERVIEWING,
                JobListing::STATUS_DENIED,
                JobListing::STATUS_ACCEPTED,
                JobListing::STATUS_ARCHIVED,
            ])],
            'notes' => ['nullable', 'string'],
            'applied_at' => ['nullable', 'date'],
            'is_archived' => ['nullable', 'boolean'],
        ]);

        if (isset($validated['tags'])) {
            $validated['tags'] = collect(explode(',', $validated['tags']))
                ->map(fn ($tag) => trim($tag))
                ->filter()
                ->values()
                ->all();
        }

        if (array_key_exists('is_remote', $validated)) {
            $validated['is_remote'] = (bool) $validated['is_remote'];
        }

        if (array_key_exists('is_archived', $validated)) {
            $validated['is_archived'] = (bool) $validated['is_archived'];
        }

        if (isset($validated['applied_at'])) {
            $validated['applied_at'] = $validated['applied_at']
                ? Carbon::parse($validated['applied_at'])
                : null;
        }

        if (isset($validated['posted_at'])) {
            $validated['posted_at'] = $validated['posted_at']
                ? Carbon::parse($validated['posted_at'])
                : null;
        }

        $job->fill($validated);
        $job->save();

        return redirect()->route('jobs.show', $job)->with('status', 'Job updated.');
    }

    public function destroy(JobListing $job): RedirectResponse
    {
        $job->update([
            'is_archived' => true,
            'status' => JobListing::STATUS_ARCHIVED,
        ]);

        return redirect()->route('jobs.index')->with('status', 'Job archived.');
    }
}
