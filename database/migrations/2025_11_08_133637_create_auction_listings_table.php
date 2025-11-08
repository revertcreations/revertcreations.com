<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('auction_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_source_id')->nullable()->constrained()->nullOnDelete();
            $table->string('external_id')->nullable(); // ID from source platform

            // Basic auction info
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('seller')->nullable();
            $table->string('location')->nullable();
            $table->string('category')->nullable();
            $table->string('subcategory')->nullable();
            $table->string('source_url')->nullable();
            $table->string('lot_number')->nullable();

            // Pricing
            $table->decimal('current_bid', 10, 2)->nullable();
            $table->decimal('buy_now_price', 10, 2)->nullable();
            $table->decimal('reserve_price', 10, 2)->nullable();
            $table->boolean('reserve_met')->default(false);
            $table->decimal('shipping_cost', 10, 2)->nullable();
            $table->boolean('local_pickup_only')->default(false);
            $table->decimal('buyer_premium_percent', 5, 2)->default(0);
            $table->decimal('tax_rate_percent', 5, 2)->default(0);
            $table->string('currency', 3)->default('USD');

            // Item details
            $table->string('condition')->nullable();
            $table->json('images')->nullable(); // Array of image URLs
            $table->json('tags')->nullable(); // Extracted keywords

            // Timing
            $table->timestamp('auction_start')->nullable();
            $table->timestamp('auction_end')->nullable();
            $table->timestamp('collected_at')->nullable();

            // eBay market data
            $table->unsignedInteger('ebay_sold_count')->nullable();
            $table->unsignedInteger('ebay_active_count')->nullable();
            $table->decimal('ebay_avg_price', 10, 2)->nullable();
            $table->decimal('ebay_median_price', 10, 2)->nullable();
            $table->decimal('ebay_sell_through_rate', 5, 4)->nullable(); // 0.0000 to 1.0000
            $table->decimal('ebay_fees_percent', 5, 2)->default(13.00);

            // Calculated profitability
            $table->decimal('total_cost', 10, 2)->nullable();
            $table->decimal('expected_profit', 10, 2)->nullable();
            $table->decimal('roi_percent', 10, 2)->nullable();
            $table->decimal('match_score', 5, 2)->nullable(); // 0-100

            // Workflow
            $table->string('status')->default('new'); // new, analyzing, watching, bidding, won, lost, passed, archived
            $table->decimal('max_bid', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('watched_at')->nullable();
            $table->timestamp('bid_placed_at')->nullable();
            $table->string('outcome')->nullable(); // won, lost, passed
            $table->boolean('is_archived')->default(false);

            $table->softDeletes();
            $table->timestamps();

            // Indexes
            $table->unique(['auction_source_id', 'external_id'], 'source_external_unique');
            $table->index(['status', 'is_archived']);
            $table->index('auction_end');
            $table->index('match_score');
            $table->index('roi_percent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_listings');
    }
};
