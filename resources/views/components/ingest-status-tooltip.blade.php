@props(['status' => null, 'ingest' => null])

@php
    $tooltip = null;
    if ($ingest && $ingest->meta) {
        $fetch = $ingest->meta['fetch'] ?? [];
        $tooltip = collect([
            isset($ingest->meta['structured']['host']) ? 'Host: ' . $ingest->meta['structured']['host'] : null,
            isset($fetch['status']) ? 'Fetch status: ' . $fetch['status'] : null,
            isset($fetch['error']) ? 'Fetch error: ' . $fetch['error'] : null,
        ])->filter()->implode('\n');
    }
@endphp

<span @if($tooltip) title="{{ $tooltip }}" @endif>
    <x-ingest-status-badge :status="$status" />
</span>
