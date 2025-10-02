<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpportunityIngest extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_url',
        'raw_html',
        'raw_text',
        'note',
        'generate_note',
        'status',
        'opportunity_id',
        'meta',
        'errors',
    ];

    protected $casts = [
        'generate_note' => 'boolean',
        'meta' => 'array',
        'errors' => 'array',
    ];

    public function opportunity()
    {
        return $this->belongsTo(Opportunity::class);
    }
}
