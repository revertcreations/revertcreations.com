<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ManagePostsTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticateAdmin(): Admin
    {
        $admin = Admin::factory()->create();
        $this->actingAs($admin);

        return $admin;
    }

    public function test_admin_can_view_post_index(): void
    {
        $this->authenticateAdmin();

        $posts = Post::factory()->count(2)->create();

        $response = $this->get(route('admin.posts.index'));

        $response
            ->assertOk()
            ->assertSee($posts->first()->title)
            ->assertSee($posts->last()->title);
    }

    public function test_admin_can_create_post_from_markdown_upload(): void
    {
        $this->authenticateAdmin();

        $markdown = "# Heading\n\nSome body content.";
        $file = UploadedFile::fake()->createWithContent('post.md', $markdown);

        $response = $this->post(route('admin.posts.store'), [
            'title' => 'My Test Post',
            'excerpt' => 'Short summary',
            'published' => true,
            'published_at' => now()->toDateTimeString(),
            'content_file' => $file,
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $post = Post::first();
        $this->assertNotNull($post);
        $this->assertEquals('my-test-post', $post->slug);
        $this->assertEquals($markdown, $post->content);
        $this->assertTrue($post->published);
    }

    public function test_admin_can_update_post_without_uploading_new_file(): void
    {
        $this->authenticateAdmin();

        $post = Post::factory()->create([
            'title' => 'Existing Post',
            'slug' => 'existing-post',
            'content' => 'Old content',
            'excerpt' => 'Old excerpt',
            'published' => true,
            'published_at' => now()->subDay(),
        ]);

        $response = $this->put(route('admin.posts.update', $post), [
            'title' => 'Existing Post',
            'slug' => 'existing-post',
            'excerpt' => 'Updated excerpt',
            'content' => 'Updated **markdown** content',
            'published' => false,
            'published_at' => now()->toDateTimeString(),
        ]);

        $response->assertRedirect(route('admin.posts.edit', $post));

        $post->refresh();

        $this->assertEquals('Updated **markdown** content', $post->content);
        $this->assertEquals('Updated excerpt', $post->excerpt);
        $this->assertFalse($post->published);
    }
}
