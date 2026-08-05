<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('character_pass_metrics')
            ->where('event', 'guide_view')
            ->where('count', '>', 0)
            ->limit(1)
            ->decrement('count');
    }

    public function down(): void
    {
        // Removes the final request from the already-running internal renderer.
    }
};
