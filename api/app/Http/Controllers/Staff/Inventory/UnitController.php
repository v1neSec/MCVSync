<?php

namespace App\Http\Controllers\Staff\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\Inventory\StoreUnitRequest;
use App\Http\Requests\Staff\Inventory\UpdateUnitRequest;
use App\Http\Resources\UnitResource;
use App\Models\Unit;
use App\Services\InventoryService;

class UnitController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Unit::class);

        return UnitResource::collection(Unit::orderBy('name')->get());
    }

    public function store(StoreUnitRequest $request, InventoryService $inventory)
    {
        $this->authorize('create', Unit::class);

        $unit = $inventory->createUnit($request->validated());

        return (new UnitResource($unit))->response()->setStatusCode(201);
    }

    public function update(UpdateUnitRequest $request, Unit $unit, InventoryService $inventory)
    {
        $this->authorize('update', $unit);

        return new UnitResource($inventory->updateUnit($unit, $request->validated()));
    }

    public function destroy(Unit $unit, InventoryService $inventory)
    {
        $this->authorize('delete', $unit);

        $inventory->deleteUnit($unit);

        return response()->noContent();
    }
}
