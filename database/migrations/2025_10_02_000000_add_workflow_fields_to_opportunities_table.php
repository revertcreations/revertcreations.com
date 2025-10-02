<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->string('workflow_state')->default('sourced')->after('status');
            $table->timestamp('archived_at')->nullable()->after('public_visibility');
            $table->timestamp('last_action_at')->nullable()->after('next_action_at');
        });
    }

    public function down(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->dropColumn(['workflow_state', 'archived_at', 'last_action_at']);
        });
    }
};
