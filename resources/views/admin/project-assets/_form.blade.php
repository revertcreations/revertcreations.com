@php
    $projectOptions = $projects;
    $selectedProject = old('project_id', $asset->project_id);
    $selectedUpdate = old('project_update_id', $asset->project_update_id);
@endphp

<div class="space-y-6">
    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Project</label>
            <select
                name="project_id"
                id="project-select"
                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
            >
                <option value="">Select project</option>
                @foreach($projectOptions as $project)
                    <option value="{{ $project['id'] }}" @selected($selectedProject == $project['id'])>
                        {{ $project['name'] }}
                    </option>
                @endforeach
            </select>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Attach to update (optional)</label>
            <select
                name="project_update_id"
                id="project-update-select"
                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
                <option value="">Standalone asset</option>
                @foreach($projectOptions as $project)
                    <optgroup label="{{ $project['name'] }}">
                        @forelse($project['updates'] as $update)
                            <option value="{{ $update['id'] }}" data-project="{{ $project['id'] }}" @selected($selectedUpdate == $update['id'])>
                                {{ $update['title'] }}
                            </option>
                        @empty
                            <option value="" disabled data-project="{{ $project['id'] }}">No updates yet</option>
                        @endforelse
                    </optgroup>
                @endforeach
            </select>
            <p class="mt-1 text-xs text-gray-500">Useful for screenshots or artifacts tied to a specific update.</p>
        </div>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select
                name="type"
                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
                @foreach($types as $value => $label)
                    <option value="{{ $value }}" @selected(old('type', $asset->type) === $value)>
                        {{ $label }}
                    </option>
                @endforeach
            </select>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Provider (optional)</label>
            <input
                type="text"
                name="provider"
                value="{{ old('provider', $asset->provider) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="cloudinary, youtube, figma"
            >
        </div>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input
            type="text"
            name="title"
            value="{{ old('title', $asset->title) }}"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="App Store hero"
        >
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Caption (optional)</label>
        <textarea
            name="caption"
            rows="2"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >{{ old('caption', $asset->caption) }}</textarea>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Asset URL</label>
            <input
                type="url"
                name="url"
                value="{{ old('url', $asset->url) }}"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://res.cloudinary.com/.../asset.jpg"
            >
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Preview URL (optional)</label>
            <input
                type="url"
                name="preview_url"
                value="{{ old('preview_url', $asset->preview_url) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://res.cloudinary.com/.../preview.jpg"
            >
        </div>
    </div>

    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h2 class="text-sm font-semibold text-gray-700">Upload asset</h2>
        <p class="mt-1 text-xs text-gray-500">Upload to Cloudinary and we will fill the asset URL automatically.</p>
        <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
                type="file"
                id="project-asset-upload-input"
                accept="image/*"
                class="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            >
            <button type="button" id="project-asset-upload-button" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Upload asset
            </button>
        </div>
        <p id="project-asset-upload-status" class="mt-2 text-xs text-gray-500"></p>
    </div>

    <div class="grid gap-6 sm:grid-cols-3">
        <div>
            <label class="block text-sm font-medium text-gray-700">Display order</label>
            <input
                type="number"
                name="display_order"
                value="{{ old('display_order', $asset->display_order) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
                max="1000"
            >
        </div>
        <div class="flex items-center gap-2 pt-7">
            <input type="checkbox" name="is_featured" value="1" id="is_featured" @checked(old('is_featured', $asset->is_featured))>
            <label for="is_featured" class="text-sm text-gray-700">Featured asset</label>
        </div>
    </div>
</div>

<script>
    if (!window.__projectAssetFormInitialized) {
        window.__projectAssetFormInitialized = true;

        document.addEventListener('DOMContentLoaded', () => {
            const projectSelect = document.getElementById('project-select');
            const updateSelect = document.getElementById('project-update-select');
            const uploadInput = document.getElementById('project-asset-upload-input');
            const uploadButton = document.getElementById('project-asset-upload-button');
            const uploadStatus = document.getElementById('project-asset-upload-status');
            const urlField = document.querySelector('input[name="url"]');
            const previewField = document.querySelector('input[name="preview_url"]');

            const filterUpdates = () => {
                const projectId = projectSelect.value;
                Array.from(updateSelect.options).forEach(option => {
                    if (!option.dataset.project) {
                        return;
                    }

                    option.hidden = projectId && option.dataset.project !== projectId;
                });

                if (projectId && updateSelect.selectedOptions.length && updateSelect.selectedOptions[0].hidden) {
                    updateSelect.value = '';
                }
            };

            projectSelect.addEventListener('change', filterUpdates);
            filterUpdates();

            if (uploadButton && uploadInput && urlField) {
                const setStatus = (message, variant = 'info') => {
                    uploadStatus.textContent = message;
                    uploadStatus.className = `mt-2 text-xs ${variant === 'error' ? 'text-red-600' : 'text-gray-500'}`;
                };

                uploadButton.addEventListener('click', async () => {
                    if (!uploadInput.files.length) {
                        setStatus('Select an image first.', 'error');
                        return;
                    }

                    const formData = new FormData();
                    formData.append('image', uploadInput.files[0]);

                    setStatus('Uploading asset…');

                    try {
                        const response = await fetch('{{ route('admin.project-assets.upload') }}', {
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
                        urlField.value = data.url;
                        if (previewField && !previewField.value) {
                            previewField.value = data.preview_url || data.url;
                        }
                        setStatus('Upload complete. Asset URL updated.');
                        uploadInput.value = '';
                    } catch (error) {
                        console.error(error);
                        setStatus('Upload failed. Please try again.', 'error');
                    }
                });
            }
        });
    }
</script>
