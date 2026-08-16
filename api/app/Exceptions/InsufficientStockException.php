<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Thrown by ReservationService::reserve() instead of a generic validation
 * error — the calling module (e.g. Sales' COF-approval flow) needs the
 * available/requested figures to decide what happens next (the
 * insufficient-stock -> Draft PO flow hooks in here), not just a boolean
 * failure.
 */
class InsufficientStockException extends RuntimeException
{
    public function __construct(
        public readonly int $itemId,
        public readonly int $branchId,
        public readonly int $requested,
        public readonly int $available,
    ) {
        parent::__construct(
            "Cannot reserve {$requested} unit(s) of item {$itemId} at branch {$branchId}: only {$available} available.",
        );
    }
}
