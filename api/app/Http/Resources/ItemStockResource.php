<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Wraps the already-shaped per-branch array StockAvailabilityService::forItem()
 * returns — kept as a Resource rather than a bare array response so the
 * JSON contract for this endpoint lives in one place like every other
 * inventory response, even though the transform itself is a pass-through.
 */
class ItemStockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return $this->resource;
    }
}
