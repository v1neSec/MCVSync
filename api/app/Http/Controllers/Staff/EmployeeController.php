<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\AssignEmployeeRoleRequest;
use App\Http\Requests\Staff\StoreEmployeeRequest;
use App\Http\Requests\Staff\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use App\Services\AccountProvisioningService;
use App\Services\EmployeeRoleAssignmentService;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        return EmployeeResource::collection(
            Employee::with(['user.roles', 'branch'])->get()
        );
    }

    public function store(StoreEmployeeRequest $request, AccountProvisioningService $provisioning)
    {
        $data = $request->validated();

        $employee = $provisioning->createStaff([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ], branchId: $data['branch_id'] ?? null, position: $data['position']);

        return (new EmployeeResource($employee->fresh(['user.roles', 'branch'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $this->guardAgainstEditingElevatedEmployee($request, $employee);

        $data = $request->validated();

        $employee->update(['branch_id' => $data['branch_id'] ?? null, 'position' => $data['position']]);
        $employee->user->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        return new EmployeeResource($employee->fresh(['user.roles', 'branch']));
    }

    public function deactivate(Employee $employee)
    {
        $employee->user->update(['is_active' => false]);

        return new EmployeeResource($employee->fresh(['user.roles', 'branch']));
    }

    public function activate(Employee $employee)
    {
        $employee->user->update(['is_active' => true]);

        return new EmployeeResource($employee->fresh(['user.roles', 'branch']));
    }

    public function assignRole(
        AssignEmployeeRoleRequest $request,
        Employee $employee,
        EmployeeRoleAssignmentService $roleAssignment,
    ) {
        $roleAssignment->assign($employee, $request->validated()['role']);

        return new EmployeeResource($employee->fresh(['user.roles', 'branch']));
    }

    private function guardAgainstEditingElevatedEmployee(Request $request, Employee $employee): void
    {
        $actorIsSuperAdmin = $request->user('staff')->hasRole('super_admin', 'staff');
        $targetIsElevated = in_array($employee->roleName(), ['admin', 'super_admin'], true);

        if (! $actorIsSuperAdmin && $targetIsElevated) {
            abort(403, 'Only Super Admin can modify Admin or Super Admin accounts.');
        }
    }
}
