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
        if (Schema::hasTable('opportunities')) {
            return;
        }

        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('source');
            $table->string('external_id')->nullable();
            $table->string('title');
            $table->string('company')->nullable();
            $table->string('location')->nullable();
            $table->string('tags')->nullable();
            $table->string('seniority')->nullable();
            $table->string('employment_type')->nullable();
            $table->text('url');
            $table->text('apply_url')->nullable();
            $table->longText('description')->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->timestamp('first_seen_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->string('status')->default('new');
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->unique(['source', 'url']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('opportunities')) {
            Schema::drop('opportunities');
        }
    }
};
