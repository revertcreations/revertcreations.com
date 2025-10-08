<?php

use App\Http\Controllers\AdminLoginController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SkillsController;
use App\Http\Controllers\PuzzleSessionController;
use App\Http\Controllers\BlogController;
use App\Models\Skill;
use Illuminate\Support\Facades\Route;

$domain = preg_replace("(^https?://)", "", config('app.url'));

Route::domain('admin.'.$domain)->group(function () {
    Route::get('/', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard')->middleware('auth');

    Route::get('/login', [AdminLoginController::class, 'login'])->name('admin.login');
    Route::get('/logout', [AdminLoginController::class, 'logout'])->name('admin.logout');
    Route::post('/authenticate', [AdminLoginController::class, 'authenticate'])->name('admin.authenticate');

    Route::resource('client', ClientController::class)->middleware('auth');
    Route::resource('skills', SkillsController::class)->middleware('auth');
});

Route::domain('blog.'.$domain)->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('blog');
    Route::get('/{slug}', [BlogController::class, 'show'])->name('blog.show');
});

Route::domain($domain)->group(function () {

    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/puzzle/{puzzle_type_id}/check', [PuzzleSessionController::class, 'check'])->name('puzzle-check');
    Route::post('/puzzle/{puzzle_type_id}/solved/{token}', [PuzzleSessionController::class, 'solved'])->name('puzzle-solved');

    Route::get('/resume', function () {
        $resume = public_path('TreverHillisDeveloperResume2024.pdf');
        $headers = [
            'Content-Type' => 'application/pdf',
        ];
        return response()->download($resume, 'TreverHillisDeveloperResume.pdf', $headers);
    })->name('resume');

    Route::get('/developer', function () {
        $skills = Skill::all();
        return view('developer', compact('skills'));
    })->name('developer');
    Route::post('/developer', [ClientController::class, 'hire'])->name('hire-me');

    Route::get('/skills', function () {
        $skills = Skill::all();
        return compact('skills');
    })->name('skills');

    Route::get('/about', function () {
        return view('about');
    })->name('about');

});
