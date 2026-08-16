<?php

namespace App\Http\Controllers\Staff\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemStockResource;
use App\Http\Resources\StockTransactionResource;
use App\Models\Item;
use App\Services\StockAvailabilityService;

class StockController extends Controller
{
    public function show(Item $item, StockAvailabilityService $availability)
    {
        $this->authorize('view', $item);

        return ItemStockResource::collection($availability->forItem($item->id, $this->currentBranchId()));
    }

    public function transactions(Item $item)
    {
        $this->authorize('view', $item);

        $transactions = $item->stockTransactions()
            ->with(['branch', 'performedBy.user'])
            ->latest('created_at')
            ->paginate();

        return StockTransactionResource::collection($transactions);
    }
}
