<?php

namespace App\View\Components;

use Illuminate\View\Component;

class IngestStatusBadge extends Component
{
    public string $status;

    public function __construct(?string $status)
    {
        $this->status = $status ?: 'queued';
    }

    public function render()
    {
        $variant = match ($this->status) {
            'drafted' => 'bg-gruvbox-green/25 text-gruvbox-green',
            'processing' => 'bg-gruvbox-yellow/25 text-gruvbox-light-yellow',
            'failed' => 'bg-gruvbox-red/25 text-gruvbox-light-red',
            default => 'bg-gruvbox-highlight/60 text-gruvbox-gray',
        };

        return view('components.ingest-status-badge', [
            'variant' => $variant,
            'label' => ucfirst(str_replace('_', ' ', $this->status)),
        ]);
    }
}
