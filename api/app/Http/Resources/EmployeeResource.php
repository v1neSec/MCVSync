<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user->name,
            'email' => $this->user->email,
            'is_active' => $this->user->is_active,
            'branch' => $this->branch ? new BranchResource($this->branch) : null,
            'role' => $this->roleName(),
        ];
    }
}
