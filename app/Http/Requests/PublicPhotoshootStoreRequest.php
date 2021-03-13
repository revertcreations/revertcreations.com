<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublicPhotoshootStoreRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|string',
            'description' => 'required|string',
            'event_date' => 'nullable|date',
            'organization' => 'nullable|string',
            'website' => 'nullable|url',
            'phone' => 'nullable|numeric',
            'email' => 'required|email',
            'first_name' => 'required',
            'last_name' => 'required'
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'event_date' => (!empty($this->arrival_at) ? date('Y-m-d H:i:s', strtotime($this->event_starts)) : null),
        ]);
    }
}
