<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('opportunity_ingests', function (Blueprint $table) {
            $table->id();
            $table->string('source_url');
            $table->longText('raw_html')->nullable();
            $table->longText('raw_text')->nullable();
            $table->text('note')->nullable();
            $table->boolean('generate_note')->default(false);
            $table->string('status')->default('queued');
            $table->foreignId('opportunity_id')->nullable()->constrained()->nullOnDelete();
            $table->json('meta')->nullable();
            $table->json('errors')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opportunity_ingests');
    }
};
