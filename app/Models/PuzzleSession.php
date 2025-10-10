<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuzzleSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'puzzle_type_id',
        'ip_address',
        'user_agent',
        'is_internal',
    ];

    protected $casts = [
        'is_internal' => 'boolean',
    ];

    public function token() {
        return $this->hasOne(PuzzleToken::class, 'puzzle_session_id');
    }

    public function scores() {
        return $this->hasMany(PuzzleScore::class);
    }

    public function puzzleType() {
        return $this->belongsTo(PuzzleType::class, 'puzzle_type_id');
    }
}
