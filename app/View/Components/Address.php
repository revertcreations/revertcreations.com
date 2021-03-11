<?php

namespace App\View\Components;

use CommerceGuys\Addressing\AddressFormat\AddressFormatRepository;
use CommerceGuys\Addressing\Country\CountryRepository;
use CommerceGuys\Addressing\Subdivision\SubdivisionRepository;
use Illuminate\View\Component;

class Address extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */

    public $countryCode;
    public $countries;
    public $states;

    public function __construct($countryCode='US', $countries=[], $states=[])
    {
        $this->countryCode = $countryCode;
        $this->states = collect();
        $this->countries = collect();

        $countryRepository = new CountryRepository();
        $addressFormatRepository = new AddressFormatRepository();
        $subdivisionRepository = new SubdivisionRepository();

        $countryListUnordered = collect($countryRepository->getList('en'));
        $countryListUnordered->each(function ($item, $key) {
            if($key == $this->countryCode)
                $this->countries->prepend($item);
            else
                $this->countries->push($item);
        });

        $statesCollectionUnordered = collect($subdivisionRepository->getAll([$countryCode]));
        $this->states = collect([]);
        $statesCollectionUnordered->each(function ($item, $key) {
                $this->states->put($item->getCode(), $item->getName());
        });

    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('components.address');
    }
}
