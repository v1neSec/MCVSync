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
 * Fired as the last step of any operation that writes to
 * stock_reservations or stock_transactions for this item+branch, so a
 * screen showing "N available" for the same item never goes stale while
 * someone's looking at it. `ShouldDispatchAfterCommit` is what makes
 * Laravel defer this until the enclosing DB transaction actually commits —
 * without it, a broadcast could tell connected clients about a change
 * that a later rollback then undoes.
 */
class StockLevelChanged implements ShouldBroadcast, ShouldDispatchAfterCommit, ShouldQueue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $itemId,
        public readonly int $branchId,
        public readonly int $available,
        public readonly int $reserved,
        public readonly int $current,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("branch.{$this->branchId}.inventory")];
    }

    public function broadcastAs(): string
    {
        return 'StockLevelChanged';
    }

    public function broadcastWith(): array
    {
        return [
            'item_id' => $this->itemId,
            'branch_id' => $this->branchId,
            'available' => $this->available,
            'reserved' => $this->reserved,
            'current' => $this->current,
        ];
    }
}
