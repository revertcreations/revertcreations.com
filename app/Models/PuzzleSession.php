<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuzzleSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'puzzle_token_id',
        'session_id',
        'puzzle_type_id',
    ];

    public function token() {
        return $this->hasOne(PuzzleToken::class, 'puzzle_session_id');
    }

    public function scores() {
        return $this->hasMany(PuzzleScore::class);
    }
}
