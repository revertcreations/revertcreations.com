<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->boolean('is_remote')->default(false)->after('links');
            $table->unsignedTinyInteger('async_level')->nullable()->after('is_remote'); // 0-5 scale
            $table->unsignedInteger('salary_min')->nullable()->after('async_level');
            $table->unsignedInteger('salary_max')->nullable()->after('salary_min');
            $table->string('salary_currency', 8)->default('USD')->after('salary_max');
            $table->json('domain_tags')->nullable()->after('salary_currency');
            $table->unsignedTinyInteger('fit_score')->default(0)->after('domain_tags');
        });
    }

    public function down(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->dropColumn([
                'is_remote',
                'async_level',
                'salary_min',
                'salary_max',
                'salary_currency',
                'domain_tags',
                'fit_score',
            ]);
        });
    }
};
