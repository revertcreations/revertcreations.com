<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('puzzle_tokens', function (Blueprint $table) {
            $table->string('token')->primary();
            $table->foreignId('puzzle_session_id')->index();
            $table->dateTime('expires_at')->default(Carbon::now()->add(2, 'minutes'));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('puzzle_token');
    }
};
