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
        Schema::table('visitor_requests', function (Blueprint $table) {
            $table->longText('visitor_photo')->nullable();
            $table->string('exit_time')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitor_requests', function (Blueprint $table) {
            $table->dropColumn(['visitor_photo', 'exit_time']);
        });
    }
};
