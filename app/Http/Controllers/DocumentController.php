<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function __invoke(string $path)
    {
        $cleanPath = trim($path, '/');

        abort_if(str_contains($cleanPath, '..'), 404);

        $fullPath = base_path('docs/' . $cleanPath . '.md');

        if (! File::exists($fullPath)) {
            $fullPath = base_path('docs/' . $cleanPath);
        }

        abort_if(! File::exists($fullPath), 404);

        $contents = File::get($fullPath);
        $html = Str::of($contents)->markdown();

        $title = collect(explode("\n", $contents))
            ->first(fn ($line) => Str::startsWith($line, '#'));

        $title = $title ? Str::of($title)->replace('#', '')->trim() : ucfirst(basename($cleanPath));

        return view('docs.show', [
            'title' => $title,
            'html' => $html,
        ]);
    }
}
