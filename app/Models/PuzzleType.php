<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuzzleType extends Model
{
    use HasFactory;

    public function scores() {
        return $this->hasMany(PuzzleScore::class);
    }

    public function sessions() {
        return $this->hasMany(PuzzleSession::class);
    }
}
