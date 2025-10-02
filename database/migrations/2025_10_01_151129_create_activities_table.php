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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->timestamp('occurred_at')->useCurrent();
            $table->string('category')->nullable();
            $table->string('headline');
            $table->text('body')->nullable();
            $table->string('link')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('public_visibility')->default(true);
            $table->timestamps();

            $table->index('occurred_at');
            $table->index('category');
            $table->index('public_visibility');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
