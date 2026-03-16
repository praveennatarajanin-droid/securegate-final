<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Society extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'status',
        'email',
        'phone',
        'city',
        'state',
        'postal_code',
        'type',
        'unit_count',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
