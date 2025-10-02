<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('availability')->nullable();
            $table->string('current_focus')->nullable();
            $table->string('next_in_queue')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_statuses');
    }
};
