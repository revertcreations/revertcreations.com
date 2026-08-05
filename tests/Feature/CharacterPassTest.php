<?php

namespace Tests\Feature;

use Tests\TestCase;

class CharacterPassTest extends TestCase
{
    public function test_character_pass_has_a_real_checkout_and_bounded_scope(): void
    {
        $this->get('/character-pass')
            ->assertOk()
            ->assertSee('$275')
            ->assertSee('https://buy.stripe.com/fZu28rdnldcb6ji0rT87K01', false)
            ->assertSee('application/ld+json', false)
            ->assertSee('character_pass_checkout_clicked', false)
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
            ->assertSee('character_pass_sample_cta_clicked', false)
            ->assertSee('Prioritized edit plan')
            ->assertSee('does not prove that the proposed direction will sell more');
    }

    public function test_home_page_links_to_character_pass(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee(route('character-pass'));
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
