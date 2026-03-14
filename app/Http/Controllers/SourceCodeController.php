<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class SourceCodeController extends Controller
{
    public function __invoke(string $state): JsonResponse
    {
        $states = config('sourceviewer.states', []);

        if (!array_key_exists($state, $states)) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $stateConfig = $states[$state];
        $files = $stateConfig['files'] ?? [];

        if (empty($files)) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $payloadFiles = [];

        foreach ($files as $file) {
            $path = $file['path'] ?? null;
            if (!$path) {
                continue;
            }

            $realPath = realpath($path);
            if (!$realPath || !Str::startsWith($realPath, base_path())) {
                abort(Response::HTTP_FORBIDDEN);
            }

            if (!File::isFile($realPath)) {
                abort(Response::HTTP_NOT_FOUND);
            }

            $payloadFiles[] = [
                'displayName' => $file['display_name'] ?? basename($realPath),
                'language' => $file['language'] ?? 'text',
                'content' => File::get($realPath),
            ];
        }

        if (empty($payloadFiles)) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $payload = [
            'state' => $state,
            'label' => $stateConfig['label'] ?? ucfirst(str_replace('-', ' ', $state)),
            'description' => $stateConfig['description'] ?? null,
            'files' => $payloadFiles,
        ];

        return response()
            ->json($payload)
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    }
}
