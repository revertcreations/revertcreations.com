<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            if (!Schema::hasColumn('opportunities', 'source')) {
                $table->string('source')->default('manual')->after('priority');
            }

            if (!Schema::hasColumn('opportunities', 'source_channel')) {
                $table->string('source_channel')->nullable()->after('source');
            }
        });
    }

    public function down(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            if (Schema::hasColumn('opportunities', 'source_channel')) {
                $table->dropColumn('source_channel');
            }

            if (Schema::hasColumn('opportunities', 'source')) {
                $table->dropColumn('source');
            }
        });
    }
};
