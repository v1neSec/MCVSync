<?php

use App\Events\LowStockThresholdCrossed;
use App\Events\StockLevelChanged;
use App\Exceptions\InsufficientStockException;
use App\Models\Batch;
use App\Models\Branch;
use App\Models\Item;
use App\Models\StockReservation;
use App\Services\ReservationService;
use App\Services\StockAvailabilityService;
use Illuminate\Support\Facades\Event;

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

test('reserving stock dispatches StockLevelChanged with the new figures', function () {
    Event::fake([StockLevelChanged::class]);

    $branch = Branch::factory()->create();
    $item = Item::factory()->create();
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 50]);

    app(ReservationService::class)->reserve($item->id, $branch->id, 20, 'client_order_form', 1);

    Event::assertDispatched(StockLevelChanged::class, function (StockLevelChanged $event) use ($item, $branch) {
        return $event->itemId === $item->id
            && $event->branchId === $branch->id
            && $event->available === 30
            && $event->reserved === 20
            && $event->current === 50;
    });
});

test('reserving stock dispatches LowStockThresholdCrossed only on the transaction that newly crosses it', function () {
    Event::fake([LowStockThresholdCrossed::class]);

    $branch = Branch::factory()->create();
    $item = Item::factory()->create(['reorder_point' => 10]);
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 30]);

    // 30 -> 15 available: still above reorder_point (10), should not fire.
    app(ReservationService::class)->reserve($item->id, $branch->id, 15, 'client_order_form', 1);
    Event::assertNotDispatched(LowStockThresholdCrossed::class);

    // 15 -> 8 available: newly crosses at/below reorder_point, should fire once.
    app(ReservationService::class)->reserve($item->id, $branch->id, 7, 'client_order_form', 2);
    Event::assertDispatched(LowStockThresholdCrossed::class, function (LowStockThresholdCrossed $event) use ($item, $branch) {
        return $event->itemId === $item->id
            && $event->branchId === $branch->id
            && $event->available === 8
            && $event->reorderPoint === 10;
    });

    // 8 -> 5 available: already below reorder_point before this change, must not fire again.
    Event::fake([LowStockThresholdCrossed::class]);
    app(ReservationService::class)->reserve($item->id, $branch->id, 3, 'client_order_form', 3);
    Event::assertNotDispatched(LowStockThresholdCrossed::class);
});

test('reserving stock for an item with no reorder point never fires LowStockThresholdCrossed', function () {
    Event::fake([LowStockThresholdCrossed::class]);

    $branch = Branch::factory()->create();
    $item = Item::factory()->create(['reorder_point' => null]);
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 10]);

    app(ReservationService::class)->reserve($item->id, $branch->id, 10, 'client_order_form', 1);

    Event::assertNotDispatched(LowStockThresholdCrossed::class);
});

test('releasing a reservation dispatches StockLevelChanged but never LowStockThresholdCrossed', function () {
    $branch = Branch::factory()->create();
    $item = Item::factory()->create(['reorder_point' => 10]);
    Batch::factory()->create(['item_id' => $item->id, 'branch_id' => $branch->id, 'quantity' => 10]);

    $reservation = app(ReservationService::class)->reserve($item->id, $branch->id, 10, 'client_order_form', 1);

    Event::fake([StockLevelChanged::class, LowStockThresholdCrossed::class]);

    app(ReservationService::class)->release($reservation);

    Event::assertDispatched(StockLevelChanged::class, function (StockLevelChanged $event) use ($item, $branch) {
        return $event->itemId === $item->id
            && $event->branchId === $branch->id
            && $event->available === 10
            && $event->reserved === 0
            && $event->current === 10;
    });
    Event::assertNotDispatched(LowStockThresholdCrossed::class);
});
