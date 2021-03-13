<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\PhotographyContract;
use App\Models\Photoshoot;
use App\Models\Address;
use App\Models\PhotographyContractAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PhotoshootController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $photoshoots = Photoshoot::all();
        return view('admin.photoshoot.index', compact('photoshoots'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $clients = Client::all();

        return view('admin.photoshoot.create', ['clients' => $clients]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $photoshoot = Photoshoot::create([
            'client_id' => $request->client_id,
            'public_token' => Hash::make($request->client_id.config('hashing.public_token_salt').$request->title),
            'title' => $request->title,
            'description' => $request->description,
            'arrival_at' => date('Y-m-d H:i:s', strtotime($request->arrival_at)),
            'event_starts' => date('Y-m-d H:i:s', strtotime($request->event_starts)),
            'event_ends' => date('Y-m-d H:i:s', strtotime($request->event_ends))
        ]);

        if (!empty($request->street_address)) {
            $address = Address::create([
                'street_address' => $request->street_address,
                'street_address_2' => $request->street_address_2,
                'city' => $request->city,
                'state_code' => $request->state,
                'country_code' => 'US',
                'postal_code' => $request->postal_code
            ]);
        }

        $photography_contract = PhotographyContract::create([
            'client_id' => $request->client_id,
            'photoshoot_id' => $photoshoot->id,
            'late_fee_percentage' => $request->late_fee_percentage ?: 0,
            'retainer_fee' => $request->retainer_fee ?: 0,
            'delivered_images_count' => $request->delivered_images_count,
            'price_per_image' => $request->price_per_image
        ]);

        $photoshoot->update(['photography_contract_id' => $photography_contract->id]);

        if (isset($address)) {
            PhotographyContractAddress::create([
                'photography_contract_id' => $photography_contract->id,
                'address_id' => $address->id
            ]);
        }

        return redirect()->route('photoshoot.index');
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
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Photoshoot $photoshoot)
    {

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

}
