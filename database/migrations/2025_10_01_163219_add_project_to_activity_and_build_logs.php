<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            if (!Schema::hasColumn('activities', 'project')) {
                $table->string('project')->default('site-relaunch')->after('category');
                $table->index('project');
            }
        });

        Schema::table('build_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('build_logs', 'project')) {
                $table->string('project')->default('site-relaunch')->after('category');
                $table->index('project');
            }
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            if (Schema::hasColumn('activities', 'project')) {
                $table->dropIndex(['project']);
                $table->dropColumn('project');
            }
        });

        Schema::table('build_logs', function (Blueprint $table) {
            if (Schema::hasColumn('build_logs', 'project')) {
                $table->dropIndex(['project']);
                $table->dropColumn('project');
            }
        });
    }
};
