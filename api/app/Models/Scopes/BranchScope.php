<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Consumes the `currentBranchId` binding `ScopeToBranch` middleware shares
 * on the container for branch-scoped roles (Sales, Purchasing, Accounting,
 * Logistics). Admin and Super Admin never trigger the binding, so queries
 * for them run unscoped. Never applies outside an HTTP request carrying
 * that middleware (artisan commands, seeders) since the binding won't
 * exist there.
 */
class BranchScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (app()->bound('currentBranchId')) {
            $builder->where($model->qualifyColumn('branch_id'), app('currentBranchId'));
        }
    }
}
