<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'unit' => new UnitResource($this->whenLoaded('unit')),
            'description' => $this->description,
            'has_expiry' => $this->has_expiry,
            'expiry_alert_threshold_days' => $this->expiry_alert_threshold_days,
            'reorder_point' => $this->reorder_point,
            'reorder_quantity' => $this->reorder_quantity,
            'is_active' => $this->is_active,
        ];
    }
}
