<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;

trait ResetsPasswordForGuard
{
    abstract protected function guardName(): string;

    public function forgot(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        Password::broker('users')->sendResetLink([
            'email' => $request->email,
            'type' => $this->guardName(),
        ]);

        return response()->json(['message' => 'If that account exists, a reset link has been sent.']);
    }

    public function reset(Request $request, AuditLogger $audit)
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::broker('users')->reset(
            [...$data, 'type' => $this->guardName()],
            function (User $user, string $password) use ($audit) {
                $user->forceFill(['password' => $password])->save();
                $audit->record('password.reset', $user, $this->guardName());
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)], 422);
        }

        return response()->json(['message' => __($status)]);
    }
}
