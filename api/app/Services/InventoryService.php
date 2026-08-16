<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Item;
use App\Models\Unit;
use Illuminate\Validation\ValidationException;

/**
 * Category/unit/item CRUD orchestration — kept out of the controllers per
 * CLAUDE.md's "thin controllers, logic in services" rule, even though most
 * of these methods are simple, so every inventory controller follows the
 * same shape.
 */
class InventoryService
{
    public function createCategory(array $data): Category
    {
        return Category::create($data);
    }

    public function updateCategory(Category $category, array $data): Category
    {
        $category->update($data);

        return $category;
    }

    public function deleteCategory(Category $category): void
    {
        if ($category->items()->exists()) {
            throw ValidationException::withMessages([
                'category' => 'This category is still assigned to one or more items and cannot be deleted.',
            ]);
        }

        $category->delete();
    }

    public function createUnit(array $data): Unit
    {
        return Unit::create($data);
    }

    public function updateUnit(Unit $unit, array $data): Unit
    {
        $unit->update($data);

        return $unit;
    }

    public function deleteUnit(Unit $unit): void
    {
        if ($unit->items()->exists()) {
            throw ValidationException::withMessages([
                'unit' => 'This unit is still assigned to one or more items and cannot be deleted.',
            ]);
        }

        $unit->delete();
    }

    public function createItem(array $data): Item
    {
        return Item::create($data);
    }

    public function updateItem(Item $item, array $data): Item
    {
        $item->update($data);

        return $item;
    }
}
