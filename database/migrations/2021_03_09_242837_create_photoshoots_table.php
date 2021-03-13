<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhotoshootsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('photoshoots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients');
            $table->foreignId('photography_contract_id')->nullable();
            $table->enum('status', ['pending', 'approved', 'archived', 'complete'])->default('pending');
            $table->dateTime('arrival_at')->nullable();
            $table->dateTime('event_starts')->nullable();
            $table->dateTime('event_ends')->nullable();
            $table->dateTime('deadline')->nullable();
            $table->string('public_token');
            $table->string('title');
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('photoshoots');
    }
}
