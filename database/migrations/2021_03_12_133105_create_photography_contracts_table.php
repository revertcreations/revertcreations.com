<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhotographyContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('photography_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients');
            $table->foreignId('photoshoot_id')->constrained('photoshoots');
            $table->enum('status', ['client_pending', 'client_approved', 'client_declined', 'active', 'declined'])->default('client_pending');
            $table->decimal('late_fee_percentage',5,4)->default(0);
            $table->decimal('retainer_fee', 10, 2)->default(0);
            $table->tinyInteger('delivered_images_count')->nullable();
            $table->decimal('price_per_image',10,2)->nullable();
            $table->timestamps();
        });

        Schema::create('photography_contract_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photography_contract_id')->constrained('photography_contracts');
            $table->foreignId('address_id')->constrained('addresses');
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
        Schema::dropIfExists('photography_contracts');
        Schema::dropIfExists('photography_contract_addresses');
    }
}
