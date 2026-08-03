<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class EmployeeRoleAssignmentService
{
    private const BRANCH_SCOPED_ROLES = ['sales', 'purchasing', 'accounting', 'logistics'];

    public function assign(Employee $employee, string $roleName): void
    {
        DB::transaction(function () use ($employee, $roleName) {
            $role = Role::where('name', $roleName)->where('guard_name', 'staff')->firstOrFail();

            $employee->user->syncRoles([$role]);

            if (! in_array($roleName, self::BRANCH_SCOPED_ROLES, true)) {
                $employee->update(['branch_id' => null]);
            }
        });
    }
}
