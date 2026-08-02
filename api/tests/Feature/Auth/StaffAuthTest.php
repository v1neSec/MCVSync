<?php

use App\Models\Employee;
use App\Models\Permission;
use App\Models\Role;

test('staff can log in with correct credentials and only the staff guard is authenticated', function () {
    $user = makeStaffUser();

    $response = $this->postJson('/api/staff/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertOk();
    $this->assertAuthenticated('staff');
    $this->assertGuest('client');
});

test('staff login fails with an incorrect password', function () {
    $user = makeStaffUser();

    $response = $this->postJson('/api/staff/auth/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertUnprocessable();
    $this->assertGuest('staff');
});

test('an inactive staff account is rejected at login even with correct credentials', function () {
    $user = makeStaffUser(['is_active' => false]);

    $response = $this->postJson('/api/staff/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertUnprocessable();
    $this->assertGuest('staff');
});

test('me returns the role, branch, and permissions for the authenticated staff user', function () {
    $user = makeStaffUser();
    $employee = Employee::where('user_id', $user->id)->first();
    $role = Role::firstOrCreate(['name' => 'sales']);
    $permission = Permission::firstOrCreate(['name' => 'cof.create']);
    $role->permissions()->sync([$permission->id]);
    $employee->roles()->sync([$role->id]);

    $this->actingAs($user, 'staff');

    $response = $this->getJson('/api/staff/auth/me');

    $response->assertOk()
        ->assertJsonPath('email', $user->email)
        ->assertJsonPath('role', 'sales')
        ->assertJsonPath('branch.code', 'APALIT');

    expect($response->json('permissions'))->toContain('cof.create');
});

test('logout clears the staff session so protected routes reject further requests', function () {
    $user = makeStaffUser();

    $this->postJson('/api/staff/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertOk();

    $this->postJson('/api/staff/auth/logout')->assertOk();

    $this->assertGuest('staff');
    $this->getJson('/api/staff/auth/me')->assertUnauthorized();
});
