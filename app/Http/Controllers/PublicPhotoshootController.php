<?php

namespace App\Http\Controllers;

use App\Models\PhotographyContract;
use App\Models\Address;
use App\Models\Client;
use App\Models\PhotographyContractAddress;
use App\Models\Photoshoot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PublicPhotoshootController extends Controller
{
    public function index()
    {
        return response()->json(['status' => 'all goooood']);
    }

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


        return redirect()->route('photography.photoshoot.success', compact('photoshoot'));
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

    public function accepts(Request $request, Photoshoot $photoshoot)
    {

        // need to insert a new contract
        PhotographyContract::create($this->validatePhotographyContract());

        // update the photoshoot
        // $photoshoot()->update();

        // if errors
        return back();

        // else
        // return redirect()->route('photography.photoshoot.success');
    }

    protected function validateClient()
    {
        return request()->validate([
            'email' => 'required|email',
            'first_name' => 'required',
            'last_name' => 'required',

        ]);
    }

    protected function validatePhotographyContract()
    {
        return request()->validate([
            'price_per_image' => 'required|numeric',
            'delivered_images_count' => 'required|numeric',
            'arrival_at' => 'required|date',
            'event_starts' => 'required|date',
            'event_ends' => 'required|date'
        ]);
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'price_per_image' => intval($this->price_per_image),
            'delivered_images_count' => intval($this->delivered_images_count),
            'arrival_at' => date('Y-m-d H:i:s', strtotime($this->arrival_at)),
            'event_starts' => date('Y-m-d H:i:s', strtotime($this->event_starts)),
            'event_ends' => date('Y-m-d H:i:s', strtotime($this->event_ends))
        ]);
    }
}
