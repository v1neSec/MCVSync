<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogger
{
    /**
     * Snapshots the actor's name at write time rather than referencing the
     * live user row, so a later deactivation or rename never changes what a
     * historical entry says. Never pass password or session data in
     * $metadata — the audit trail records actions, not credentials.
     */
    public function record(string $action, ?User $user, ?string $guard, array $metadata = []): AuditLog
    {
        return AuditLog::create([
            'user_id' => $user?->id,
            'actor_name' => $user?->name,
            'guard' => $guard,
            'action' => $action,
            'metadata' => $metadata,
        ]);
    }
}
