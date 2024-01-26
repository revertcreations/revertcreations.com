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
        Schema::create('puzzle_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index();
            $table->foreignId('puzzle_type_id')->index();
            $table->decimal('current_time_in_seconds')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homepage_puzzle');
    }
};
