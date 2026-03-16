<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    protected $fillable = ['community_id', 'name'];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function apartments()
    {
        return $this->hasMany(Apartment::class);
    }
}
