<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->string('source_url')->nullable()->after('source_channel');
            $table->string('ingest_status')->nullable()->after('source_url');
            $table->json('ingest_payload')->nullable()->after('ingest_status');
            $table->longText('ingest_raw_content')->nullable()->after('ingest_payload');
            $table->json('ingest_errors')->nullable()->after('ingest_raw_content');
        });
    }

    public function down(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->dropColumn([
                'source_url',
                'ingest_status',
                'ingest_payload',
                'ingest_raw_content',
                'ingest_errors',
            ]);
        });
    }
};
