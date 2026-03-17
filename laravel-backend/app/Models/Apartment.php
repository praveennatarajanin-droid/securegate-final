<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Apartment extends Model
{
    protected $fillable = ['society_id', 'block_id', 'number'];

    public function block()
    {
        return $this->belongsTo(Block::class);
    }
}
