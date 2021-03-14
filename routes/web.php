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

    $skills = collect([
        ['name' => 'CSS', 'ranking' => 8.8],
        ['name' => 'HTML', 'ranking' => 9.8],
        ['name' => 'Javascript', 'ranking' => 9.1],
        ['name' => 'PHP', 'ranking' => 9.6],
        ['name' => 'Linux', 'ranking' => 8.7],
        ['name' => 'Laravel', 'ranking' => 7.8],
        ['name' => 'CodeIgniter', 'ranking' => 7.9],
        ['name' => 'Docker', 'ranking' => 8.6],
        ['name' => 'Kubernetes', 'ranking' => 8.4],
        ['name' => 'Digital Ocean', 'ranking' => 9.3],
        ['name' => 'DNS', 'ranking' => 8.1],
        ['name' => 'Redis', 'ranking' => 8.8],
        ['name' => 'SQL', 'ranking' => 8.7],
        ['name' => 'JSON', 'ranking' => 9.4],
        ['name' => 'tailwindcss', 'ranking' => 6.1],
        ['name' => 'Vim', 'ranking' => 8.5],
        ['name' => 'Bash', 'ranking' => 7.4],
        ['name' => 'Heroku', 'ranking' => 6.3],
        ['name' => 'NodeJS', 'ranking' => 6.8],
        ['name' => 'GoLang', 'ranking' => 2.8],
        ['name' => 'Python', 'ranking' => 3.1],
        ['name' => 'riot.js.org', 'ranking' => 8.5],
        ['name' => 'NGINX', 'ranking' => 8.4],
        ['name' => 'APACHE', 'ranking' => 6.2],
        ['name' => 'Git', 'ranking' => 9.4],
        ['name' => 'Vue', 'ranking' => 3.6],
        ['name' => 'React', 'ranking' => 5.5],
        ['name' => 'Bootstrap', 'ranking' => 4.1],
        ['name' => 'JQuery', 'ranking' => 7.6],
        ['name' => 'npm', 'ranking' => 8.6],
        ['name' => 'webpack', 'ranking' => 5.5],
        ['name' => 'Cloudinary', 'ranking' => 7.3],
        ['name' => 'Photoshop', 'ranking' => 9.4],
        ['name' => 'Illustrator', 'ranking' => 8.9],
        ['name' => 'Lightroom', 'ranking' => 9.3]
    ]);

    return view('web-development', compact('skills'));
})->name('web-development');


Route::get('/about', function () {
    return view('about');
})->name('about');


Route::get('/photography', function(){
    return view('photography.index');
})->name('photography');

Route::get('/photography/book', [PublicPhotoshootController::class, 'create'])->name('public.photoshoot.create');
Route::post('/photography/photoshoot', [PublicPhotoshootController::class, 'store'])->name('public.photoshoot.store');
Route::get('/photography/photoshoot/{photoshoot}/success', [PublicPhotoshootController::class, 'success'])->name('public.photoshoot.success');
Route::put('/photgraphy/photoshoot/{photoshoot}/{token?}', [PublicPhotoshootController::class, 'update'])->name('public.photoshoot.update');
Route::get('/photography/photoshoot/{photoshoot}/{token?}', [PublicPhotoshootController::class, 'show'])->name('public.photoshoot.show');
Route::get('/photography/photoshoot/{photoshoot}/{token}/edit', [PublicPhotoshootController::class, 'edit'])->name('public.photoshoot.edit');

Route::post('/photography/photoshoot/{photoshoot}/{token}/accepts', [PublicPhotoshootController::class, 'accepts'])->name('public.photoshoot.accepts');




// Route::resource('Invoices', [InvoicesController::class]);
// Route::resource('Images', [ImagesController::class]);
// Route::resource('Customers',[CustomersController::class]);
