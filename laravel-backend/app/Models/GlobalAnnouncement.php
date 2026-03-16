<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlobalAnnouncement extends Model
{
    protected $fillable = [
        'title',
        'message',
        'type',
        'is_active',
        'expires_at'
    ];
}
