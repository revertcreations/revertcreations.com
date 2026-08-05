<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('character_pass_attribution', function (Blueprint $table) {
            $table->date('day');
            $table->string('source', 64);
            $table->string('event', 40);
            $table->unsignedBigInteger('count')->default(0);
            $table->primary(['day', 'source', 'event']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('character_pass_attribution');
    }
};
