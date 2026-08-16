<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesInventoryAccess;

class CategoryPolicy
{
    use AuthorizesInventoryAccess;
}
