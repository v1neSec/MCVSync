<?php

use App\Models\Branch;
use App\Models\Employee;

test('any authenticated staff can list branches', function () {
    $user = makeStaffUser();
    assignStaffRole($user, 'sales');

    $response = $this->actingAs($user, 'staff')->getJson('/api/staff/branches');

    $response->assertOk();
    expect($response->json())->not->toBeEmpty();
});

test('admin can list employees with role and branch shape', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $target = makeStaffUser();
    assignStaffRole($target, 'sales');

    $response = $this->actingAs($admin, 'staff')->getJson('/api/staff/employees');

    $response->assertOk();
    $response->assertJsonFragment(['email' => $target->email, 'role' => 'sales']);
});

test('sales cannot list employees', function () {
    $user = makeStaffUser();
    assignStaffRole($user, 'sales');

    $this->actingAs($user, 'staff')->getJson('/api/staff/employees')->assertForbidden();
});

test('admin can create a staff account with no role assigned', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');
    $branch = Branch::first();

    $response = $this->actingAs($admin, 'staff')->postJson('/api/staff/employees', [
        'name' => 'New Hire',
        'email' => 'new.hire@mcvsync.test',
        'password' => 'password123',
        'branch_id' => $branch->id,
    ]);

    $response->assertCreated();
    $response->assertJsonPath('name', 'New Hire');
    $response->assertJsonPath('role', null);
    $this->assertDatabaseHas('users', ['email' => 'new.hire@mcvsync.test', 'type' => 'staff']);
});

test('creating an employee rejects an email already used by a client', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');
    $client = makeClientUser();

    $response = $this->actingAs($admin, 'staff')->postJson('/api/staff/employees', [
        'name' => 'Duplicate Email',
        'email' => $client->email,
        'password' => 'password123',
        'branch_id' => Branch::first()->id,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('email');
});

test('attempting to smuggle a role through the create payload is rejected', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $response = $this->actingAs($admin, 'staff')->postJson('/api/staff/employees', [
        'name' => 'Sneaky',
        'email' => 'sneaky@mcvsync.test',
        'password' => 'password123',
        'branch_id' => Branch::first()->id,
        'role' => 'super_admin',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('role');
});

test('admin can update a staff account', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $target = makeStaffUser();
    assignStaffRole($target, 'sales');
    $employee = Employee::where('user_id', $target->id)->first();
    $newBranch = Branch::firstOrCreate(['code' => 'CEBU'], ['name' => 'Cebu', 'address' => 'Cebu', 'is_main' => false]);

    $response = $this->actingAs($admin, 'staff')->patchJson("/api/staff/employees/{$employee->id}", [
        'name' => 'Updated Name',
        'email' => $target->email,
        'branch_id' => $newBranch->id,
    ]);

    $response->assertOk();
    $response->assertJsonPath('name', 'Updated Name');
    $response->assertJsonPath('branch.code', 'CEBU');
});

test('admin cannot edit an employee whose current role is admin or super admin', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $otherAdmin = makeStaffUser();
    assignStaffRole($otherAdmin, 'admin');
    $employee = Employee::where('user_id', $otherAdmin->id)->first();

    $response = $this->actingAs($admin, 'staff')->patchJson("/api/staff/employees/{$employee->id}", [
        'name' => 'Hijacked',
        'email' => $otherAdmin->email,
        'branch_id' => null,
    ]);

    $response->assertForbidden();
});

test('super admin can edit an employee whose current role is admin', function () {
    $superAdmin = makeStaffUser();
    assignStaffRole($superAdmin, 'super_admin');

    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');
    $employee = Employee::where('user_id', $admin->id)->first();

    $response = $this->actingAs($superAdmin, 'staff')->patchJson("/api/staff/employees/{$employee->id}", [
        'name' => 'Renamed Admin',
        'email' => $admin->email,
        'branch_id' => null,
    ]);

    $response->assertOk();
    $response->assertJsonPath('name', 'Renamed Admin');
});

test('admin can deactivate and reactivate a staff account', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $target = makeStaffUser();
    assignStaffRole($target, 'sales');
    $employee = Employee::where('user_id', $target->id)->first();

    $this->actingAs($admin, 'staff')
        ->postJson("/api/staff/employees/{$employee->id}/deactivate")
        ->assertOk()
        ->assertJsonPath('is_active', false);

    $this->assertDatabaseHas('users', ['id' => $target->id, 'is_active' => false]);

    $loginAttempt = $this->postJson('/api/staff/auth/login', [
        'email' => $target->email,
        'password' => 'password',
    ]);
    $loginAttempt->assertUnprocessable();

    $this->actingAs($admin, 'staff')
        ->postJson("/api/staff/employees/{$employee->id}/activate")
        ->assertOk()
        ->assertJsonPath('is_active', true);
});
