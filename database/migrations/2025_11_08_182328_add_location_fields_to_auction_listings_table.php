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
        Schema::table('auction_listings', function (Blueprint $table) {
            // Location information
            $table->string('location_city')->nullable()->after('source_url');
            $table->string('location_state')->nullable()->after('location_city');
            $table->string('location_zip')->nullable()->after('location_state');
            $table->string('location_country')->default('United States')->after('location_zip');

            // Calculated distance from user location (Carrboro, NC)
            $table->integer('distance_miles')->nullable()->after('location_country')->index();

            // Shipping availability
            $table->boolean('shipping_available')->default(false)->after('shipping_cost')->index();

            // Local pickup requirement
            $table->boolean('local_pickup_required')->default(false)->after('shipping_available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auction_listings', function (Blueprint $table) {
            $table->dropColumn([
                'location_city',
                'location_state',
                'location_zip',
                'location_country',
                'distance_miles',
                'shipping_available',
                'local_pickup_required',
            ]);
        });
    }
};
