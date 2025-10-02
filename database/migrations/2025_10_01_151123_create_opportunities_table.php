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
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('company_name')->nullable();
            $table->string('industry')->nullable();
            $table->string('role_title');
            $table->string('status')->default('open');
            $table->string('stage')->nullable();
            $table->string('priority')->default('medium');
            $table->string('source')->default('manual');
            $table->string('source_channel')->nullable();
            $table->boolean('public_visibility')->default(true);
            $table->text('summary')->nullable();
            $table->timestamp('next_action_at')->nullable();
            $table->text('notes')->nullable();
            $table->json('links')->nullable();
            $table->timestamps();

            $table->index(['status', 'stage']);
            $table->index('priority');
            $table->index('source');
            $table->index('public_visibility');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
