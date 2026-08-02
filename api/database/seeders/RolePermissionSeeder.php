<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $allPermissionNames = Permission::pluck('id', 'name');

        foreach (PermissionSeeder::ROLE_PERMISSIONS as $roleName => $permissionNames) {
            $role = Role::where('name', $roleName)->firstOrFail();
            $role->permissions()->sync($allPermissionNames->only($permissionNames)->values());
        }

        // Super Admin holds every permission in the system by default.
        Role::where('name', 'super_admin')->firstOrFail()
            ->permissions()->sync($allPermissionNames->values());
    }
}
