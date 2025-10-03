<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('build_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('build_logs', 'image_url')) {
                $table->string('image_url')->nullable()->after('description');
            }

            if (!Schema::hasColumn('build_logs', 'image_public_id')) {
                $table->string('image_public_id')->nullable()->after('image_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('build_logs', function (Blueprint $table) {
            if (Schema::hasColumn('build_logs', 'image_public_id')) {
                $table->dropColumn('image_public_id');
            }

            if (Schema::hasColumn('build_logs', 'image_url')) {
                $table->dropColumn('image_url');
            }
        });
    }
};
