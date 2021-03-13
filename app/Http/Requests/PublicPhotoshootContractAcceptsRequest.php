<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublicPhotoshootContractAcceptsRequest extends FormRequest
{

    public function rules()
    {
        return [
            'title' => 'required|string',
            'description' => 'required|string',
            'price_per_image' => 'required|numeric|min:15',
            'delivered_images_count' => 'required|numeric|min:1',
            'arrival_at' => 'required|date',
            'event_starts' => 'required|date',
            'event_ends' => 'required|date',
            'organization' => 'nullable|string',
            'website' => 'nullable|url',
            'phone' => 'nullable|numeric',
            'email' => 'required|email',
            'first_name' => 'required',
            'last_name' => 'required',
            'street_address' => 'required|string',
            'street_address_2' => 'nullable|string',
            'postal_code' => 'required|numeric',
            'city' => 'required|string',
            'state_code' => 'required|string|size:2',
            'country_code' => 'nullable|string'
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'price_per_image' => floatval($this->price_per_image),
            'delivered_images_count' => intval($this->delivered_images_count),
            'arrival_at' => (!empty($this->arrival_at) ? date('Y-m-d H:i:s', strtotime($this->arrival_at)) : null),
            'event_starts' => (!empty($this->arrival_at) ? date('Y-m-d H:i:s', strtotime($this->event_starts)) : null),
            'event_ends' => (!empty($this->arrival_at) ? date('Y-m-d H:i:s', strtotime($this->event_ends)) : null),
            'country_code' => 'US'
        ]);
    }
}
