<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectAssetRequest extends FormRequest
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
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'project_update_id' => ['nullable', 'exists:project_updates,id'],
            'type' => ['required', 'string', 'in:image,video,document,link'],
            'title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'url' => ['required', 'url', 'max:2048'],
            'preview_url' => ['nullable', 'url', 'max:2048'],
            'provider' => ['nullable', 'string', 'max:255'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }
}
