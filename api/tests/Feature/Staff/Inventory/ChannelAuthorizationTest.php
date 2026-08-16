<?php

/**
 * The actual role/branch authorization logic (BranchInventoryChannel) is
 * tested directly in tests/Feature/Inventory/BranchInventoryChannelTest —
 * exercising it through this HTTP route with the test suite's `null`
 * broadcast driver can't reliably assert allow/deny, since that driver's
 * auth() is a no-op that returns a bare 200 regardless of the channel
 * definition. What IS reliably testable at this layer, unaffected by
 * broadcaster driver choice, is that the route itself requires a staff
 * session — that check happens in auth:staff middleware, before the
 * request ever reaches broadcaster-specific channel logic.
 */
test('an unauthenticated request cannot use the broadcasting auth route', function () {
    $this->postJson('/api/broadcasting/auth', [
        'channel_name' => 'private-branch.1.inventory',
        'socket_id' => '1234.5678',
    ])->assertUnauthorized();
});

test('a client cannot use the staff broadcasting auth route', function () {
    $client = makeClientUser();

    $this->actingAs($client, 'client')->postJson('/api/broadcasting/auth', [
        'channel_name' => 'private-branch.1.inventory',
        'socket_id' => '1234.5678',
    ])->assertUnauthorized();
});
