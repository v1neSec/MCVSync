<?php

use App\Models\AuditLog;

test('a staff account locks after repeated failed attempts and blocks further attempts even with the correct password', function () {
    $user = makeStaffUser();

    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/staff/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    $response = $this->postJson('/api/staff/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertUnprocessable();
    $this->assertGuest('staff');
});

test('a client account locks after fewer failed attempts than staff, per the stricter portal policy', function () {
    $user = makeClientUser();

    for ($i = 0; $i < 3; $i++) {
        $this->postJson('/api/portal/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    $response = $this->postJson('/api/portal/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertUnprocessable();
    $this->assertGuest('client');
});

test('failed login attempts are audited without ever storing the submitted password', function () {
    $user = makeStaffUser();

    $this->postJson('/api/staff/auth/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertUnprocessable();

    $log = AuditLog::where('action', 'login.failed')->latest('id')->first();

    expect($log)->not->toBeNull();
    expect($log->metadata)->not->toHaveKey('password');
    expect(json_encode($log->metadata))->not->toContain('wrong-password');
});
