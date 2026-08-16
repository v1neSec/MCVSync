<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

abstract class Controller
{
    use AuthorizesRequests;

    /**
     * The acting employee's branch when `scope-to-branch` middleware bound
     * one (every branch-scoped role), or null for Admin/Super Admin —
     * meaning "every branch."
     */
    protected function currentBranchId(): ?int
    {
        return app()->bound('currentBranchId') ? app('currentBranchId') : null;
    }

    /**
     * Clamped so a caller (e.g. the frontend building a flagged-item set
     * from an alert list) can request a larger page without being able to
     * force an unbounded query.
     */
    protected function perPage(Request $request, int $default = 15, int $max = 100): int
    {
        return min(max($request->integer('per_page', $default), 1), $max);
    }
}
