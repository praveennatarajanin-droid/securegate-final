<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class AdminInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $admin;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct(User $admin, $password)
    {
        $this->admin = $admin;
        $this->password = $password;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Welcome to SecureGate - Your Admin Credentials')
                    ->view('emails.admin_invitation');
    }
}
