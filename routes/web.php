<?php

use App\Http\Controllers\AdminAuctionController;
use App\Http\Controllers\AdminAuctionSourceController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminJobController;
use App\Http\Controllers\AdminLoginController;
use App\Http\Controllers\AdminPostController;
use App\Http\Controllers\AdminProjectAssetController;
use App\Http\Controllers\AdminProjectController;
use App\Http\Controllers\AdminProjectUpdateController;
use App\Http\Controllers\CharacterPassController;
use App\Http\Controllers\CommercialReferralController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PuzzleSessionController;
use App\Http\Controllers\SkillsController;
use App\Http\Controllers\SourceCodeController;
use App\Models\PhotographyPortfolioImage;
use App\Models\Skill;
use Illuminate\Support\Facades\Route;

$domain = preg_replace('(^https?://)', '', config('app.url'));

Route::domain('admin.'.$domain)->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard')->middleware('auth');

    Route::get('/login', [AdminLoginController::class, 'login'])->name('login');
    Route::get('/logout', [AdminLoginController::class, 'logout'])->name('logout');
    Route::post('/authenticate', [AdminLoginController::class, 'authenticate'])->name('authenticate');

    Route::resource('client', ClientController::class)->middleware('auth');
    Route::resource('skills', SkillsController::class)->middleware('auth');
    Route::resource('projects', AdminProjectController::class)->middleware('auth');
    Route::post('project-updates/bulk-status', [AdminProjectUpdateController::class, 'bulkUpdateStatus'])->middleware('auth')->name('project-updates.bulk-status');
    Route::resource('project-updates', AdminProjectUpdateController::class)->middleware('auth');
    Route::post('project-assets/upload', [AdminProjectAssetController::class, 'upload'])->middleware('auth')->name('project-assets.upload');
    Route::resource('project-assets', AdminProjectAssetController::class)->middleware('auth');
    Route::post('posts/upload-image', [AdminPostController::class, 'uploadImage'])->middleware('auth')->name('posts.upload-image');
    Route::resource('posts', AdminPostController::class)->middleware('auth');
    Route::resource('jobs', AdminJobController::class)->middleware('auth');

    // Auction routes
    Route::resource('auction-sources', AdminAuctionSourceController::class)->middleware('auth');
    Route::post('auction-sources/{auctionSource}/collect', [AdminAuctionSourceController::class, 'collect'])->middleware('auth')->name('auction-sources.collect');

    Route::resource('auctions', AdminAuctionController::class)->middleware('auth');
    Route::post('auctions/{auction}/watch', [AdminAuctionController::class, 'watch'])->middleware('auth')->name('auctions.watch');
    Route::post('auctions/{auction}/unwatch', [AdminAuctionController::class, 'unwatch'])->middleware('auth')->name('auctions.unwatch');
    Route::post('auctions/{auction}/status', [AdminAuctionController::class, 'updateStatus'])->middleware('auth')->name('auctions.status');
    Route::post('auctions/{auction}/bid', [AdminAuctionController::class, 'recordBid'])->middleware('auth')->name('auctions.bid');
    Route::post('auctions/{auction}/refresh-ebay', [AdminAuctionController::class, 'refreshEbayData'])->middleware('auth')->name('auctions.refresh-ebay');
});

Route::domain('blog.'.$domain)->group(function () {
    Route::get('/{any?}', function () {
        return redirect()->route('projects.index');
    })->where('any', '.*');
});

Route::domain($domain)->group(function () {

    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/source-code/{state}', SourceCodeController::class)
        ->name('source-code.show')
        ->whereIn('state', array_keys(config('sourceviewer.states', [])));
    Route::get('/puzzle/{puzzle_type_id}/check', [PuzzleSessionController::class, 'check'])->name('puzzle-check');
    Route::post('/puzzle/{puzzle_type_id}/solved/{token}', [PuzzleSessionController::class, 'solved'])->name('puzzle-solved');

    Route::get('/resume', function () {
        return view('resume');
    })->name('resume');

    Route::get('/resume/download', function () {
        return response()->download(
            public_path('TreverHillisResume2026.pdf'),
            'TreverHillisDeveloperResume.pdf',
            ['Content-Type' => 'application/pdf']
        );
    })->name('resume.download');

    // Route::get('/developer', function () {
    //     $skills = Skill::all();

    //     return view('developer', compact('skills'));
    // })->name('developer');
    Route::post('/developer', [ClientController::class, 'hire'])->name('hire-me');

    Route::get('/skills', function () {
        $skills = Skill::all();

        return compact('skills');
    })->name('skills');

    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

    // Route::get('/about', function () {
    //     return view('about');
    // })->name('about');

    Route::get('/portfolio', function () {
        $portfolio = PhotographyPortfolioImage::all();

        return view('visual', compact('portfolio'));
    })->name('visual');

    Route::get('/landing-page-design-audit', [CharacterPassController::class, 'show'])->name('character-pass');
    Route::redirect('/character-pass', '/landing-page-design-audit', 301);
    Route::get('/character-pass/sample', [CharacterPassController::class, 'sample'])->name('character-pass.sample');
    Route::get('/guides/how-to-critique-a-landing-page', [CharacterPassController::class, 'guide'])->name('character-pass.guide');
    Route::view('/guides/shopify-custom-order-production-sheet', 'shopify-custom-order-production-sheet-guide')->name('benchcue.guide');
    Route::get('/guides/print-shopify-line-item-properties', [CommercialReferralController::class, 'packingSlipGuide'])->name('benchcue.packing-slip-guide');
    Route::get('/shopify-packing-slip-setup', [CommercialReferralController::class, 'packingSlipSetup'])->name('packing-slip-setup');
    Route::get('/shopify-packing-slip-setup/checkout', [CommercialReferralController::class, 'packingSlipSetupCheckout'])->name('packing-slip-setup.checkout');
    Route::view('/shopify-packing-slip-setup/thanks', 'shopify-packing-slip-setup-thanks')->name('packing-slip-setup.thanks');
    Route::get('/shopify-storefront-audit', [CommercialReferralController::class, 'storefrontAudit'])->name('storefront-audit');
    Route::get('/shopify-storefront-audit/sample', [CommercialReferralController::class, 'storefrontAuditSample'])->name('storefront-audit.sample');
    Route::get('/shopify-storefront-audit/checkout', [CommercialReferralController::class, 'storefrontAuditCheckout'])->name('storefront-audit.checkout');
    Route::view('/shopify-storefront-audit/thanks', 'shopify-storefront-audit-thanks')->name('storefront-audit.thanks');
    Route::get('/tools/shopify-production-sheet-template', [CommercialReferralController::class, 'template'])->name('benchcue.template');
    Route::get('/go/benchcue', [CommercialReferralController::class, 'benchcue'])->name('benchcue.referral');
    Route::get('/commercial/evidence.json', [CommercialReferralController::class, 'evidence'])->name('commercial.evidence');
    Route::get('/character-pass/checkout', [CharacterPassController::class, 'checkout'])->name('character-pass.checkout');
    Route::get('/character-pass/evidence.json', [CharacterPassController::class, 'evidence'])->name('character-pass.evidence');
    Route::view('/character-pass/thanks', 'character-pass-thanks')->name('character-pass.thanks');

    // Route::get('/soundpure', function () {
    //    return view('soundpure');
    // })->name('soundpure');

});
