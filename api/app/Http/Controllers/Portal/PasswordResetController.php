<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Concerns\ResetsPasswordForGuard;
use App\Http\Controllers\Controller;

class PasswordResetController extends Controller
{
    use ResetsPasswordForGuard;

    protected function guardName(): string
    {
        return 'client';
    }
}
