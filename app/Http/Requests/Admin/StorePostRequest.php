<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'published' => $this->boolean('published'),
        ]);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
            'excerpt' => ['required', 'string'],
            'content' => ['nullable', 'string'],
            'content_file' => ['nullable', 'file', 'mimes:md,markdown,txt'],
            'published' => ['required', 'boolean'],
            'published_at' => ['required', 'date'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (!$this->hasFile('content_file') && !filled($this->input('content'))) {
                $validator->errors()->add('content', 'Provide markdown content or upload a markdown file.');
            }
        });
    }
}
