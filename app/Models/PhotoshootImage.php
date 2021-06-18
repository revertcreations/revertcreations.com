<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoshootImage extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function photoshoot()
    {
        return $this->belongsTo(Photoshoot::class);
    }

}
