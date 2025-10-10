<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Client;
use App\Models\AddressClient;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $clients = Client::all();
        return view('admin.client.index', compact('clients'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.client.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $this->validateClient($request);

        $client = Client::create($this->extractClientAttributes($data));

        $address = Address::create($this->extractAddressAttributes($data));

        AddressClient::create([
            'client_id' => $client->id,
            'address_id' => $address->id,
        ]);

        return redirect()
            ->route('admin.client.index')
            ->with('status', 'Client created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Client $client)
    {
        $address = $client->addresses()->latest()->first();

        return view('admin.client.edit', compact('client', 'address'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Client $client)
    {
        $data = $this->validateClient($request, $client);

        $client->update($this->extractClientAttributes($data));

        $addressAttributes = $this->extractAddressAttributes($data);

        $address = $client->addresses()->latest()->first();

        if ($address) {
            $address->update($addressAttributes);
        } else {
            $address = Address::create($addressAttributes);
            $client->addresses()->syncWithoutDetaching([$address->id]);
        }

        return redirect()
            ->route('admin.client.index')
            ->with('status', 'Client updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Client $client)
    {
        $addresses = $client->addresses()->get();

        $client->addresses()->detach();
        $client->delete();

        $addresses->each(function (Address $address) {
            if ($address->client()->count() === 0) {
                $address->delete();
            }
        });

        return redirect()
            ->route('admin.client.index')
            ->with('status', 'Client deleted successfully.');
    }

    public function hire(Request $request)
    {
        $client = Client::create($request->validate([
            'organization' => 'nullable|string',
            'website' => 'nullable|url',
            'phone' => 'nullable|numeric',
            'email' => 'required|email|unique:clients,email',
            'first_name' => 'required',
            'last_name' => 'required',
            'description' => 'nullable|string'
        ]));

        return response()->json([
            'status' => 'ok',
            'message' => 'Thanks for reaching out, I\'ll be in contact shortly!',
        ]);
    }

    protected function validateClient(Request $request, ?Client $client = null): array
    {
        return $request->validate([
            'organization' => ['nullable', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('clients', 'email')->ignore($client?->id),
            ],
            'website' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string'],
            'phone_number' => ['nullable', 'string', 'max:50'],
            'country' => ['nullable', 'string', 'size:2'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'street_address_2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ]);
    }

    protected function extractClientAttributes(array $data): array
    {
        return [
            'organization' => $data['organization'] ?? null,
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'email' => $data['email'],
            'website' => $data['website'] ?? null,
            'description' => $data['description'] ?? null,
            'phone' => $data['phone_number'] ?? null,
        ];
    }

    protected function extractAddressAttributes(array $data): array
    {
        return [
            'street_address' => $data['street_address'] ?? '',
            'street_address_2' => $data['street_address_2'] ?? null,
            'city' => $data['city'] ?? '',
            'state_code' => $data['state'] ?? '',
            'country_code' => strtoupper($data['country'] ?? 'US'),
            'postal_code' => $data['postal_code'] ?? null,
        ];
    }
}
