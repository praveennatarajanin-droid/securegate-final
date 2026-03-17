<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    //
    protected $fillable = [
        'society_id', 'name', 'flat', 'block', 'phone', 'email', 'additional_email', 'status', 'family', 'vehicle', 'moveIn'
    ];
}
