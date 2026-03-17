<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    protected $fillable = ['society_id', 'name', 'address', 'city', 'state', 'zip'];

    public function blocks()
    {
        return $this->hasMany(Block::class);
    }
}
