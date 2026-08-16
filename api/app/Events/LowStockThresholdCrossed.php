<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Fired from the same code path as StockLevelChanged, but only on the
 * specific transaction where `available` newly crosses at or below
 * `reorder_point` — the caller is responsible for the before/after check
 * so this never fires redundantly on every subsequent change to an item
 * that's already been low for a while.
 */
class LowStockThresholdCrossed implements ShouldBroadcast, ShouldDispatchAfterCommit, ShouldQueue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $itemId,
        public readonly int $branchId,
        public readonly int $available,
        public readonly int $reorderPoint,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("branch.{$this->branchId}.inventory")];
    }

    public function broadcastAs(): string
    {
        return 'LowStockThresholdCrossed';
    }

    public function broadcastWith(): array
    {
        return [
            'item_id' => $this->itemId,
            'branch_id' => $this->branchId,
            'available' => $this->available,
            'reorder_point' => $this->reorderPoint,
        ];
    }
}
