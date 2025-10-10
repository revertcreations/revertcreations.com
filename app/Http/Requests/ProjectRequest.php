<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
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
        $projectId = optional($this->route('project'))->id;

        $statuses = implode(',', [
            Project::STATUS_PLANNING,
            Project::STATUS_IN_PROGRESS,
            Project::STATUS_LAUNCHED,
            Project::STATUS_MAINTENANCE,
            Project::STATUS_ARCHIVED,
        ]);

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::unique('projects', 'slug')->ignore($projectId)],
            'tagline' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:'.$statuses],
            'hero_image_url' => ['nullable', 'url', 'max:2048'],
            'hero_video_url' => ['nullable', 'url', 'max:2048'],
            'primary_link_label' => ['nullable', 'string', 'max:255'],
            'primary_link_url' => ['nullable', 'url', 'max:2048'],
            'links' => ['nullable', 'string'],
            'tech_stack' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'is_featured' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'links.string' => 'Links should be provided as newline separated entries.',
            'tech_stack.string' => 'Tech stack should be provided as a comma separated list.',
        ];
    }
}
