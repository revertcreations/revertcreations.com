<?php

namespace App\View\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Address extends Component
{
    public string $countryCode;
    public ?string $stateCode;
    public Collection $countries;
    public Collection $states;
    public ?string $streetAddress;
    public ?string $streetAddress2;
    public ?string $city;
    public ?string $postalCode;

    public function __construct(
        string $countryCode = 'US',
        ?string $stateCode = null,
        ?string $streetAddress = null,
        ?string $streetAddress2 = null,
        ?string $city = null,
        ?string $postalCode = null
    ) {
        $this->countryCode = strtoupper($countryCode ?: 'US');
        $this->stateCode = $stateCode;
        $this->streetAddress = $streetAddress;
        $this->streetAddress2 = $streetAddress2;
        $this->city = $city;
        $this->postalCode = $postalCode;

        $countryList = collect(config('address.countries', []));
        if ($countryList->isEmpty()) {
            $countryList = collect(['US' => 'United States']);
        }

        $selectedCountry = $countryList->only([$this->countryCode])->filter();
        $this->countries = $selectedCountry->union($countryList);

        $stateList = collect(config("address.states.{$this->countryCode}", []));
        $this->states = $stateList->isEmpty()
            ? collect(config('address.states.US', []))
            : $stateList;
    }

    public function render()
    {
        return view('components.address');
    }
}
