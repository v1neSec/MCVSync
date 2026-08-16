<?php

namespace App\Http\Controllers\Staff\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\Inventory\StoreCategoryRequest;
use App\Http\Requests\Staff\Inventory\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\InventoryService;

class CategoryController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Category::class);

        return CategoryResource::collection(Category::orderBy('name')->get());
    }

    public function store(StoreCategoryRequest $request, InventoryService $inventory)
    {
        $this->authorize('create', Category::class);

        $category = $inventory->createCategory($request->validated());

        return (new CategoryResource($category))->response()->setStatusCode(201);
    }

    public function update(UpdateCategoryRequest $request, Category $category, InventoryService $inventory)
    {
        $this->authorize('update', $category);

        return new CategoryResource($inventory->updateCategory($category, $request->validated()));
    }

    public function destroy(Category $category, InventoryService $inventory)
    {
        $this->authorize('delete', $category);

        $inventory->deleteCategory($category);

        return response()->noContent();
    }
}
