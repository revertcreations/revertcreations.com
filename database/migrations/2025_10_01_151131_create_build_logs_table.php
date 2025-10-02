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
        Schema::create('build_logs', function (Blueprint $table) {
            $table->id();
            $table->timestamp('logged_at')->useCurrent();
            $table->string('phase')->nullable();
            $table->string('category')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('agent_contribution')->nullable();
            $table->text('review_notes')->nullable();
            $table->json('links')->nullable();
            $table->boolean('public_visibility')->default(true);
            $table->timestamps();

            $table->index('logged_at');
            $table->index('phase');
            $table->index('public_visibility');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('build_logs');
    }
};
