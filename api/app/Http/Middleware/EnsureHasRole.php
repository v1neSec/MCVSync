<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHasRole
{
    /**
     * Spatie's own shipped `role` middleware doesn't pass a guard to
     * `hasAnyRole()` internally, so it silently denies everything for this
     * app (the `User` model backs three guards sharing one table, which
     * makes Spatie's default-guard auto-detection wrong here — see the note
     * on `User::class`). Always pass `'staff'` explicitly instead.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user('staff');

        if (! $user || ! $user->hasRole($roles, 'staff')) {
            abort(403, 'You do not have access to this action.');
        }

        return $next($request);
    }
}
