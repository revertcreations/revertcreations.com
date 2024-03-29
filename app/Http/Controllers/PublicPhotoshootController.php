<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublicPhotoshootContractAcceptsRequest;
use App\Http\Requests\PublicPhotoshootStoreRequest;
use App\Models\PhotographyContract;
use App\Models\Address;
use App\Models\AddressClient;
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

    public function store(PublicPhotoshootStoreRequest $request)
    {
        //do validation
        $validated = $request->validated();

        // dd($validated);
        //do client stuff
        $client = Client::where('email', $request->email)->get();
        if (!isset($client->id)) {
            $client = Client::create($this->validatedClient($validated));

            if (!$client)
                return back();
        }

        $validated['client_id'] = $client->id;
        $photoshoot = Photoshoot::create($this->validatedPhotoshoot($validated));

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

        $validated = $request->validated();

        $client_updated = false;
        foreach($photoshoot->contract->getAttributes() as $key => $value)
            if($request[$key] && $request[$key] != $value)
                $client_updated = true;

        if ($client_updated) {
            $client_contract = PhotographyContract::create([
                'client_id' => $photoshoot->client->id,
                'photoshoot_id' => $photoshoot->id,
                'status' => 'admin_pending',
                'delivered_images_count' => $validated['delivered_images_count'],
                'price_per_image' => $validated['price_per_image'],
                'event_starts' => $validated['event_starts'],
                'event_ends' => $validated['event_ends'],
                'arrival_at' => $validated['arrival_at'],
            ]);

            // update the previous contract
            $photoshoot->contract->update(['status' => 'inactive']);

            $photoshoot->update([
                'photography_contract_id' => $client_contract->id,
                'title' => $validated['title'],
                'description' => $validated['description']
            ]);

        } else {
            // update the previous contract
            $photoshoot->contract->update(['status' => 'client_approved']);

            $photoshoot->update([
                'status' => 'approved'
            ]);
        }

        $photoshoot->client->update($this->validatedClient($validated));

        if(!empty($photoshoot->client->addresses()->first())) {
            $photoshoot->client->addresses()->first()->update($this->validatedClientAddress($validated));
        } else {
            $client_address = Address::create($this->validatedClientAddress($validated));
            AddressClient::create([
                'client_id' => $photoshoot->client->id,
                'address_id' => $client_address->id
            ]);
        }

        return redirect()->route('public.photoshoot.success', ['photoshoot' => $photoshoot->id]);
    }

    public function download(PhotographyContract $contract)
    {
        //PDF file is stored under project/public/download/info.pdf
        // $file= public_path(). "/download/info.pdf";

        // $headers = array(
        //         'Content-Type: application/pdf',
        //         );

        // return Response::download($file, 'filename.pdf', $headers);
    }

    protected function validatedClient($validated=[])
    {
        return [
            'organization' => $validated['organization'],
            'website' => $validated['website'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name']
        ];
    }

    protected function validatedClientAddress($validated=[])
    {
        return [
            'street_address' => $validated['street_address'],
            'street_address_2' => $validated['street_address_2'],
            'city' => $validated['city'],
            'state_code' => $validated['state_code'],
            'postal_code' => $validated['postal_code'],
            'country_code' => $validated['country_code']
        ];
    }

    protected function validatedPhotoshoot($validated=[])
    {
        return [
            'client_id' => $validated['client_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'event_date' => $validated['event_date'],
        ];
    }

}
