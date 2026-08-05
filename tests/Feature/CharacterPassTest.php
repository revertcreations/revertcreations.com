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
            ->assertSee('No implementation')
            ->assertSee('One revision', false);
    }

    public function test_character_pass_thanks_page_is_available(): void
    {
        $this->get('/character-pass/thanks')
            ->assertOk()
            ->assertSee('Your page is in the queue.');
    }
}
