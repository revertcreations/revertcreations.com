<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\PhotographyContract;
use App\Models\Proposal;
use App\Models\Address;
use App\Models\PhotographyContractAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $proposals = Proposal::all();
        return view('admin.proposal.index', compact('proposals'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $clients = Client::all();

        return view('admin.proposal.create', ['clients' => $clients]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $proposal = Proposal::create([
            'client_id' => $request->client_id,
            'public_token' => Hash::make($request->client_id.config('hashing.public_token_salt').$request->title),
            'title' => $request->title,
            'description' => $request->description
        ]);

        switch ($request->type) {
            case 'photography':

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

                $photography_contract = PhotographyContract::create([
                    'client_id' => $request->client_id,
                    'proposal_id' => $proposal->id,
                    'event_starts' => date('Y-m-d H:i:s', $request->event_starts),
                    'event_ends' => date('Y-m-d H:i:s', $request->event_ends),
                    'late_fee_percentage' => $request->late_fee_percentage ?: 0,
                    'retainer_fee' => $request->retainer_fee ?: 0,
                    'delivered_images_count' => $request->delivered_images_count,
                    'price_per_image' => $request->price_per_image
                ]);

                if (isset($address)) {
                    PhotographyContractAddress::create([
                        'photography_contract_id' => $photography_contract->id,
                        'address_id' => $address->id
                    ]);
                }
                break;

            default:
                # code...
                break;
        }

        return redirect()->route('proposal.index');
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
    public function update(Request $request, $id)
    {
        //
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
