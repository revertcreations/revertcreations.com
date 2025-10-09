<?php

namespace App\Http\Controllers;

//use Illuminate\Http\Request;
use Illuminate\Support\Str;
use DOMDocument;

use App\Models\Post;

class BlogController extends Controller
{
    public function index()
    {
        $posts = Post::where('published', true)->get()->sortByDesc('published_at');
        return view('blog.index', compact('posts'));
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->firstOrFail();
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;

        $html = Str::of($post->content)->markdown();

        $previousUseErrors = libxml_use_internal_errors(true);
        $dom->loadHTML(
            '<?xml encoding="utf-8" ?>'.$html,
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previousUseErrors);

        foreach($dom->getElementsByTagName('p') as $paragraph) {
            $paragraph->setAttribute('class', 'py-4 text-gruvbox-white');
        }

        foreach($dom->getElementsByTagName('h2') as $h2) {
            $h2->setAttribute('class', 'text-gruvbox-blue text-3xl');
        }

        $post->html = $dom->saveHTML();
        return view('blog.show', compact('post'));
    }
}
