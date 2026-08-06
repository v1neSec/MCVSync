<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use App\Services\AccountProvisioningService;
use App\Services\EmployeeRoleAssignmentService;
use Illuminate\Database\Seeder;

/**
 * Local/dev RBAC test fixtures — one account per role. Refuses to run
 * outside local/testing regardless of SEED_USER_PASSWORD, since the
 * accounts it creates use fixed, publicly-known emails.
 */
class DemoStaffSeeder extends Seeder
{
    private const ACCOUNTS = [
        ['role' => 'sales', 'name' => 'Sales Demo', 'branch' => 'APALIT', 'position' => 'Sales Associate', 'email' => 'sales@mcvsync.test'],
        ['role' => 'purchasing', 'name' => 'Purchasing Demo', 'branch' => 'APALIT', 'position' => 'Purchasing Manager', 'email' => 'purchasing@mcvsync.test'],
        ['role' => 'accounting', 'name' => 'Accounting Demo', 'branch' => 'APALIT', 'position' => 'Accounting Staff', 'email' => 'accounting@mcvsync.test'],
        ['role' => 'logistics', 'name' => 'Logistics Demo', 'branch' => 'APALIT', 'position' => 'Logistics Coordinator', 'email' => 'logistics@mcvsync.test'],
        ['role' => 'admin', 'name' => 'Admin Demo', 'branch' => null, 'position' => 'System Administrator', 'email' => 'admin@mcvsync.test'],
        ['role' => 'super_admin', 'name' => 'Super Admin Demo', 'branch' => null, 'position' => 'Chief Executive Officer', 'email' => 'superadmin@mcvsync.test'],
    ];

    public function run(
        AccountProvisioningService $provisioning,
        EmployeeRoleAssignmentService $roleAssignment,
    ): void {
        if (! app()->environment('local', 'testing')) {
            return;
        }

        $password = config('services.seed_user_password');

        if (! $password) {
            return;
        }

        foreach (self::ACCOUNTS as $account) {
            if (User::where('email', $account['email'])->exists()) {
                continue;
            }

            $branchId = $account['branch']
                ? Branch::where('code', $account['branch'])->value('id')
                : null;

            $employee = $provisioning->createStaff([
                'name' => $account['name'],
                'email' => $account['email'],
                'password' => $password,
            ], branchId: $branchId, position: $account['position']);

            $roleAssignment->assign($employee, $account['role']);
        }
    }
}
