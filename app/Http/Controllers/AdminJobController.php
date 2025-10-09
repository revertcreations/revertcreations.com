<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobSource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
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
                $term = '%'.Str::lower($filters['search']).'%';
                return $q->where(function ($inner) use ($term) {
                    $inner->whereRaw('LOWER(title) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(company) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(summary) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(description) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(tags) LIKE ?', [$term]);
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
        $drivers = [
            'manual' => 'Manual entry',
            'indeed' => 'Indeed',
            'rss' => 'Generic RSS',
        ];

        return view('admin.jobs.create', compact('sources', 'drivers'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'job_source_id' => ['nullable', 'exists:job_sources,id', 'required_without:new_source_name'],
            'new_source_name' => ['nullable', 'string', 'max:255', 'required_without:job_source_id'],
            'new_source_slug' => ['nullable', 'string', 'max:255'],
            'new_source_driver' => ['nullable', 'string', 'max:255'],
            'new_source_base_url' => ['nullable', 'url', 'max:2048'],
            'new_source_frequency' => ['nullable', 'integer', 'min:5', 'max:10080'],
            'new_source_enabled' => ['nullable', 'boolean'],
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

        $jobSourceId = $validated['job_source_id'] ?? null;

        if (!$jobSourceId) {
            $slug = Str::slug($validated['new_source_slug'] ?? $validated['new_source_name']);
            $baseSlug = $slug ?: Str::slug($validated['new_source_name']);
            $counter = 1;
            while (JobSource::where('slug', $slug)->exists()) {
                $slug = Str::slug($baseSlug.'-'.$counter);
                $counter++;
            }

            $jobSource = JobSource::create([
                'name' => $validated['new_source_name'],
                'slug' => $slug,
                'driver' => $validated['new_source_driver'] ?? 'manual',
                'base_url' => $validated['new_source_base_url'] ?? null,
                'enabled' => $request->boolean('new_source_enabled', false),
                'frequency_minutes' => $validated['new_source_frequency'] ?? 1440,
                'filters' => null,
                'meta' => [
                    'created_via' => 'admin_manual_job',
                ],
            ]);

            $jobSourceId = $jobSource->id;
        }

        $tags = collect(explode(',', (string) ($validated['tags'] ?? '')))
            ->map(fn ($tag) => trim($tag))
            ->filter()
            ->values()
            ->all();

        JobListing::create([
            'job_source_id' => $jobSourceId,
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
            'new_source_name' => ['nullable', 'string', 'max:255'],
            'new_source_slug' => ['nullable', 'string', 'max:255'],
            'new_source_driver' => ['nullable', 'string', 'max:255'],
            'new_source_base_url' => ['nullable', 'url', 'max:2048'],
            'new_source_frequency' => ['nullable', 'integer', 'min:5', 'max:10080'],
            'new_source_enabled' => ['nullable', 'boolean'],
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

        if (empty($validated['job_source_id']) && !empty($validated['new_source_name'])) {
            $slug = Str::slug($validated['new_source_slug'] ?? $validated['new_source_name']);
            $baseSlug = $slug ?: Str::slug($validated['new_source_name']);
            $counter = 1;
            while (JobSource::where('slug', $slug)->exists()) {
                $slug = Str::slug($baseSlug.'-'.$counter);
                $counter++;
            }

            $jobSource = JobSource::create([
                'name' => $validated['new_source_name'],
                'slug' => $slug,
                'driver' => $validated['new_source_driver'] ?? 'manual',
                'base_url' => $validated['new_source_base_url'] ?? null,
                'enabled' => $request->boolean('new_source_enabled', false),
                'frequency_minutes' => $validated['new_source_frequency'] ?? 1440,
                'filters' => null,
                'meta' => [
                    'created_via' => 'admin_manual_job_update',
                ],
            ]);

            $validated['job_source_id'] = $jobSource->id;
        }

        unset(
            $validated['new_source_name'],
            $validated['new_source_slug'],
            $validated['new_source_driver'],
            $validated['new_source_base_url'],
            $validated['new_source_frequency'],
            $validated['new_source_enabled']
        );

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
