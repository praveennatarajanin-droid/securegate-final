<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->unsignedBigInteger('society_id')->nullable()->after('id');
            // Assuming society_id refers to ID in societies table
            // $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade');
        });

        Schema::table('communities', function (Blueprint $table) {
            $table->unsignedBigInteger('society_id')->nullable()->after('id');
        });

        Schema::table('blocks', function (Blueprint $table) {
            $table->unsignedBigInteger('society_id')->nullable()->after('id');
        });

        Schema::table('apartments', function (Blueprint $table) {
            $table->unsignedBigInteger('society_id')->nullable()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->dropColumn('society_id');
        });

        Schema::table('communities', function (Blueprint $table) {
            $table->dropColumn('society_id');
        });

        Schema::table('blocks', function (Blueprint $table) {
            $table->dropColumn('society_id');
        });

        Schema::table('apartments', function (Blueprint $table) {
            $table->dropColumn('society_id');
        });
    }
};
