<?php

use App\Http\Controllers\PublicProposalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/proposal', [PublicProposalController::class, 'index']);
Route::get('/proposal/create', [PublicProposalController::class, 'create']);
Route::put('/proposal/{proposal}/{token?}', [PublicProposalController::class, 'update']);
