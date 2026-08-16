<?php

use App\Models\Item;
use App\Models\Unit;

test('purchasing can list, create, update, and delete units', function () {
    $user = makeStaffUser();
    assignStaffRole($user, 'purchasing');

    $create = $this->actingAs($user, 'staff')->postJson('/api/staff/inventory/units', [
        'code' => 'kg',
        'name' => 'Kilograms',
    ]);
    $create->assertCreated();
    $unitId = $create->json('id');

    $update = $this->actingAs($user, 'staff')->patchJson("/api/staff/inventory/units/{$unitId}", [
        'code' => 'kg',
        'name' => 'Kilogram',
    ]);
    $update->assertOk();
    $update->assertJsonPath('name', 'Kilogram');

    $this->actingAs($user, 'staff')
        ->deleteJson("/api/staff/inventory/units/{$unitId}")
        ->assertNoContent();
});

test('super admin and admin can both write units', function () {
    $superAdmin = makeStaffUser();
    assignStaffRole($superAdmin, 'super_admin');

    $this->actingAs($superAdmin, 'staff')
        ->postJson('/api/staff/inventory/units', ['code' => 'pcs', 'name' => 'Pieces'])
        ->assertCreated();

    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $this->actingAs($admin, 'staff')
        ->postJson('/api/staff/inventory/units', ['code' => 'box', 'name' => 'Box'])
        ->assertCreated();
});

test('deleting a unit still assigned to an item is rejected', function () {
    $purchasing = makeStaffUser();
    assignStaffRole($purchasing, 'purchasing');

    $unit = Unit::factory()->create();
    Item::factory()->create(['unit_id' => $unit->id]);

    $this->actingAs($purchasing, 'staff')
        ->deleteJson("/api/staff/inventory/units/{$unit->id}")
        ->assertUnprocessable();
});
