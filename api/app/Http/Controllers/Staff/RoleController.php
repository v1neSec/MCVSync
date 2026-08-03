<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\UpdateRolePermissionsRequest;
use App\Http\Resources\RoleResource;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        return RoleResource::collection(Role::with('permissions')->get());
    }

    public function updatePermissions(UpdateRolePermissionsRequest $request, Role $role)
    {
        $role->syncPermissions($request->validated()['permission_ids']);

        return new RoleResource($role->fresh('permissions'));
    }
}
