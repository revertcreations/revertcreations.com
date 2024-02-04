<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PuzzleToken extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $primaryKey = 'token';
    protected $keyType = 'string';

    public function puzzle() {
        return $this->belongsTo(PuzzleSession::class, 'puzzle_session_id');
    }

    public function active($session_id) {
        return $this->where('session_id', $session_id);
    }

    public function generate() {
        return Str::random(40);
    }

    public function valid($puzzle_session_id, $token) {
        return $this->where('token', $token)
                    ->where('puzzle_session_id', $puzzle_session_id)
                    ->where('expires_at', '>=', now());
    }

}
