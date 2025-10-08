<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function testApplicationBootsSuccessfully(): void
    {
        $this->assertTrue(app()->isBooted());
    }
}
