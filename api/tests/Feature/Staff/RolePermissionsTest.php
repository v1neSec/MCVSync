<?php

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('admin can list roles with their current permissions', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $role = Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'staff']);
    $permission = Permission::firstOrCreate(['name' => 'cof.create', 'guard_name' => 'staff']);
    $role->syncPermissions([$permission]);

    $response = $this->actingAs($admin, 'staff')->getJson('/api/staff/roles');

    $response->assertOk();
    $response->assertJsonFragment(['name' => 'sales']);
});

test('admin can replace a role permission set', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $role = Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'staff']);
    $permissionA = Permission::firstOrCreate(['name' => 'cof.create', 'guard_name' => 'staff']);
    $permissionB = Permission::firstOrCreate(['name' => 'cof.view', 'guard_name' => 'staff']);

    $response = $this->actingAs($admin, 'staff')->putJson('/api/staff/roles/sales/permissions', [
        'permission_ids' => [$permissionA->id, $permissionB->id],
    ]);

    $response->assertOk();
    expect($role->fresh()->permissions->pluck('name')->sort()->values()->all())
        ->toBe(['cof.create', 'cof.view']);
});

test('super admin can also replace a role permission set', function () {
    $superAdmin = makeStaffUser();
    assignStaffRole($superAdmin, 'super_admin');

    Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'staff']);
    $permission = Permission::firstOrCreate(['name' => 'cof.create', 'guard_name' => 'staff']);

    $this->actingAs($superAdmin, 'staff')
        ->putJson('/api/staff/roles/sales/permissions', ['permission_ids' => [$permission->id]])
        ->assertOk();
});

test('a non admin role is forbidden from editing role permissions', function () {
    $sales = makeStaffUser();
    assignStaffRole($sales, 'sales');

    Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'staff']);

    $this->actingAs($sales, 'staff')
        ->putJson('/api/staff/roles/sales/permissions', ['permission_ids' => []])
        ->assertForbidden();
});

test('an invalid permission id rejects the whole request', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $role = Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'staff']);
    $valid = Permission::firstOrCreate(['name' => 'cof.create', 'guard_name' => 'staff']);

    $response = $this->actingAs($admin, 'staff')->putJson('/api/staff/roles/sales/permissions', [
        'permission_ids' => [$valid->id, 999999],
    ]);

    $response->assertUnprocessable();
    expect($role->fresh()->permissions)->toBeEmpty();
});
