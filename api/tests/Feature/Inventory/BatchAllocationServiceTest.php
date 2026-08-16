<?php

use App\Models\Batch;
use App\Models\Branch;
use App\Models\Item;
use App\Services\BatchAllocationService;

test('fefo picks the active batch with the nearest expiry date first', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->create();

    $later = Batch::factory()->create([
        'item_id' => $item->id, 'branch_id' => $branch->id,
        'expiry_date' => now()->addDays(60)->toDateString(), 'quantity' => 10,
    ]);
    $soonest = Batch::factory()->create([
        'item_id' => $item->id, 'branch_id' => $branch->id,
        'expiry_date' => now()->addDays(5)->toDateString(), 'quantity' => 10,
    ]);
    Batch::factory()->create([
        'item_id' => $item->id, 'branch_id' => $branch->id,
        'expiry_date' => now()->addDays(1)->toDateString(), 'quantity' => 0,
    ]);

    $next = app(BatchAllocationService::class)->nextAvailableBatch($item->id, $branch->id);

    expect($next->id)->toBe($soonest->id);
});

test('fefo skips depleted and expired batches', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->create();

    Batch::factory()->create([
        'item_id' => $item->id, 'branch_id' => $branch->id,
        'expiry_date' => now()->addDays(1)->toDateString(), 'quantity' => 10, 'status' => 'expired',
    ]);
    $onlyEligible = Batch::factory()->create([
        'item_id' => $item->id, 'branch_id' => $branch->id,
        'expiry_date' => now()->addDays(30)->toDateString(), 'quantity' => 10, 'status' => 'active',
    ]);

    $next = app(BatchAllocationService::class)->nextAvailableBatch($item->id, $branch->id);

    expect($next->id)->toBe($onlyEligible->id);
});

test('fefo falls back to fifo by received date for non-expiring items', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->withoutExpiry()->create();

    $receivedLater = Batch::factory()->create([
        'item_id' => $item->id, 'branch_id' => $branch->id,
        'expiry_date' => null, 'received_date' => now()->subDays(1)->toDateString(), 'quantity' => 10,
    ]);
    $receivedFirst = Batch::factory()->create([
        'item_id' => $item->id, 'branch_id' => $branch->id,
        'expiry_date' => null, 'received_date' => now()->subDays(10)->toDateString(), 'quantity' => 10,
    ]);

    $next = app(BatchAllocationService::class)->nextAvailableBatch($item->id, $branch->id);

    expect($next->id)->toBe($receivedFirst->id);
});
