<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

class MailSettingsService
{
    /**
     * Apply mail settings from database to Laravel config.
     */
    public static function apply()
    {
        $mailer = Setting::get('mail_mailer', 'log');
        
        Config::set('mail.default', $mailer);
        
        if ($mailer === 'smtp') {
            Config::set('mail.mailers.smtp.host', Setting::get('mail_host', 'smtp.mailtrap.io'));
            Config::set('mail.mailers.smtp.port', Setting::get('mail_port', '2525'));
            Config::set('mail.mailers.smtp.username', Setting::get('mail_username'));
            Config::set('mail.mailers.smtp.password', Setting::get('mail_password'));
            Config::set('mail.mailers.smtp.encryption', Setting::get('mail_encryption', 'tls'));
        }

        Config::set('mail.from.address', Setting::get('mail_from_address', 'hello@securegate.com'));
        Config::set('mail.from.name', Setting::get('mail_from_name', 'SecureGate'));
        
        // Purge the resolved mailer instances so the new config is used immediately
        Mail::purge();
    }
}
