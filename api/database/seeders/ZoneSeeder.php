<?php

namespace Database\Seeders;

use App\Models\Zone;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Pampanga/Bulacan', 'South Luzon'] as $name) {
            Zone::updateOrCreate(['name' => $name]);
        }
    }
}
