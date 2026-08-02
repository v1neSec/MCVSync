<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\AccountProvisioningService;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(AccountProvisioningService $provisioning): void
    {
        $email = config('services.super_admin.email');

        if (User::where('email', $email)->exists()) {
            return;
        }

        $employee = $provisioning->createStaff([
            'name' => config('services.super_admin.name'),
            'email' => $email,
            'password' => config('services.super_admin.password'),
        ], branchId: null);

        // Resolving an actual Role instance (rather than the bare string
        // form of assignRole) sidesteps Spatie's default-guard detection,
        // which is ambiguous for this model — see the note on User::class.
        $role = Role::where('name', 'super_admin')->where('guard_name', 'staff')->firstOrFail();
        $employee->user->assignRole($role);
    }
}
