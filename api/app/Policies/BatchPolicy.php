<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesInventoryAccess;

class BatchPolicy
{
    use AuthorizesInventoryAccess;
}
