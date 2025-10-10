@php
    $selectedStatus = old('status', $job->status);
    $selectedSource = old('job_source_id', $job->job_source_id);
    $tagList = old('tags', implode(', ', $job->tags ?? []));
@endphp
<x-admin-layout>
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">
                Edit job
            </h1>
            <p class="mt-1 text-sm text-gray-500">
                Update metadata or override scraped content.
            </p>
        </div>
    </header>

    <main>
        <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    @if($errors->any())
                        <div class="mb-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                            <ul class="list-disc pl-5 text-sm">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('admin.jobs.update', $job) }}" class="space-y-6">
                        @csrf
                        @method('PUT')

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Source</label>
                            <select name="job_source_id" class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                @foreach($sources as $id => $name)
                                    <option value="{{ $id }}" @selected((int) $selectedSource === (int) $id)>
                                        {{ $name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" value="{{ old('title', $job->title) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        </div>

                        <div class="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Company</label>
                                <input type="text" name="company" value="{{ old('company', $job->company) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Location</label>
                                <input type="text" name="location" value="{{ old('location', $job->location) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="is_remote" name="is_remote" value="1" @checked(old('is_remote', $job->is_remote))>
                            <label for="is_remote" class="text-sm text-gray-700">Remote friendly</label>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Employment type</label>
                            <input type="text" name="employment_type" value="{{ old('employment_type', $job->employment_type) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Source URL</label>
                            <input type="url" name="source_url" value="{{ old('source_url', $job->source_url) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Apply URL</label>
                            <input type="url" name="apply_url" value="{{ old('apply_url', $job->apply_url) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Summary</label>
                            <textarea name="summary" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">{{ old('summary', $job->summary) }}</textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" rows="6" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">{{ old('description', $job->description) }}</textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Tags</label>
                            <input type="text" name="tags" value="{{ $tagList }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        </div>

                        <div class="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Match score</label>
                                <input type="number" name="match_score" min="0" max="100" step="0.1" value="{{ old('match_score', $job->match_score) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Posted at</label>
                                <input type="date" name="posted_at" value="{{ old('posted_at', optional($job->posted_at)->format('Y-m-d')) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Applied at</label>
                            <input type="date" name="applied_at" value="{{ old('applied_at', optional($job->applied_at)->format('Y-m-d')) }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea name="notes" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">{{ old('notes', $job->notes) }}</textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value="new" @selected($selectedStatus === 'new')>New</option>
                                <option value="interested" @selected($selectedStatus === 'interested')>Interested</option>
                                <option value="applied" @selected($selectedStatus === 'applied')>Applied</option>
                                <option value="interviewing" @selected($selectedStatus === 'interviewing')>Interviewing</option>
                                <option value="denied" @selected($selectedStatus === 'denied')>Denied</option>
                                <option value="accepted" @selected($selectedStatus === 'accepted')>Accepted</option>
                                <option value="archived" @selected($selectedStatus === 'archived')>Archived</option>
                            </select>
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="is_archived" name="is_archived" value="1" @checked(old('is_archived', $job->is_archived))>
                            <label for="is_archived" class="text-sm text-gray-700">Archive this job</label>
                        </div>

                        <div class="flex items-center justify-between gap-3">
                            <a href="{{ route('admin.jobs.show', $job) }}" class="text-sm text-gray-500 hover:text-gray-700">Cancel</a>
                            <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Update job
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</x-admin-layout>
