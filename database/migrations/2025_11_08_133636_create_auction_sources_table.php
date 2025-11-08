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
        Schema::create('auction_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('driver')->default('manual'); // 'hibid', 'ctbids', 'ebay', 'manual', etc.
            $table->string('base_url')->nullable();
            $table->boolean('enabled')->default(true);
            $table->unsignedInteger('frequency_minutes')->default(60);
            $table->timestamp('last_ran_at')->nullable();
            $table->string('last_status')->nullable();
            $table->json('filters')->nullable(); // Search terms, categories, price ranges, etc.
            $table->json('credentials')->nullable(); // Encrypted API keys, tokens
            $table->json('meta')->nullable(); // Additional metadata
            $table->decimal('buyer_premium_percent', 5, 2)->nullable(); // Default buyer's premium
            $table->decimal('tax_rate_percent', 5, 2)->nullable(); // Default tax rate
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_sources');
    }
};
