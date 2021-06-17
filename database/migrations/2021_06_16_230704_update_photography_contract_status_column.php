<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePhotographyContractStatusColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE `photography_contracts` CHANGE `status` `status` ENUM('client_pending', 'client_approved', 'client_declined', 'admin_pending', 'active', 'inactive', 'declined') DEFAULT 'client_pending';");

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
