<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ScopeToBranch
{
    /**
     * Resolves the authenticated employee's branch and shares it on the
     * container so later modules' business-model global scopes can key off
     * it, without duplicating the lookup per controller. Admin and Super
     * Admin are exempt, per the spec's branch-scoping requirement.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('staff')->user();
        $employee = $user?->employee;

        if ($employee && ! $user->hasRole(['admin', 'super_admin'], 'staff')) {
            app()->instance('currentBranchId', $employee->branch_id);
        }

        return $next($request);
    }
}
