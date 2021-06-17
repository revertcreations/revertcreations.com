<?php

use App\Http\Controllers\AdminLoginController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\PhotographyPortfolioImageController;
use App\Http\Controllers\PublicPhotoshootController;
use App\Http\Controllers\PhotographyContractController;
use App\Http\Controllers\PhotoshootController;
use App\Http\Controllers\SkillsController;
use App\Models\PhotographyPortfolioImage;
use App\Models\Skill;
use Illuminate\Support\Facades\Route;


Route::domain('admin.revertcreations.test')->group(function () {
    Route::get('/', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard')->middleware('auth');

    Route::get('/login', [AdminLoginController::class, 'login'])->name('admin.login');
    Route::get('/logout', [AdminLoginController::class, 'logout'])->name('admin.logout');
    Route::post('/authenticate', [AdminLoginController::class, 'authenticate'])->name('admin.authenticate');

    Route::post('contract/{contract}/email', [PhotographyContractController::class, 'email'])->middleware('auth')->name('admin.contract.email');

    Route::resource('photoshoot', PhotoshootController::class)->middleware('auth');
    Route::resource('portfolio', PhotographyPortfolioImageController::class)->middleware('auth');
    Route::resource('client', ClientController::class)->middleware('auth');
    Route::resource('skills', SkillsController::class)->middleware('auth');
});

Route::domain('revertcreations.test')->group(function () {

    Route::get('/', function () {
        return view('home');
    })->name('home');

    Route::get('/web-development', function () {
        $skills = Skill::all();
        return view('web-development', compact('skills'));
    })->name('web-development');

    Route::post('/web-development', [ClientController::class, 'hire'])->name('hire-me');


    Route::get('/about', function () {
        return view('about');
    })->name('about');


    Route::get('/photography', function(){
        $portfolio = PhotographyPortfolioImage::all();
        return view('photography.index', compact('portfolio'));
    })->name('photography');

    Route::get('/photography/book', [PublicPhotoshootController::class, 'create'])->name('public.photoshoot.create');
    Route::post('/photography/photoshoot', [PublicPhotoshootController::class, 'store'])->name('public.photoshoot.store');
    Route::get('/photography/photoshoot/{photoshoot}/success', [PublicPhotoshootController::class, 'success'])->name('public.photoshoot.success');
    Route::put('/photgraphy/photoshoot/{photoshoot}/{token?}', [PublicPhotoshootController::class, 'update'])->name('public.photoshoot.update');
    Route::get('/photography/photoshoot/{photoshoot}/{token?}', [PublicPhotoshootController::class, 'show'])->name('public.photoshoot.show');
    Route::get('/photography/photoshoot/{photoshoot}/{token}/edit', [PublicPhotoshootController::class, 'edit'])->name('public.photoshoot.edit');
    Route::post('/photography/photoshoot/{photoshoot}/{token}/accepts', [PublicPhotoshootController::class, 'accepts'])->name('public.photoshoot.accepts');
    Route::post('/photography/photoshoot/{photoshoot}/{token}/download', [PublicPhotoshootController::class, 'download'])->name('public.photoshoot.download');

});



// Route::resource('Invoices', [InvoicesController::class]);
// Route::resource('Images', [ImagesController::class]);
// Route::resource('Customers',[CustomersController::class]);
