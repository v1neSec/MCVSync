<?php

use App\Exceptions\InsufficientStockException;
use App\Models\Batch;
use App\Models\Branch;
use App\Models\Item;
use App\Models\StockReservation;
use App\Services\ReservationService;
use App\Services\StockAvailabilityService;

test('reserving stock creates an active reservation and reduces availability', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 50]);

    $reservation = app(ReservationService::class)->reserve($item->id, $branch->id, 20, 'client_order_form', 1);

    expect($reservation->status)->toBe('active');
    expect($reservation->quantity)->toBe(20);

    $available = app(StockAvailabilityService::class)->available($item->id, $branch->id);
    expect($available)->toBe(30);
});

test('reserving more than available throws with the available and requested figures', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 10]);

    try {
        app(ReservationService::class)->reserve($item->id, $branch->id, 15, 'client_order_form', 1);
        $this->fail('Expected InsufficientStockException was not thrown.');
    } catch (InsufficientStockException $exception) {
        expect($exception->available)->toBe(10);
        expect($exception->requested)->toBe(15);
    }

    expect(StockReservation::where('item_id', $item->id)->count())->toBe(0);
});

test('a rejected reservation does not partially reserve anything', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 5]);

    expect(fn () => app(ReservationService::class)->reserve($item->id, $branch->id, 6, 'client_order_form', 1))
        ->toThrow(InsufficientStockException::class);

    $available = app(StockAvailabilityService::class)->available($item->id, $branch->id);
    expect($available)->toBe(5);
});

test('releasing a reservation restores availability', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 40]);

    $reservation = app(ReservationService::class)->reserve($item->id, $branch->id, 25, 'client_order_form', 1);
    expect(app(StockAvailabilityService::class)->available($item->id, $branch->id))->toBe(15);

    app(ReservationService::class)->release($reservation);

    expect($reservation->fresh()->status)->toBe('released');
    expect(app(StockAvailabilityService::class)->available($item->id, $branch->id))->toBe(40);
});

test('a second reservation correctly accounts for a prior committed one against the same stock', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 10]);

    app(ReservationService::class)->reserve($item->id, $branch->id, 6, 'client_order_form', 1);

    expect(fn () => app(ReservationService::class)->reserve($item->id, $branch->id, 6, 'client_order_form', 2))
        ->toThrow(InsufficientStockException::class);

    app(ReservationService::class)->reserve($item->id, $branch->id, 4, 'client_order_form', 3);

    expect(app(StockAvailabilityService::class)->available($item->id, $branch->id))->toBe(0);
});
