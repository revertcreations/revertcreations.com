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
        Schema::create('puzzle_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('puzzle_session_id')->index();
            $table->decimal('score')->default(0);
            $table->decimal('solve_time_in_seconds')->nullable()->default(null);
            $table->integer('hint_count')->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('puzzle_scores');
    }
};
