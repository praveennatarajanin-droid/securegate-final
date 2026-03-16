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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('flat');
            $table->string('block')->nullable();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('status')->default('Active');
            $table->integer('family')->default(1);
            $table->string('vehicle')->nullable();
            $table->date('moveIn')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
