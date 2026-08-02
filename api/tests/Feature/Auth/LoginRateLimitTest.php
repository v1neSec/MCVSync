<?php

test('the portal login endpoint is throttled per IP independently of account lockout', function () {
    // Distinct emails so the (stricter, 3-attempt) account lockout never
    // kicks in first — this isolates the IP-based rate limiter (5/minute).
    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/portal/auth/login', [
            'email' => "nobody{$i}@example.com",
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    $response = $this->postJson('/api/portal/auth/login', [
        'email' => 'nobody5@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(429);
});
