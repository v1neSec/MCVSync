<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item_id' => $this->item_id,
            'batch_id' => $this->batch_id,
            'branch' => new BranchResource($this->whenLoaded('branch')),
            'type' => $this->type,
            'quantity' => $this->quantity,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'performed_by' => $this->whenLoaded('performedBy', fn () => $this->performedBy->user->name),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
