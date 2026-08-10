<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A source tag proves a tagged URL was requested; it never proved a person
 * clicked anything. Recording Sec-Fetch-Site alongside it separates a click
 * on our own Buy button from a cold re-request of a URL captured days ago.
 *
 * Rows written before this migration keep origin "unlabelled" — they were
 * measured without the header and must not be read as either.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commercial_referral_metrics', function (Blueprint $table) {
            $table->string('origin', 12)->default('unlabelled')->after('source');
        });

        Schema::table('commercial_referral_metrics', function (Blueprint $table) {
            $table->dropPrimary();
            $table->primary(['day', 'destination', 'source', 'origin']);
        });
    }

    public function down(): void
    {
        // One (day, destination, source) can now hold several origin rows, so
        // the old primary key cannot be restored until the counts are folded
        // back together. Dropping the column first would lose that arithmetic.
        $folded = DB::table('commercial_referral_metrics')
            ->selectRaw('day, destination, source, SUM(count) AS total')
            ->groupBy('day', 'destination', 'source')
            ->get();

        DB::table('commercial_referral_metrics')->delete();

        Schema::table('commercial_referral_metrics', function (Blueprint $table) {
            $table->dropPrimary();
            $table->dropColumn('origin');
        });

        Schema::table('commercial_referral_metrics', function (Blueprint $table) {
            $table->primary(['day', 'destination', 'source']);
        });

        foreach ($folded as $row) {
            DB::table('commercial_referral_metrics')->insert([
                'day' => $row->day,
                'destination' => $row->destination,
                'source' => $row->source,
                'count' => (int) $row->total,
            ]);
        }
    }
};
