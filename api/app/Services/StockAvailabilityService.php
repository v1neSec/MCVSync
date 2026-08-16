<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\Branch;
use App\Models\Scopes\BranchScope;
use App\Models\StockReservation;

/**
 * Owns the computed-availability query from the Inventory Module spec
 * (Section 3). Never cache this as a denormalized column — computing it
 * live via the indexed batch/reservation queries is what keeps a stale
 * "available" number from ever being possible.
 *
 * Bypasses the BranchScope global scope on both models for the same
 * reason BatchAllocationService does: branch is an explicit parameter
 * here, so implicit request-context scoping must not double up with it.
 */
class StockAvailabilityService
{
    public function currentStock(int $itemId, int $branchId): int
    {
        return (int) Batch::query()
            ->withoutGlobalScope(BranchScope::class)
            ->where('item_id', $itemId)
            ->where('branch_id', $branchId)
            ->where('status', 'active')
            ->sum('quantity');
    }

    public function reservedStock(int $itemId, int $branchId): int
    {
        return (int) StockReservation::query()
            ->withoutGlobalScope(BranchScope::class)
            ->where('item_id', $itemId)
            ->where('branch_id', $branchId)
            ->where('status', 'active')
            ->sum('quantity');
    }

    public function available(int $itemId, int $branchId): int
    {
        return $this->currentStock($itemId, $branchId) - $this->reservedStock($itemId, $branchId);
    }

    /**
     * Per-branch breakdown for GET /items/{id}/stock. `incoming` is always
     * zero — there is no purchase-order/expected-delivery data source yet
     * (Purchase Orders are explicitly out of scope for this pass). That
     * module owns wiring a real figure in; this deliberately doesn't
     * fabricate one.
     *
     * @return array<int, array{branch_id: int, branch_name: string, current: int, reserved: int, incoming: int, available: int}>
     */
    public function forItem(int $itemId, ?int $branchId): array
    {
        $branches = $branchId !== null
            ? Branch::query()->where('id', $branchId)->get()
            : Branch::query()->get();

        return $branches->map(function (Branch $branch) use ($itemId) {
            $current = $this->currentStock($itemId, $branch->id);
            $reserved = $this->reservedStock($itemId, $branch->id);

            return [
                'branch_id' => $branch->id,
                'branch_name' => $branch->name,
                'current' => $current,
                'reserved' => $reserved,
                'incoming' => 0,
                'available' => $current - $reserved,
            ];
        })->values()->all();
    }
}
