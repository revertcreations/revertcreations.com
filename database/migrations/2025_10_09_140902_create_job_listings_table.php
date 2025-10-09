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
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_source_id')->nullable()->constrained()->nullOnDelete();
            $table->string('external_id')->nullable();
            $table->string('title');
            $table->string('company')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_remote')->default(true);
            $table->string('employment_type')->nullable();
            $table->string('source_url');
            $table->string('apply_url')->nullable();
            $table->string('currency', 10)->nullable();
            $table->unsignedInteger('salary_min')->nullable();
            $table->unsignedInteger('salary_max')->nullable();
            $table->decimal('match_score', 5, 2)->nullable();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->json('tags')->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->timestamp('collected_at')->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->string('status')->default('new');
            $table->text('notes')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['job_source_id', 'external_id']);
            $table->index(['status', 'is_archived']);
            $table->index('posted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
