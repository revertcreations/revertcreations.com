<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CharacterPassTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Schema::dropIfExists('character_pass_metrics');
        Schema::create('character_pass_metrics', function (Blueprint $table) {
            $table->date('day');
            $table->string('event', 40);
            $table->unsignedBigInteger('count')->default(0);
            $table->primary(['day', 'event']);
        });
    }

    public function test_character_pass_has_a_real_checkout_and_bounded_scope(): void
    {
        $this->get('/character-pass')
            ->assertOk()
            ->assertSee('$275')
            ->assertSee('https://buy.stripe.com/fZu28rdnldcb6ji0rT87K01', false)
            ->assertSee('application/ld+json', false)
            ->assertSee(route('character-pass.checkout'))
            ->assertDontSee('googletagmanager.com', false)
            ->assertSee(route('character-pass.sample'))
            ->assertSee('No implementation')
            ->assertSee('One revision', false);
    }

    public function test_character_pass_thanks_page_is_available(): void
    {
        $this->get('/character-pass/thanks')
            ->assertOk()
            ->assertSee('Your page is in the queue.');
    }

    public function test_character_pass_sample_is_specific_and_truthful(): void
    {
        $this->get('/character-pass/sample')
            ->assertOk()
            ->assertSee('Visual diagnosis')
            ->assertSee('Focused concept')
            ->assertDontSee('googletagmanager.com', false)
            ->assertSee('Prioritized edit plan')
            ->assertSee('does not prove that the proposed direction will sell more');
    }

    public function test_home_page_links_to_character_pass(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee(route('character-pass'));
    }

    public function test_first_party_funnel_metrics_are_aggregate_and_internal_checks_are_excluded(): void
    {
        $this->withHeader('User-Agent', 'RevertInternal verifier')->get('/character-pass')->assertOk();
        $this->withHeader('User-Agent', 'Mozilla test visitor')->get('/character-pass')->assertOk();
        $this->withHeader('User-Agent', 'Mozilla test visitor')->get('/character-pass/sample')->assertOk();
        $this->withHeader('User-Agent', 'Mozilla test visitor')->get('/character-pass/checkout')
            ->assertRedirect('https://buy.stripe.com/fZu28rdnldcb6ji0rT87K01');

        $this->get('/character-pass/evidence.json')
            ->assertOk()
            ->assertExactJson([
                'aggregateOnly' => true,
                'measurement' => 'request counts, not unique people',
                'offerViews' => 1,
                'sampleViews' => 1,
                'checkoutClicks' => 1,
            ]);
    }

    public function test_search_discovery_files_include_character_pass(): void
    {
        $this->assertStringContainsString(
            'https://revertcreations.com/character-pass',
            file_get_contents(public_path('sitemap.xml')),
        );
        $this->assertStringContainsString(
            'https://revertcreations.com/sitemap.xml',
            file_get_contents(public_path('robots.txt')),
        );
    }
}
