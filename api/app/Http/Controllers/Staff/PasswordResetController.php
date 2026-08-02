<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Concerns\ResetsPasswordForGuard;
use App\Http\Controllers\Controller;

class PasswordResetController extends Controller
{
    use ResetsPasswordForGuard;

    protected function guardName(): string
    {
        return 'staff';
    }
}
