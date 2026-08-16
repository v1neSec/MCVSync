<?php

use App\Models\Category;
use App\Models\Item;

test('purchasing can list, create, update, and delete categories', function () {
    $user = makeStaffUser();
    assignStaffRole($user, 'purchasing');

    $create = $this->actingAs($user, 'staff')->postJson('/api/staff/inventory/categories', [
        'name' => 'Consumables',
    ]);
    $create->assertCreated();
    $create->assertJsonPath('name', 'Consumables');
    $categoryId = $create->json('id');

    $list = $this->actingAs($user, 'staff')->getJson('/api/staff/inventory/categories');
    $list->assertOk();
    expect($list->json())->toHaveCount(1);

    $update = $this->actingAs($user, 'staff')->patchJson("/api/staff/inventory/categories/{$categoryId}", [
        'name' => 'Machines',
    ]);
    $update->assertOk();
    $update->assertJsonPath('name', 'Machines');

    $this->actingAs($user, 'staff')
        ->deleteJson("/api/staff/inventory/categories/{$categoryId}")
        ->assertNoContent();

    expect(Category::find($categoryId))->toBeNull();
});

test('admin can read but not write categories', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');

    $this->actingAs($admin, 'staff')->getJson('/api/staff/inventory/categories')->assertOk();

    $this->actingAs($admin, 'staff')
        ->postJson('/api/staff/inventory/categories', ['name' => 'Reagents'])
        ->assertForbidden();
});

test('sales, accounting, and logistics have no access to categories at all', function () {
    foreach (['sales', 'accounting', 'logistics'] as $role) {
        $user = makeStaffUser();
        assignStaffRole($user, $role);

        $this->actingAs($user, 'staff')->getJson('/api/staff/inventory/categories')->assertForbidden();
    }
});

test('deleting a category still assigned to an item is rejected', function () {
    $admin = makeStaffUser();
    assignStaffRole($admin, 'purchasing');

    $category = Category::factory()->create();
    Item::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($admin, 'staff')->deleteJson("/api/staff/inventory/categories/{$category->id}");

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('category');
    expect(Category::find($category->id))->not->toBeNull();
});
