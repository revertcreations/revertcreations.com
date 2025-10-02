<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'availability',
        'current_focus',
        'next_in_queue',
    ];
}
