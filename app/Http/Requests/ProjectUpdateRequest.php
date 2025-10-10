<?php

namespace App\Http\Requests;

use App\Models\Project;
use App\Models\ProjectUpdate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var ProjectUpdate|null $update */
        $update = $this->route('project_update');
        $projectFromRoute = optional($this->route('project'))->id;
        $projectId = $this->input('project_id') ?? $projectFromRoute ?? optional($update)->project_id;

        $slugRule = Rule::unique('project_updates', 'slug')
            ->where(fn ($query) => $query->where('project_id', $projectId ?? 0));

        if ($update) {
            $slugRule->ignore($update->id);
        }

        return [
            'project_id' => ['required', 'exists:projects,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', $slugRule],
            'excerpt' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:draft,published,archived'],
            'is_pinned' => ['nullable', 'boolean'],
            'author' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
