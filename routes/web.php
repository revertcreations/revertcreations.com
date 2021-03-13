<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\PhotographyContractController;
use App\Http\Controllers\PublicPhotoshootController;
use App\Http\Controllers\PhotoshootController;
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

    Route::resource('photoshoot', PhotoshootController::class);
    Route::resource('client', ClientController::class);
    // Route::resource('photography', PhotographyContractController::class);

});

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/web-development', function () {
    return view('web-development');
})->name('web-development');


Route::get('/about', function () {
    return view('about');
})->name('about');


Route::get('/photography', function(){
    return view('photography.index');
})->name('photography');

Route::get('/photography/photoshoot', [PublicPhotoshootController::class, 'index'])->name('public.photoshoot.index');
Route::post('/photography/photoshoot', [PublicPhotoshootController::class, 'store'])->name('public.photoshoot.store');
Route::get('/photography/photoshoot/create', [PublicPhotoshootController::class, 'create'])->name('public.photoshoot.create');
Route::get('/photography/photoshoot/success', [PublicPhotoshootController::class, 'success'])->name('public.photoshoot.success');
Route::put('/photgraphy/photoshoot/{photoshoot}/{token?}', [PublicPhotoshootController::class, 'update'])->name('public.photoshoot.update');
Route::get('/photography/photoshoot/{photoshoot}/{token?}', [PublicPhotoshootController::class, 'show'])->name('public.photoshoot.show');
Route::get('/photography/photoshoot/{photoshoot}/{token}/edit', [PublicPhotoshootController::class, 'edit'])->name('public.photoshoot.edit');

Route::post('/photography/photoshoot/{photoshoot}/{token}/accepts', [PublicPhotoshootController::class, 'accepts'])->name('public.photoshoot.accepts');




// Route::resource('Invoices', [InvoicesController::class]);
// Route::resource('Images', [ImagesController::class]);
// Route::resource('Customers',[CustomersController::class]);
