<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Services\AccountProvisioningService;
use Illuminate\Database\Seeder;

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

        $role = Role::where('name', 'super_admin')->firstOrFail();
        $employee->roles()->sync([$role->id]);
    }
}
