<?php

namespace App\Http\Controllers\Staff\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Resources\BatchResource;
use App\Http\Resources\LowStockItemResource;
use App\Models\Batch;
use App\Models\Item;
use App\Services\AlertService;

class AlertController extends Controller
{
    public function expiring(AlertService $alerts)
    {
        $this->authorize('viewAny', Batch::class);

        return BatchResource::collection($alerts->expiringBatches($this->currentBranchId()));
    }

    public function lowStock(AlertService $alerts)
    {
        $this->authorize('viewAny', Item::class);

        return LowStockItemResource::collection($alerts->lowStockItems($this->currentBranchId()));
    }
}
