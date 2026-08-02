<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Concerns\AuthenticatesGuard;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use AuthenticatesGuard;

    protected function guardName(): string
    {
        return 'client';
    }

    public function me(Request $request)
    {
        $user = $request->user('client');
        $client = $user->client()->with('zone')->first();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'client_type' => $client?->client_type,
            'zone' => $client?->zone,
        ]);
    }
}
