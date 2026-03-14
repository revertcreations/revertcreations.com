<?php

namespace App\Http\Controllers;

use App\Models\PhotographyPortfolioImage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PhotographyPortfolioImageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $portfolio = PhotographyPortfolioImage::all();

        return view('admin.portfolio.index', compact('portfolio'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.portfolio.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        // dd($request->file('image'));
        $cloudinary_result = $request->file('image')->storeOnCloudinary('photographyPortfolio');

        $image = PhotographyPortfolioImage::create([
            'public_id' => $cloudinary_result->getPublicId(),
            'secure_path' => $cloudinary_result->getSecurePath(),
            'file_name' => $cloudinary_result->getFileName(),
            'extension' => $cloudinary_result->getExtension(),
            'status' => 'active',
        ]);

        return redirect()->route('portfolio.index');
    }

    /**
     * Display the specified resource.
     *
     * @return Response
     */
    public function show(PhotographyPortfolioImage $photographyPortfolioImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return Response
     */
    public function edit(PhotographyPortfolioImage $photographyPortfolioImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @return Response
     */
    public function update(Request $request, PhotographyPortfolioImage $photographyPortfolioImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return Response
     */
    public function destroy(PhotographyPortfolioImage $photographyPortfolioImage)
    {
        //
    }
}
