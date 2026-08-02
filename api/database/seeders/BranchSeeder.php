<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        Branch::updateOrCreate(
            ['code' => 'APALIT'],
            ['name' => 'Apalit', 'address' => 'Apalit, Pampanga', 'is_main' => true]
        );

        Branch::updateOrCreate(
            ['code' => 'CEBU'],
            ['name' => 'Cebu', 'address' => 'Cebu City, Cebu', 'is_main' => false]
        );

        Branch::updateOrCreate(
            ['code' => 'DAVAO'],
            ['name' => 'Davao', 'address' => 'Davao City, Davao del Sur', 'is_main' => false]
        );
    }
}
