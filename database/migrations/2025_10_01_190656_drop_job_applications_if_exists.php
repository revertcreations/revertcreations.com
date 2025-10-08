<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('job_applications')) {
            Schema::disableForeignKeyConstraints();
            Schema::drop('job_applications');
            Schema::enableForeignKeyConstraints();
        }
    }

    public function down(): void
    {
        //
    }
};
