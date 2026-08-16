<?php

use App\Models\Category;
use App\Models\Item;

test('a client can list only active items with a narrow field set', function () {
    $client = makeClientUser();

    $active = Item::factory()->create(['is_active' => true, 'reorder_point' => 10]);
    Item::factory()->create(['is_active' => false]);

    $response = $this->actingAs($client, 'client')->getJson('/api/portal/items');

    $response->assertOk();
    $ids = collect($response->json('data'))->pluck('id');
    expect($ids)->toContain($active->id);
    expect($ids)->toHaveCount(1);

    $row = collect($response->json('data'))->first();
    expect($row)->toHaveKeys(['id', 'name', 'category', 'unit', 'description']);
    expect($row)->not->toHaveKeys(['sku', 'barcode', 'reorder_point', 'reorder_quantity', 'has_expiry', 'is_active']);
});

test('a staff account cannot use the portal items endpoint', function () {
    $staff = makeStaffUser();
    assignStaffRole($staff, 'purchasing');

    $this->actingAs($staff, 'staff')->getJson('/api/portal/items')->assertUnauthorized();
});

test('a client cannot use the staff inventory endpoint', function () {
    $client = makeClientUser();

    $this->actingAs($client, 'client')->getJson('/api/staff/inventory/items')->assertUnauthorized();
});

test('a client can list categories for the catalog filter', function () {
    $client = makeClientUser();
    $category = Category::factory()->create(['name' => 'Consumables']);

    $response = $this->actingAs($client, 'client')->getJson('/api/portal/categories');

    $response->assertOk();
    expect(collect($response->json())->pluck('name'))->toContain('Consumables');
});

test('portal items are filterable by category and searchable by name', function () {
    $client = makeClientUser();

    $gloves = Item::factory()->create(['name' => 'Surgical Gloves', 'is_active' => true]);
    $syringe = Item::factory()->create(['name' => 'Syringe 5ml', 'is_active' => true, 'category_id' => $gloves->category_id]);
    $other = Item::factory()->create(['name' => 'Bandages', 'is_active' => true]);

    $byCategory = $this->actingAs($client, 'client')
        ->getJson("/api/portal/items?category_id={$gloves->category_id}");
    $categoryIds = collect($byCategory->json('data'))->pluck('id');
    expect($categoryIds)->toContain($gloves->id, $syringe->id)->not->toContain($other->id);

    $bySearch = $this->actingAs($client, 'client')->getJson('/api/portal/items?search=Glove');
    $searchIds = collect($bySearch->json('data'))->pluck('id');
    expect($searchIds)->toContain($gloves->id)->not->toContain($syringe->id, $other->id);
});
