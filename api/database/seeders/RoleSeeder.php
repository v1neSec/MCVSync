<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['sales', 'purchasing', 'accounting', 'logistics', 'admin', 'super_admin'] as $name) {
            Role::updateOrCreate(['name' => $name]);
        }
    }
}
