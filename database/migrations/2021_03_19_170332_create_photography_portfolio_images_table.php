<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhotographyPortfolioImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('photography_portfolio_images', function (Blueprint $table) {
            $table->id();
            $table->string('public_id');
            $table->string('secure_path');
            $table->string('file_name');
            $table->string('extension');
            $table->enum('status', ['active', 'draft', 'archived']);
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
        Schema::dropIfExists('photography_portfolio_images');
    }
}
