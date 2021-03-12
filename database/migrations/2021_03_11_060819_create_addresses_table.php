<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['billing', 'shipping', 'primary', 'archived', 'photoshoot'])->default('primary');
            $table->string('street_address');
            $table->string('street_address_2')->nullable();
            $table->string('city');
            $table->string('state_code');
            $table->char('country_code', 2);
            $table->integer('postal_code')->nullable();
            $table->timestamps();
        });

        Schema::create('address_client', function(Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients');
            $table->foreignId('address_id')->constrained('addresses');
            $table->timestamps();
        });

        Schema::create('address_photoshoot', function(Blueprint $table){
            $table->foreignId('photoshoot_id')->constrained('photoshoots');
            $table->foreignId('address_id')->contrained('addresses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('address_client');
        Schema::dropIfExists('address_photoshoot');
    }
}
