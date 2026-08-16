<?php

namespace Database\Factories;

use App\Models\Batch;
use App\Models\Branch;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Batch>
 */
class BatchFactory extends Factory
{
    protected $model = Batch::class;

    public function definition(): array
    {
        return [
            'item_id' => Item::factory(),
            'branch_id' => Branch::factory(),
            'batch_number' => fake()->unique()->bothify('BATCH-####'),
            'quantity' => fake()->numberBetween(1, 100),
            'expiry_date' => fake()->dateTimeBetween('+1 day', '+2 years')->format('Y-m-d'),
            'received_date' => now()->toDateString(),
            'status' => 'active',
        ];
    }
}
