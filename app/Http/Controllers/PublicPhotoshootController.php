<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublicPhotoshootContractAcceptsRequest;
use App\Models\PhotographyContract;
use App\Models\Address;
use App\Models\Client;
use App\Models\PhotographyContractAddress;
use App\Models\Photoshoot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PublicPhotoshootController extends Controller
{

    public function create()
    {
        return view('photography.photoshoot.create');
    }

    public function store(Request $request)
    {
        //do validation
        //do client stuff
        $client = Client::where('email', $request->email)->get();
        if (!isset($client->id)) {
            $client = Client::create($this->validateClient());

            if (!$client)
                return back();

            if (!empty($request->street_address)) {
                $address = Address::create([
                    'street_address' => $request->street_address,
                    'street_address_2' => $request->street_address_2,
                    'city' => $request->city,
                    'state_code' => $request->state,
                    'country_code' => $request->country,
                    'postal_code' => $request->postal_code
                ]);
            }
        }

        $photoshoot = Photoshoot::create([
            'client_id' => $client->id,
            'public_token' => Hash::make($request->client_id.config('hashing.public_token_salt').$request->title),
            'title' => $request->title,
            'description' => $request->description
        ]);


        return redirect()->route('public.photoshoot.success', compact('photoshoot'));
    }


    public function show(Photoshoot $photoshoot, $token)
    {

        if(base64_decode($token) !== $photoshoot->public_token)
        return redirect()->route('home');

        return view('photography.photoshoot.show', compact('photoshoot'));
    }

    public function edit(Photoshoot $photoshoot, $token)
    {

        if(base64_decode($token) !== $photoshoot->public_token)
        return redirect()->route('home');

        return view('photography.photoshoot.edit', compact('photoshoot'));
    }

    public function success(Photoshoot $photoshoot)
    {
        return view('photography.photoshoot.success', compact('photoshoot'));
    }

    public function accepts(PublicPhotoshootContractAcceptsRequest $request, Photoshoot $photoshoot)
    {

        $create = false;

        foreach($photoshoot->contract->getAttributes() as $key => $value)
            if($request[$key] && $request[$key] != $value)
                $create = true;

        if ($create) {
            $client_contract = PhotographyContract::create([
                'client_id' => $photoshoot->client->id,
                'photoshoot_id' => $photoshoot->id,
                'status' => 'client_approved',
                'delivered_images_count' => $request->delivered_images_count,

            ]);

            // update the previous contract
            $photoshoot->contract->update(['status' => 'inactive']);

            $photoshoot->update([
                'photography_contract_id' => $client_contract->id,
                'public_token' => Hash::make($request->client_id.config('hashing.public_token_salt').$request->title)
            ]);

        } else {
            // update the previous contract
            $photoshoot->contract->update(['status' => 'client_approved']);

            $photoshoot->update([
                'public_token' => Hash::make($request->client_id.config('hashing.public_token_salt').$request->title)
            ]);
        }

        $photoshoot->client->update($this->validateClient());

        return redirect()->route('public.photoshoot.success', ['photoshoot' => $photoshoot->id]);
    }

    protected function validateClient()
    {
        return request()->validate([
            'organization' => 'nullable|string',
            'website' => 'nullable|url',
            'phone' => 'nullable|numeric',
            'email' => 'required|email',
            'first_name' => 'required',
            'last_name' => 'required'
        ]);
    }

}
