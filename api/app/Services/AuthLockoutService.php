<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class AuthLockoutService
{
    /**
     * Independent of IP-based throttling — keyed by account, not source IP,
     * so distributed attempts across many IPs still lock the account. The
     * client guard is intentionally stricter: it's the only internet-facing
     * surface in the system.
     */
    private const CONFIG = [
        'staff' => ['max_attempts' => 5, 'cooldown_minutes' => 15],
        'client' => ['max_attempts' => 3, 'cooldown_minutes' => 30],
    ];

    public function isLocked(string $guard, string $email): bool
    {
        return Cache::has($this->lockedKey($guard, $email));
    }

    public function recordFailure(string $guard, string $email): void
    {
        $config = self::CONFIG[$guard];
        $cooldown = now()->addMinutes($config['cooldown_minutes']);

        $attempts = Cache::get($this->attemptsKey($guard, $email), 0) + 1;

        if ($attempts >= $config['max_attempts']) {
            Cache::put($this->lockedKey($guard, $email), true, $cooldown);
            Cache::forget($this->attemptsKey($guard, $email));

            return;
        }

        Cache::put($this->attemptsKey($guard, $email), $attempts, $cooldown);
    }

    public function clear(string $guard, string $email): void
    {
        Cache::forget($this->attemptsKey($guard, $email));
        Cache::forget($this->lockedKey($guard, $email));
    }

    private function attemptsKey(string $guard, string $email): string
    {
        return "lockout:attempts:{$guard}:{$email}";
    }

    private function lockedKey(string $guard, string $email): string
    {
        return "lockout:locked:{$guard}:{$email}";
    }
}
