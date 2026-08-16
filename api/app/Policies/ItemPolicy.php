<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesInventoryAccess;

class ItemPolicy
{
    use AuthorizesInventoryAccess;
}
