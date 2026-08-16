<?php

namespace App\Http\Resources\Portal;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\UnitResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Deliberately narrow — clients must never see batches, stock, cost, or
 * pricing, regardless of what the internal item record carries. Kept as
 * its own resource rather than the staff ItemResource with fields hidden,
 * so there is no path for a staff-only field to leak through here later.
 */
class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'unit' => new UnitResource($this->whenLoaded('unit')),
            'description' => $this->description,
        ];
    }
}
