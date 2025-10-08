<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePostRequest;
use App\Http\Requests\Admin\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::orderByDesc('published_at')->paginate(15);

        return view('admin.posts.index', compact('posts'));
    }

    public function create()
    {
        return view('admin.posts.create');
    }

    public function store(StorePostRequest $request)
    {
        Post::create($this->buildPostAttributes($request));

        return redirect()
            ->route('admin.posts.index')
            ->with('status', 'Post created.');
    }

    public function edit(Post $post)
    {
        return view('admin.posts.edit', compact('post'));
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $post->update($this->buildPostAttributes($request, $post));

        return redirect()
            ->route('admin.posts.edit', $post)
            ->with('status', 'Post updated.');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()
            ->route('admin.posts.index')
            ->with('status', 'Post deleted.');
    }

    protected function buildPostAttributes($request, ?Post $post = null): array
    {
        $rawSlug = $request->filled('slug')
            ? $request->input('slug')
            : $request->input('title');

        $slug = $this->uniqueSlug(Str::slug($rawSlug ?? ''), $post?->id);

        $content = $request->input('content', $post?->content ?? '');
        if ($request->hasFile('content_file')) {
            $uploaded = $request->file('content_file');
            $content = (string) file_get_contents($uploaded->getRealPath());
        }

        return [
            'title' => $request->input('title'),
            'slug' => $slug,
            'excerpt' => $request->input('excerpt'),
            'content' => $content,
            'published' => $request->boolean('published'),
            'published_at' => Carbon::parse($request->input('published_at')),
        ];
    }

    protected function uniqueSlug(string $baseSlug, ?int $ignoreId = null): string
    {
        $slug = $baseSlug !== '' ? $baseSlug : 'post';
        $originalSlug = $slug;
        $suffix = 2;

        while (
            Post::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$originalSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
