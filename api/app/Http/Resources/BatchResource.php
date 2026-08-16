<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item' => new ItemResource($this->whenLoaded('item')),
            'branch' => new BranchResource($this->whenLoaded('branch')),
            'batch_number' => $this->batch_number,
            'quantity' => $this->quantity,
            'expiry_date' => $this->expiry_date?->toDateString(),
            'received_date' => $this->received_date->toDateString(),
            'status' => $this->status,
        ];
    }
}
