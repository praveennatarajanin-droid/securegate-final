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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });

        // Seed initial SMTP placeholders
        $defaults = [
            ['key' => 'mail_mailer', 'value' => 'log', 'group' => 'mail'],
            ['key' => 'mail_host', 'value' => 'smtp.mailtrap.io', 'group' => 'mail'],
            ['key' => 'mail_port', 'value' => '2525', 'group' => 'mail'],
            ['key' => 'mail_username', 'value' => '', 'group' => 'mail'],
            ['key' => 'mail_password', 'value' => '', 'group' => 'mail'],
            ['key' => 'mail_encryption', 'value' => 'tls', 'group' => 'mail'],
            ['key' => 'mail_from_address', 'value' => 'hello@securegate.com', 'group' => 'mail'],
            ['key' => 'mail_from_name', 'value' => 'SecureGate', 'group' => 'mail'],
        ];

        foreach ($defaults as $default) {
            \Illuminate\Support\Facades\DB::table('settings')->insert(array_merge($default, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
