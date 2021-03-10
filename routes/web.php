<?php

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

Route::get('/photography', function () {
    return view('photography');
})->name('photography');

Route::get('/photography/contract', function () {
    return view('photography-contract');
})->name('photography.contract');

// Route::resource('Invoices', [InvoicesController::class]);
// Route::resource('Images', [ImagesController::class]);
// Route::resource('Customers',[CustomersController::class]);
