<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'type', 'is_active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * `staff`, `client`, and the framework's unused default `web` guard all
     * resolve to this same model, so Spatie's automatic guard detection
     * (first matching guard in config/auth.php) is ambiguous here. Verified
     * in tinker: bare `$user->can('x')` / `hasPermissionTo('x')` silently
     * returns false for a permission the user actually has (resolves
     * against the wrong guard) — never use `can()`/Gate checks on this
     * model. Always pass `'staff'` explicitly: `hasPermissionTo('x',
     * 'staff')`, `hasRole('admin', 'staff')`, and resolve an actual `Role`
     * instance before `assignRole()` rather than passing a bare string.
     * `getRoleNames()`/`getAllPermissions()` are the one safe exception —
     * plain, unguarded relation reads, safe because only `staff`-guard
     * roles are ever attached to any user in this system.
     */

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    public function client(): HasOne
    {
        return $this->hasOne(Client::class);
    }

    public function isStaff(): bool
    {
        return $this->type === 'staff';
    }

    public function isClient(): bool
    {
        return $this->type === 'client';
    }

    public function sendPasswordResetNotification($token): void
    {
        $baseUrl = $this->isClient()
            ? config('app.portal_url')
            : config('app.frontend_url');

        $this->notify(new ResetPasswordNotification($token, $baseUrl));
    }
}
