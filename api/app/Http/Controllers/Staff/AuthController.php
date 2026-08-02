<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Concerns\AuthenticatesGuard;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use AuthenticatesGuard;

    protected function guardName(): string
    {
        return 'staff';
    }

    public function me(Request $request)
    {
        $user = $request->user('staff');
        $employee = $user->employee()->with(['branch', 'roles.permissions'])->first();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $employee?->role()?->name,
            'branch' => $employee?->branch,
            'permissions' => $employee?->permissionNames() ?? [],
        ]);
    }
}
