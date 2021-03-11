<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function addresses()
    {
        return $this->hasManyThrough(Address::class, ClientAddress::class);
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class);
    }
}
