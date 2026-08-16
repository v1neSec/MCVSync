<?php

namespace App\Http\Controllers\Staff\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Resources\BatchResource;
use App\Models\Batch;
use App\Models\Item;

class BatchController extends Controller
{
    public function index(Item $item)
    {
        $this->authorize('viewAny', Batch::class);

        $batches = $item->batches()
            ->with('branch')
            ->orderBy('expiry_date')
            ->paginate();

        return BatchResource::collection($batches);
    }
}
