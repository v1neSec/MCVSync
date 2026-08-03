<?php

use App\Models\Employee;
use Spatie\Permission\Models\Role;

test('super admin can assign a branch scoped role to an employee with a branch', function () {
    $superAdmin = makeStaffUser();
    assignStaffRole($superAdmin, 'super_admin');
    Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'staff']);

    $target = makeStaffUser();
    $employee = Employee::where('user_id', $target->id)->first();

    $response = $this->actingAs($superAdmin, 'staff')->putJson("/api/staff/employees/{$employee->id}/role", [
        'role' => 'sales',
    ]);

    $response->assertOk();
    $response->assertJsonPath('role', 'sales');
});

test('assigning a branch scoped role fails validation without a branch set', function () {
    $superAdmin = makeStaffUser();
    assignStaffRole($superAdmin, 'super_admin');
    Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'staff']);

    $target = makeStaffUser();
    $employee = Employee::where('user_id', $target->id)->first();
    $employee->update(['branch_id' => null]);

    $response = $this->actingAs($superAdmin, 'staff')->putJson("/api/staff/employees/{$employee->id}/role", [
        'role' => 'sales',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('role');
});

test('assigning admin or super admin clears the employee branch', function () {
    $superAdmin = makeStaffUser();
    assignStaffRole($superAdmin, 'super_admin');
    Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'staff']);

    $target = makeStaffUser();
    $employee = Employee::where('user_id', $target->id)->first();
    expect($employee->branch_id)->not->toBeNull();

    $response = $this->actingAs($superAdmin, 'staff')->putJson("/api/staff/employees/{$employee->id}/role", [
        'role' => 'admin',
    ]);

    $response->assertOk();
    $response->assertJsonPath('branch', null);
    expect($employee->fresh()->branch_id)->toBeNull();
});

test('admin is forbidden from assigning employee roles', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');
    Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'staff']);

    $target = makeStaffUser();
    $employee = Employee::where('user_id', $target->id)->first();

    $this->actingAs($admin, 'staff')
        ->putJson("/api/staff/employees/{$employee->id}/role", ['role' => 'sales'])
        ->assertForbidden();
});

test('reassigning a role replaces the previous one rather than adding to it', function () {
    $superAdmin = makeStaffUser();
    assignStaffRole($superAdmin, 'super_admin');
    Role::firstOrCreate(['name' => 'accounting', 'guard_name' => 'staff']);

    $target = makeStaffUser();
    assignStaffRole($target, 'sales');
    $employee = Employee::where('user_id', $target->id)->first();

    $this->actingAs($superAdmin, 'staff')
        ->putJson("/api/staff/employees/{$employee->id}/role", ['role' => 'accounting'])
        ->assertOk();

    expect($target->fresh()->getRoleNames()->all())->toBe(['accounting']);
});
