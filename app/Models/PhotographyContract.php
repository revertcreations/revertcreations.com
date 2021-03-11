<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotographyContract extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function proposal()
    {
        return $this->hasOne(Proposal::class);
    }

    public function address()
    {
        return $this->hasManyThrough(Address::class, PhotographyContractAddress::class);
    }
}
