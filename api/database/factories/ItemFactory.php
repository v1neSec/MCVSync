<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Item;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Item>
 */
class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(3, true),
            'sku' => fake()->unique()->bothify('SKU-####??'),
            'barcode' => null,
            'category_id' => Category::factory(),
            'unit_id' => Unit::factory(),
            'description' => null,
            'has_expiry' => true,
            'expiry_alert_threshold_days' => null,
            'reorder_point' => null,
            'reorder_quantity' => null,
            'is_active' => true,
        ];
    }

    public function withoutExpiry(): static
    {
        return $this->state(fn (array $attributes) => ['has_expiry' => false]);
    }
}
