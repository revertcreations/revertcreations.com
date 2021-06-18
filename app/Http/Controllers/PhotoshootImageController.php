<?php

namespace App\Http\Controllers;

use App\Models\PhotoshootImage;
use App\Models\Photoshoot;
use Illuminate\Http\Request;

class PhotoshootImageController extends Controller
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
    public function store(Request $request, Photoshoot $photoshoot)
    {
        $response = [
            'status' => 'error',
            'message' => 'ok, hmm, there is no image attached, probably tell the dev about this...'
        ];

        // dd($request->file('images'));

        if(empty($request->file('images')))
            return response()->json($response);

        // // Get default limit
        // $normalTimeLimit = ini_get('max_execution_time');
        // $postMaxSize = ini_get('post_max_size');

        // // Set new limit
        // ini_set('max_execution_time', 600);
        // ini_set('post_max_size', "200G");

        // //other code

        // // Restore default limit
        // ini_set('max_execution_time', $normalTimeLimit);

        $uploaded_images = 0;

        foreach ($request->file('images') as $image) {

            $cloudinary_result = $image->storeOnCloudinary('photoshoot_'.$photoshoot->id);

            $image = PhotoshootImage::create([
                'photoshoot_id' => $photoshoot->id,
                'public_id' => $cloudinary_result->getPublicId(),
                'secure_path' => $cloudinary_result->getSecurePath(),
                'file_name' => $cloudinary_result->getFileName(),
                'extension' => $cloudinary_result->getExtension(),
                'selected' => false
            ]);

            if($cloudinary_result)
                $uploaded_images++;

        }

        if($cloudinary_result)
            $response = [
                'status' => 'success',
                'message' => $uploaded_images." images were successfully uploaded"
            ];
        else
            $response = [
                'status' => 'error',
                'message' => 'Hmm, something went wrong, I wonder if it took too long. Wanna Try again?'
            ];


        return response()->json($response);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PhotoshootImage  $photoshootImage
     * @return \Illuminate\Http\Response
     */
    public function show(PhotoshootImage $photoshootImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PhotoshootImage  $photoshootImage
     * @return \Illuminate\Http\Response
     */
    public function edit(PhotoshootImage $photoshootImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PhotoshootImage  $photoshootImage
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PhotoshootImage $photoshootImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PhotoshootImage  $photoshootImage
     * @return \Illuminate\Http\Response
     */
    public function destroy(PhotoshootImage $photoshootImage)
    {
        //
    }
}
