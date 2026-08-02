<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['sales', 'purchasing', 'accounting', 'logistics', 'admin', 'super_admin'] as $name) {
            Role::updateOrCreate(['name' => $name, 'guard_name' => 'staff']);
        }
    }
}
