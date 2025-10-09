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
        Schema::create('job_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('driver');
            $table->string('base_url')->nullable();
            $table->boolean('enabled')->default(true);
            $table->unsignedInteger('frequency_minutes')->default(60);
            $table->timestamp('last_ran_at')->nullable();
            $table->string('last_status')->nullable();
            $table->json('filters')->nullable();
            $table->json('meta')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_sources');
    }
};
