<?php

namespace App\Http\Controllers;

use App\Models\PhotographyContract;
use App\Models\Proposal;
use Illuminate\Http\Request;

class PhotographyContractsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PhotographyContract  $contract
     * @return \Illuminate\Http\Response
     */
    public function show(PhotographyContract $contract)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Photography  $contract
     * @return \Illuminate\Http\Response
     */
    public function edit(PhotographyContract $contract)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Photography  $contract
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PhotographyContract $contract)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Photography  $contract
     * @return \Illuminate\Http\Response
     */
    public function destroy(PhotographyContract $contract)
    {
        //
    }

    public function publicProposal(Proposal $proposal, $token='')
    {
        if(!$proposal || $token !== $proposal->public_token)
            return redirect('home');

        return view('photography.proposal', compact('proposal'));
    }
}
