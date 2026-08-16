<?php

use App\Broadcasting\BranchInventoryChannel;
use App\Models\Branch;

test('purchasing can join their own branch channel but not another branch', function () {
    $ownBranch = Branch::firstOrCreate(['code' => 'APALIT'], ['name' => 'Apalit', 'address' => 'Apalit', 'is_main' => true]);
    $otherBranch = Branch::firstOrCreate(['code' => 'CEBU'], ['name' => 'Cebu', 'address' => 'Cebu', 'is_main' => false]);

    $user = makeStaffUser([], 'APALIT');
    assignStaffRole($user, 'purchasing');

    $channel = new BranchInventoryChannel;

    expect($channel->join($user, $ownBranch->id))->toBeTrue();
    expect($channel->join($user, $otherBranch->id))->toBeFalse();
});

test('admin and super admin can join any branch channel', function () {
    $branch = Branch::factory()->create();
    $channel = new BranchInventoryChannel;

    $admin = makeStaffUser();
    assignStaffRole($admin, 'admin');
    expect($channel->join($admin, $branch->id))->toBeTrue();

    $superAdmin = makeStaffUser();
    assignStaffRole($superAdmin, 'super_admin');
    expect($channel->join($superAdmin, $branch->id))->toBeTrue();
});

test('sales, accounting, and logistics cannot join even with their own branch id', function () {
    $channel = new BranchInventoryChannel;

    foreach (['sales', 'accounting', 'logistics'] as $role) {
        $user = makeStaffUser([], 'APALIT');
        assignStaffRole($user, $role);

        expect($channel->join($user, $user->employee->branch_id))->toBeFalse();
    }
});
