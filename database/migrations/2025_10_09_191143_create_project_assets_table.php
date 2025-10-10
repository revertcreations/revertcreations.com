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
        Schema::create('project_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_update_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type')->default('image');
            $table->string('title')->nullable();
            $table->text('caption')->nullable();
            $table->string('url');
            $table->string('preview_url')->nullable();
            $table->string('provider')->nullable();
            $table->json('meta')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['project_id', 'display_order']);
            $table->index(['project_id', 'type']);
            $table->index(['project_update_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_assets');
    }
};
