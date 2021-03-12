<?php

namespace App\Http\Controllers;

use App\Models\PhotographyContract;
use App\Models\Address;
use App\Models\PhotographyContractAddress;
use App\Models\Proposal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PublicProposalController extends Controller
{
    public function index()
    {
        return response()->json(['status' => 'all goooood']);
    }

    public function store(Request $request, Proposal $proposal, $token)
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
                    'event_starts' => date('Y-m-d H:i:s', strtotime($request->event_starts)),
                    'event_ends' => date('Y-m-d H:i:s', strtotime($request->event_ends)),
                    'late_fee_percentage' => $request->late_fee_percentage ?: 0,
                    'retainer_fee' => $request->retainer_fee ?: 0,
                    'delivered_images_count' => $request->delivered_images_count,
                    'price_per_image' => $request->price_per_image
                ]);

                $proposal->update(['photography_contract_id' => $photography_contract->id]);

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
}
