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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('tagline')->nullable();
            $table->text('summary')->nullable();
            $table->longText('body')->nullable();
            $table->string('status')->default('planning');
            $table->string('hero_image_url')->nullable();
            $table->string('hero_video_url')->nullable();
            $table->string('primary_link_label')->nullable();
            $table->string('primary_link_url')->nullable();
            $table->json('links')->nullable();
            $table->json('tech_stack')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'is_featured']);
            $table->index(['display_order', 'published_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
