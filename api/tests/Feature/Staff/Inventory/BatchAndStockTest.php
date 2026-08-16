<?php

use App\Models\Batch;
use App\Models\Branch;
use App\Models\Item;
use App\Models\StockReservation;
use App\Models\StockTransaction;

test('a branch-scoped purchasing user only sees batches at their own branch', function () {
    $apalit = Branch::firstOrCreate(['code' => 'APALIT'], ['name' => 'Apalit', 'address' => 'Apalit', 'is_main' => true]);
    $cebu = Branch::firstOrCreate(['code' => 'CEBU'], ['name' => 'Cebu', 'address' => 'Cebu', 'is_main' => false]);

    $user = makeStaffUser([], 'APALIT');
    assignStaffRole($user, 'purchasing');

    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $apalit->id]);
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $cebu->id]);

    $response = $this->actingAs($user, 'staff')->getJson("/api/staff/inventory/items/{$item->id}/batches");

    $response->assertOk();
    $batches = collect($response->json('data'));
    expect($batches)->toHaveCount(1);
    expect($batches->first()['branch']['code'])->toBe('APALIT');
});

test('admin sees batches across every branch', function () {
    $apalit = Branch::firstOrCreate(['code' => 'APALIT'], ['name' => 'Apalit', 'address' => 'Apalit', 'is_main' => true]);
    $cebu = Branch::firstOrCreate(['code' => 'CEBU'], ['name' => 'Cebu', 'address' => 'Cebu', 'is_main' => false]);

    $admin = makeStaffUser([], 'APALIT');
    assignStaffRole($admin, 'admin');

    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $apalit->id]);
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $cebu->id]);

    $response = $this->actingAs($admin, 'staff')->getJson("/api/staff/inventory/items/{$item->id}/batches");

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(2);
});

test('stock endpoint computes available as current minus active reservations', function () {
    $apalit = Branch::firstOrCreate(['code' => 'APALIT'], ['name' => 'Apalit', 'address' => 'Apalit', 'is_main' => true]);

    $user = makeStaffUser([], 'APALIT');
    assignStaffRole($user, 'purchasing');

    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $apalit->id, 'quantity' => 30, 'status' => 'active']);
    StockReservation::create([
        'item_id' => $item->id,
        'branch_id' => $apalit->id,
        'quantity' => 12,
        'reference_type' => 'client_order_form',
        'reference_id' => 1,
        'status' => 'active',
    ]);

    $response = $this->actingAs($user, 'staff')->getJson("/api/staff/inventory/items/{$item->id}/stock");

    $response->assertOk();
    $row = collect($response->json())->firstWhere('branch_id', $apalit->id);
    expect($row['current'])->toBe(30);
    expect($row['reserved'])->toBe(12);
    expect($row['available'])->toBe(18);
});

test('transactions endpoint is branch scoped and paginated', function () {
    $apalit = Branch::firstOrCreate(['code' => 'APALIT'], ['name' => 'Apalit', 'address' => 'Apalit', 'is_main' => true]);
    $cebu = Branch::firstOrCreate(['code' => 'CEBU'], ['name' => 'Cebu', 'address' => 'Cebu', 'is_main' => false]);

    $user = makeStaffUser([], 'APALIT');
    assignStaffRole($user, 'purchasing');
    $employee = $user->employee;

    $item = Item::factory()->create();

    StockTransaction::create([
        'item_id' => $item->id, 'branch_id' => $apalit->id, 'type' => 'receive',
        'quantity' => 10, 'performed_by' => $employee->id,
    ]);
    StockTransaction::create([
        'item_id' => $item->id, 'branch_id' => $cebu->id, 'type' => 'receive',
        'quantity' => 10, 'performed_by' => $employee->id,
    ]);

    $response = $this->actingAs($user, 'staff')->getJson("/api/staff/inventory/items/{$item->id}/transactions");

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);
});
