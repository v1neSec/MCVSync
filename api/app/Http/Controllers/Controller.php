<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

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
}
