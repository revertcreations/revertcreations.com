<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\PhotographyContractController;
use App\Http\Controllers\ProposalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::domain('admin.revertcreations.test')->group(function () {

    Route::get('/', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard');

    Route::resource('proposal', ProposalController::class);
    Route::resource('client', ClientController::class);
    // Route::resource('photography', PhotographyContractController::class);

});

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/code', function () {
    return view('code');
})->name('code');


Route::get('/about', function () {
    return view('about');
})->name('about');


Route::get('/photography', [PhotographyContractController::class, 'publicIndex'])->name('photography');
Route::get('/photography/proposal/{proposal}/{token}', [PhotographyContractController::class, 'publicProposal'])->name('photography.proposal');

// Route::resource('Invoices', [InvoicesController::class]);
// Route::resource('Images', [ImagesController::class]);
// Route::resource('Customers',[CustomersController::class]);
