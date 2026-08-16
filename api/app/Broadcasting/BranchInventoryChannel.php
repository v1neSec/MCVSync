<?php

namespace App\Broadcasting;

use App\Models\User;

/**
 * A class-based channel handler (rather than a closure in
 * routes/channels.php) specifically so this logic is directly unit
 * testable — Laravel's broadcaster drivers cache the registered channel
 * list per-driver-instance at boot time, which makes exercising this
 * through the full HTTP + broadcaster pipeline in tests unreliable
 * (the registration happens against whichever driver is default when
 * routes/channels.php runs, not whichever driver a test later switches
 * to). Calling ->join() directly sidesteps that entirely.
 *
 * Only Purchasing, Admin, and Super Admin ever have inventory access at
 * all — this must be re-checked here independently of anything the
 * frontend does, since a Sales/Accounting/Logistics user could otherwise
 * subscribe directly with a guessed branch id. Admin/Super Admin are
 * exempt from the branch match, mirroring the same exemption already
 * applied to their read/write access to the inventory endpoints.
 */
class BranchInventoryChannel
{
    public function join(User $user, int $branchId): bool
    {
        if (! $user->hasRole(['purchasing', 'admin', 'super_admin'], 'staff')) {
            return false;
        }

        if ($user->hasRole(['admin', 'super_admin'], 'staff')) {
            return true;
        }

        return $user->employee?->branch_id === $branchId;
    }
}
