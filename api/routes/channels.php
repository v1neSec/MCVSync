<?php

use App\Broadcasting\BranchInventoryChannel;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('branch.{branchId}.inventory', BranchInventoryChannel::class);
