<?php

namespace App\Http\Controllers;

use App\Mail\PhotographyContract as MailPhotographyContract;
use App\Models\Photography;
use App\Models\PhotographyContract;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;

class PhotographyContractController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @return Response
     */
    public function show(PhotographyContract $contract)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Photography  $contract
     * @return Response
     */
    public function edit(PhotographyContract $contract)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Photography  $contract
     * @return Response
     */
    public function update(Request $request, PhotographyContract $contract)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Photography  $contract
     * @return Response
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
