@php
    $linksInput = old('links') ?? collect($project->links ?? [])
        ->map(fn ($link) => ($link['label'] ?? '').'|'.($link['url'] ?? ''))
        ->implode(PHP_EOL);

    $techStackInput = old('tech_stack') ?? implode(', ', $project->tech_stack ?? []);
@endphp

<div class="space-y-6">
    <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input
            type="text"
            name="name"
            value="{{ old('name', $project->name) }}"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Slug (optional)</label>
            <input
                type="text"
                name="slug"
                value="{{ old('slug', $project->slug) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="junkyard-watchdog"
            >
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
                name="status"
                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
                @foreach($statuses as $value => $label)
                    <option value="{{ $value }}" @selected(old('status', $project->status) === $value)>
                        {{ $label }}
                    </option>
                @endforeach
            </select>
        </div>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Tagline</label>
        <input
            type="text"
            name="tagline"
            value="{{ old('tagline', $project->tagline) }}"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="A mobile companion for every salvage yard"
        >
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Summary</label>
        <textarea
            name="summary"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >{{ old('summary', $project->summary) }}</textarea>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Long Description (Markdown)</label>
        <textarea
            name="body"
            rows="10"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="## Overview&#10;Detail the mission, features, and roadmap..."
        >{{ old('body', $project->body) }}</textarea>
        <p class="mt-2 text-xs text-gray-500">Supports Markdown formatting.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Hero image URL</label>
            <input
                type="url"
                name="hero_image_url"
                value="{{ old('hero_image_url', $project->hero_image_url) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://res.cloudinary.com/.../hero.jpg"
            >
            <p class="mt-1 text-xs text-gray-500">Upload via Cloudinary and paste the secure URL.</p>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Hero video URL (optional)</label>
            <input
                type="url"
                name="hero_video_url"
                value="{{ old('hero_video_url', $project->hero_video_url) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
            >
        </div>
    </div>

    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h2 class="text-sm font-semibold text-gray-700">Upload hero image</h2>
        <p class="mt-1 text-xs text-gray-500">Upload an image to Cloudinary and we will fill the hero URL automatically.</p>
        <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
                type="file"
                id="project-hero-upload-input"
                accept="image/*"
                class="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            >
            <button type="button" id="project-hero-upload-button" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Upload hero image
            </button>
        </div>
        <p id="project-hero-upload-status" class="mt-2 text-xs text-gray-500"></p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Primary link label</label>
            <input
                type="text"
                name="primary_link_label"
                value="{{ old('primary_link_label', $project->primary_link_label) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="View on the App Store"
            >
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Primary link URL</label>
            <input
                type="url"
                name="primary_link_url"
                value="{{ old('primary_link_url', $project->primary_link_url) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
        </div>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Additional links</label>
        <textarea
            name="links"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="GitHub|https://github.com/...&#10;Pitch Deck|https://..."
        >{{ $linksInput }}</textarea>
        <p class="mt-1 text-xs text-gray-500">One per line using <code>Label|https://example.com</code>.</p>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Tech stack</label>
        <input
            type="text"
            name="tech_stack"
            value="{{ $techStackInput }}"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Laravel, Livewire, Vue, Expo"
        >
        <p class="mt-1 text-xs text-gray-500">Comma-separated list.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-3">
        <div>
            <label class="block text-sm font-medium text-gray-700">Display order</label>
            <input
                type="number"
                name="display_order"
                value="{{ old('display_order', $project->display_order) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
                max="1000"
            >
        </div>
        <div class="flex items-center gap-2 pt-7">
            <input type="checkbox" name="is_featured" value="1" id="is_featured"
                @checked(old('is_featured', $project->is_featured))>
            <label for="is_featured" class="text-sm text-gray-700">Featured project</label>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Published at</label>
            <input
                type="datetime-local"
                name="published_at"
                value="{{ old('published_at', optional($project->published_at)->format('Y-m-d\TH:i')) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
        </div>
    </div>
</div>

<script>
    if (!window.__projectHeroUploaderInitialized) {
        window.__projectHeroUploaderInitialized = true;

        document.addEventListener('DOMContentLoaded', () => {
            const input = document.getElementById('project-hero-upload-input');
            const button = document.getElementById('project-hero-upload-button');
            const status = document.getElementById('project-hero-upload-status');
            const heroField = document.querySelector('input[name="hero_image_url"]');

            if (!input || !button || !heroField) {
                return;
            }

            const setStatus = (message, variant = 'info') => {
                status.textContent = message;
                status.className = `mt-2 text-xs ${variant === 'error' ? 'text-red-600' : 'text-gray-500'}`;
            };

            button.addEventListener('click', async () => {
                if (!input.files.length) {
                    setStatus('Select an image file first.', 'error');
                    return;
                }

                const formData = new FormData();
                formData.append('image', input.files[0]);
                setStatus('Uploading hero image…');

                try {
                    const response = await fetch('{{ route('project-assets.upload') }}', {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': '{{ csrf_token() }}',
                            'Accept': 'application/json',
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Upload failed');
                    }

                    const data = await response.json();
                    heroField.value = data.url;
                    setStatus('Upload complete. Hero image URL updated.');
                    input.value = '';
                } catch (error) {
                    console.error(error);
                    setStatus('Hero upload failed. Please try again.', 'error');
                }
            });
        });
    }
</script>
