<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;

class OpportunityPipelineController extends Controller
{
    public function __invoke()
    {
        $workflowStates = config('opportunity_pipeline.workflow_states', []);

        $publicWorkflowStates = collect(config('opportunity_pipeline.public_workflow_states', array_keys($workflowStates)))
            ->filter(fn ($state) => array_key_exists($state, $workflowStates))
            ->values();

        $opportunities = Opportunity::public()
            ->publicWorkflow()
            ->pipelineOrder()
            ->get()
            ->groupBy('workflow_state');

        return view('opportunities.index', [
            'opportunitiesByWorkflow' => $opportunities,
            'workflowStates' => $workflowStates,
            'publicWorkflowStates' => $publicWorkflowStates,
        ]);
    }
}
