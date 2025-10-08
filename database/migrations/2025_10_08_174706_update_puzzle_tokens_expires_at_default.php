<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE puzzle_tokens MODIFY expires_at DATETIME NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE puzzle_tokens MODIFY expires_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 2 MINUTE)');
    }
};
