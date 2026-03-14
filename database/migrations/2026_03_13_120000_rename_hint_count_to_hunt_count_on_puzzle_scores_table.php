<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('puzzle_scores', function (Blueprint $table) {
            $table->renameColumn('hint_count', 'hunt_count');
        });
    }

    public function down(): void
    {
        Schema::table('puzzle_scores', function (Blueprint $table) {
            $table->renameColumn('hunt_count', 'hint_count');
        });
    }
};
