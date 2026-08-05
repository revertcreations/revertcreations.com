<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commercial_referral_metrics', function (Blueprint $table) {
            $table->date('day');
            $table->string('destination', 40);
            $table->string('source', 64);
            $table->unsignedBigInteger('count')->default(0);
            $table->primary(['day', 'destination', 'source']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commercial_referral_metrics');
    }
};
