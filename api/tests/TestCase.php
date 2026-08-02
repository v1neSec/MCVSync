<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Sanctum's stateful middleware (session/cookie auth) only attaches
        // when the request looks like it came from a configured frontend
        // domain. Feature tests exercise the same session-cookie login flow
        // the real app/portal SPAs use, so they need a matching Referer.
        $this->withHeader('Referer', config('app.frontend_url'));
    }
}
