<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class AdminPostController extends Controller
{
    public function index(): View
    {
        $posts = Post::orderByDesc('published_at')->get();

        return view('admin.posts.index', compact('posts'));
    }

    public function create(): View
    {
        $defaultPublishedAt = Carbon::now()->format('Y-m-d\TH:i');

        return view('admin.posts.create', compact('defaultPublishedAt'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'markdown_file' => ['nullable', 'file', 'mimetypes:text/plain,text/markdown', 'mimes:md,markdown,txt'],
            'published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $content = $this->resolveContent($request);
        if (blank($content)) {
            return back()
                ->withInput()
                ->withErrors(['content' => 'Provide markdown content or upload a markdown file.']);
        }

        $slug = $this->prepareSlug($validated['slug'] ?? null, $validated['title']);
        $publishedAt = $this->resolvePublishedAt($validated['published_at'] ?? null);
        $published = $request->boolean('published');
        $excerpt = $this->resolveExcerpt($validated['excerpt'] ?? null, $content);

        Post::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $content,
            'excerpt' => $excerpt,
            'published' => $published,
            'published_at' => $publishedAt,
        ]);

        return redirect()->route('posts.index')->with('status', 'Post created.');
    }

    public function edit(Post $post): View
    {
        $publishedAt = optional($post->published_at)->format('Y-m-d\TH:i');

        return view('admin.posts.edit', compact('post', 'publishedAt'));
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'markdown_file' => ['nullable', 'file', 'mimetypes:text/plain,text/markdown', 'mimes:md,markdown,txt'],
            'published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $content = $this->resolveContent($request, $post->content);
        if (blank($content)) {
            return back()
                ->withInput()
                ->withErrors(['content' => 'Provide markdown content or upload a markdown file.']);
        }

        $slug = $this->prepareSlug($validated['slug'] ?? null, $validated['title'], $post->id);
        $publishedAt = $this->resolvePublishedAt($validated['published_at'] ?? null, $post->published_at);
        $published = $request->boolean('published');
        $excerpt = $this->resolveExcerpt($validated['excerpt'] ?? null, $content);

        $post->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $content,
            'excerpt' => $excerpt,
            'published' => $published,
            'published_at' => $publishedAt,
        ]);

        return redirect()->route('posts.index')->with('status', 'Post updated.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('posts.index')->with('status', 'Post deleted.');
    }

    private function resolveContent(Request $request, ?string $default = null): ?string
    {
        if ($request->hasFile('markdown_file')) {
            return file_get_contents($request->file('markdown_file')->getRealPath());
        }

        if ($request->filled('content')) {
            return $request->input('content');
        }

        return $default;
    }

    private function resolvePublishedAt(?string $publishedAt, ?Carbon $fallback = null): Carbon
    {
        if ($publishedAt) {
            return Carbon::parse($publishedAt);
        }

        if ($fallback) {
            return $fallback;
        }

        return Carbon::now();
    }

    private function prepareSlug(?string $slug, string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($slug ?: $title);
        $uniqueSlug = $baseSlug;
        $counter = 1;

        while (
            Post::where('slug', $uniqueSlug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $uniqueSlug = Str::slug($baseSlug.'-'.$counter);
            $counter++;
        }

        return $uniqueSlug;
    }

    private function resolveExcerpt(?string $excerpt, string $content): string
    {
        if (!blank($excerpt)) {
            return $excerpt;
        }

        $html = Str::markdown($content);
        $text = trim(preg_replace('/\s+/', ' ', strip_tags($html)));

        return Str::limit($text, 200);
    }
}
