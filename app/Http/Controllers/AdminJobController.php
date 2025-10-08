<?php

namespace App\Http\Controllers;

use App\Jobs\SubmitBatchApplications;
use App\Models\JobApplication;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class AdminJobController extends Controller
{
    /**
     * Display the jobs dashboard.
     */
    public function index(Request $request)
    {
        $statusFilter = $request->query('status');
        $applicationStatus = $request->query('application_status');

        $opportunities = Opportunity::query()
            ->with('applications')
            ->when($statusFilter, fn ($query) => $query->where('status', $statusFilter))
            ->latest('last_seen_at')
            ->paginate(20)
            ->withQueryString();

        $applications = JobApplication::query()
            ->with('opportunity')
            ->when($applicationStatus, fn ($query) => $query->where('status', $applicationStatus))
            ->latest('updated_at')
            ->paginate(20, ['*'], 'applications_page')
            ->withQueryString();

        return view('admin.jobs.index', [
            'opportunities' => $opportunities,
            'applications' => $applications,
            'statusFilter' => $statusFilter,
            'applicationStatus' => $applicationStatus,
            'opportunityStatuses' => Opportunity::STATUSES,
            'applicationStatuses' => JobApplication::STATUSES,
            'bulkCandidates' => Opportunity::active()->latest('last_seen_at')->limit(50)->get(),
        ]);
    }

    /**
     * Trigger a fresh sync of remote jobs using the artisan command.
     */
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'keyword' => 'nullable|string|max:120',
            'limit' => 'nullable|integer|min:1|max:200',
            'boards' => 'nullable|array',
            'boards.*' => 'string',
        ]);

        $parameters = array_filter([
            '--keyword' => Arr::get($validated, 'keyword'),
            '--limit' => Arr::get($validated, 'limit'),
        ], fn ($value) => ! is_null($value) && $value !== '');

        foreach (Arr::get($validated, 'boards', []) as $board) {
            $parameters['--boards'][] = $board;
        }

        $parameters['--persist'] = true;

        Artisan::call('remote-jobs:collect', $parameters);

        return redirect()
            ->route('admin.jobs.index')
            ->with('status', 'Sync complete. Review the refreshed listings below.');
    }

    /**
     * Create or update a single application for an opportunity.
     */
    public function storeApplication(Request $request, Opportunity $opportunity)
    {
        $data = $request->validate([
            'status' => 'required|string|in:'.implode(',', JobApplication::STATUSES),
            'notes' => 'nullable|string',
            'follow_up_at' => 'nullable|date',
        ]);

        $application = $opportunity->applications()->firstOrNew([]);
        $application->fill($data);

        if ($application->status === JobApplication::STATUS_SUBMITTED && ! $application->applied_at) {
            $application->applied_at = Carbon::now();
        }

        $application->save();

        if ($application->status === JobApplication::STATUS_SUBMITTED) {
            $opportunity->update(['status' => Opportunity::STATUS_APPLIED]);
        } elseif ($application->status === JobApplication::STATUS_DRAFT || $application->status === JobApplication::STATUS_QUEUED) {
            $opportunity->update(['status' => Opportunity::STATUS_SHORTLISTED]);
        }

        return redirect()
            ->route('admin.jobs.index')
            ->with('status', "Application for {$opportunity->title} saved.");
    }

    /**
     * Update the status of an opportunity.
     */
    public function updateOpportunity(Request $request, Opportunity $opportunity)
    {
        $data = $request->validate([
            'status' => 'required|string|in:'.implode(',', Opportunity::STATUSES),
        ]);

        $opportunity->update($data);

        return redirect()
            ->route('admin.jobs.index', $request->only(['status', 'applications_page']))
            ->with('status', "Opportunity status set to {$data['status']}.");
    }

    /**
     * Update application status or metadata.
     */
    public function updateApplication(Request $request, JobApplication $application)
    {
        $data = $request->validate([
            'status' => 'required|string|in:'.implode(',', JobApplication::STATUSES),
            'notes' => 'nullable|string',
            'follow_up_at' => 'nullable|date',
            'applied_at' => 'nullable|date',
        ]);

        $application->fill($data);

        if ($application->status === JobApplication::STATUS_SUBMITTED && ! $application->applied_at) {
            $application->applied_at = Carbon::now();
        }

        $application->save();

        $application->opportunity?->update([
            'status' => match ($application->status) {
                JobApplication::STATUS_SUBMITTED,
                JobApplication::STATUS_RESPONSE_PENDING,
                JobApplication::STATUS_INTERVIEW,
                JobApplication::STATUS_OFFER => Opportunity::STATUS_APPLIED,
                JobApplication::STATUS_REJECTED => Opportunity::STATUS_ARCHIVED,
                default => Opportunity::STATUS_SHORTLISTED,
            },
        ]);

        return redirect()
            ->route('admin.jobs.index', ['applications_page' => $request->query('applications_page')])
            ->with('status', 'Application updated.');
    }

    /**
     * Dispatch a batch application job for selected opportunities.
     */
    public function massApply(Request $request)
    {
        $validated = $request->validate([
            'opportunity_ids' => 'required|array|min:1',
            'opportunity_ids.*' => 'exists:opportunities,id',
            'target_status' => 'required|string|in:'.implode(',', JobApplication::STATUSES),
            'notes' => 'nullable|string',
            'follow_up_at' => 'nullable|date',
        ]);

        $payload = [
            'notes' => $validated['notes'] ?? null,
            'target_status' => $validated['target_status'],
            'follow_up_at' => $validated['follow_up_at'] ?? null,
            'initiated_by' => $request->user()?->email,
        ];

        SubmitBatchApplications::dispatch($validated['opportunity_ids'], $payload);

        Log::info('Mass application dispatched by admin', [
            'opportunity_ids' => $validated['opportunity_ids'],
            'initiated_by' => $request->user()?->id,
        ]);

        return redirect()
            ->route('admin.jobs.index')
            ->with('status', 'Batch application queued. Monitor the applications panel for updates.');
    }
}
