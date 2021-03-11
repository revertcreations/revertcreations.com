<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.proposal.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.proposal.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // $table->foreignId('client_id')->constrained('clients')->nullable();
        // $table->enum('type', ['photography', 'design', 'development'])->default('photography');
        // $table->enum('status', ['pending', 'approved', 'archived'])->default('pending');
        // $table->string('title');
        // $table->string('description');
        // $table->dateTime('event_starts');
        // $table->dateTime('event_ends');
        // $table->string('photoshoot_location')->nullable();
        // $table->decimal('late_fee_percentage',5,4)->default(0.00);
        // $table->decimal('retainer_fee', 10, 2)->default(0.00);
        // $table->tinyInteger('delivered_images')->nullable();
        // $table->decimal('price_per_image',10,2)->nullable();
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
