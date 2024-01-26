<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuzzleScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'hint_count',
        'score',
        'solve_time_in_seconds',
    ];

    public function puzzle() {
        return $this->belongsTo(PuzzleSession::class);
    }

    public function puzzleType() {
        return $this->hasOne(PuzzleType::class);
    }
}
