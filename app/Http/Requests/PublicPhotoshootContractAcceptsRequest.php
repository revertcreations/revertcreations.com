<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublicPhotoshootContractAcceptsRequest extends FormRequest
{

    public function rules()
    {
        return [
            'price_per_image' => 'required|numeric',
            'delivered_images_count' => 'required|numeric',
            'arrival_at' => 'required|date',
            'event_starts' => 'required|date',
            'event_ends' => 'required|date',
            'organization' => 'nullable|string',
            'website' => 'nullable|url',
            'phone' => 'nullable|numeric',
            'email' => 'required|email',
            'first_name' => 'required',
            'last_name' => 'required',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'price_per_image' => floatval($this->price_per_image),
            'delivered_images_count' => intval($this->delivered_images_count),
            'arrival_at' => date('Y-m-d H:i:s', strtotime($this->arrival_at)),
            'event_starts' => date('Y-m-d H:i:s', strtotime($this->event_starts)),
            'event_ends' => date('Y-m-d H:i:s', strtotime($this->event_ends))
        ]);
    }
}
