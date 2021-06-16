<?php

namespace App\Http\Controllers;

use App\Mail\PhotographyContract as MailPhotographyContract;
use App\Models\PhotographyContract;
use App\Models\Photoshoot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PhotographyContractController extends Controller
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

    public function email(PhotographyContract $contract)
    {
        // return new MailPhotographyContract($contract);
        Mail::to($contract->client->email)->send(new MailPhotographyContract($contract));

        return back();
    }

}
