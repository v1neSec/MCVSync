<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveAccount
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && ! $user->is_active) {
            Auth::guard($user->type === 'client' ? 'client' : 'staff')->logout();
            $request->session()->invalidate();

            abort(403, 'This account has been deactivated.');
        }

        return $next($request);
    }
}
