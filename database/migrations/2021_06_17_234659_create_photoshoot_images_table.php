<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhotoshootImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('photoshoot_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photoshoot_id')->constrained('photoshoots');
            $table->string('public_id');
            $table->string('secure_path');
            $table->string('file_name');
            $table->string('extension');
            $table->boolean('selected');
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
        Schema::dropIfExists('photoshoot_images');
    }
}
