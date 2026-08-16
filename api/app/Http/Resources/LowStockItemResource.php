<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LowStockItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'item_id' => $this->item_id,
            'item_name' => $this->item_name,
            'sku' => $this->sku,
            'reorder_point' => $this->reorder_point,
            'branch_id' => $this->branch_id,
            'branch_name' => $this->branch_name,
            'available' => (int) $this->available,
        ];
    }
}
