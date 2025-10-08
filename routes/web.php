<?php

use App\Http\Controllers\Admin\ActivityController as AdminActivityController;
use App\Http\Controllers\Admin\BuildLogController as AdminBuildLogController;
use App\Http\Controllers\Admin\OpportunityController as AdminOpportunityController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\AdminJobController;
use App\Http\Controllers\AdminLoginController;
use App\Http\Controllers\BuildJournalController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OpportunityPipelineController;
use App\Http\Controllers\PuzzleSessionController;
use App\Models\Skill;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/resume', function () {
    $resume = public_path('TreverHillisDeveloperResume2025.pdf');
    $headers = [
        'Content-Type' => 'application/pdf',
    ];

    return response()->download($resume, 'TreverHillisDeveloperResume2025.pdf', $headers);
})->name('resume');

Route::get('/opportunities', OpportunityPipelineController::class)->name('opportunities.index');
Route::get('/dispatches', function () {
    abort(404);
})->name('dispatches.index');
Route::get('/dispatches/{slug}', function () {
    abort(404);
})->name('dispatches.show');
Route::get('/build', [BuildJournalController::class, 'index'])->name('build.index');
Route::get('/build/{project}', [BuildJournalController::class, 'show'])->name('build.show');
Route::get('/docs/{path}', DocumentController::class)->where('path', '.*')->name('docs.show');
Route::get('/labs', function () {
    abort(404);
})->name('labs.archive');

Route::prefix('puzzle/{puzzle_type_id}')->group(function () {
    Route::get('/check', [PuzzleSessionController::class, 'check'])->name('puzzle-check');
    Route::post('/solved/{token}', [PuzzleSessionController::class, 'solved'])->name('puzzle-solved');
    Route::get('/leaderboard', [PuzzleSessionController::class, 'leaderboard'])->name('puzzle-leaderboard');
});

Route::get('/developer', function () {
    $skills = Skill::all();

    return view('developer', compact('skills'));
})->name('developer');
Route::post('/developer', [ClientController::class, 'hire'])->name('hire-me');

Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminLoginController::class, 'login'])->name('admin.login');
    Route::post('/authenticate', [AdminLoginController::class, 'authenticate'])->name('admin.authenticate');

    Route::middleware('auth')->as('admin.')->group(function () {
        Route::get('/', \App\Http\Controllers\Admin\DashboardController::class)->name('dashboard');
        Route::get('/logout', [AdminLoginController::class, 'logout'])->name('logout');

        Route::patch('opportunities/{opportunity}/workflow', [AdminOpportunityController::class, 'updateWorkflow'])->name('opportunities.workflow');
        Route::patch('opportunities/{opportunity}/archive', [AdminOpportunityController::class, 'archive'])->name('opportunities.archive');
        Route::patch('opportunities/{opportunity}/restore', [AdminOpportunityController::class, 'restore'])->name('opportunities.restore');
        Route::patch('opportunities/{opportunity}/favorite', [AdminOpportunityController::class, 'toggleFavorite'])->name('opportunities.favorite');
        Route::patch('opportunities/{opportunity}/visibility', [AdminOpportunityController::class, 'toggleVisibility'])->name('opportunities.visibility');
        Route::get('opportunities/capture', [AdminOpportunityController::class, 'capture'])->name('opportunities.capture');
        Route::post('opportunities/capture', [AdminOpportunityController::class, 'storeCapture'])->name('opportunities.capture.store');
        Route::resource('opportunities', AdminOpportunityController::class)->parameters([
            'opportunities' => 'opportunity',
        ]);
        Route::resource('activities', AdminActivityController::class)->parameters([
            'activities' => 'activity',
        ]);
        Route::resource('build-logs', AdminBuildLogController::class)->parameters([
            'build-logs' => 'buildLog',
        ]);
        Route::resource('posts', AdminPostController::class)->except(['show'])->parameters([
            'posts' => 'post',
        ]);

        Route::get('jobs', [AdminJobController::class, 'index'])->name('jobs.index');
        Route::post('jobs/sync', [AdminJobController::class, 'sync'])->name('jobs.sync');
        Route::post('jobs/mass-apply', [AdminJobController::class, 'massApply'])->name('jobs.mass-apply');
        Route::post('jobs/{opportunity}/applications', [AdminJobController::class, 'storeApplication'])->name('jobs.applications.store');
        Route::patch('jobs/applications/{application}', [AdminJobController::class, 'updateApplication'])->name('jobs.applications.update');
        Route::patch('jobs/opportunities/{opportunity}', [AdminJobController::class, 'updateOpportunity'])->name('jobs.opportunities.update');
    });
});
