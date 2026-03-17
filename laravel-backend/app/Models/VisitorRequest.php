<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorRequest extends Model
{
    protected $fillable = [
        'id', 'society_id', 'name', 'phone', 'flat', 'purpose', 'status', 'reason', 'timestamp', 'createdAt', 'exit_time', 'visitor_photo'
    ];

    public $incrementing = false;
    protected $keyType = 'string';
}
