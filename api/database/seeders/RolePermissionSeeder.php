<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (PermissionSeeder::ROLE_PERMISSIONS as $roleName => $permissionNames) {
            $role = Role::where('name', $roleName)->where('guard_name', 'staff')->firstOrFail();
            $role->syncPermissions($permissionNames);
        }

        // Super Admin holds every permission in the system by default.
        Role::where('name', 'super_admin')->where('guard_name', 'staff')->firstOrFail()
            ->syncPermissions(Permission::where('guard_name', 'staff')->get());
    }
}
