<?php

use App\Http\Controllers\Portal\AuthController as PortalAuthController;
use App\Http\Controllers\Portal\PasswordResetController as PortalPasswordResetController;
use App\Http\Controllers\Staff\AuthController as StaffAuthController;
use App\Http\Controllers\Staff\PasswordResetController as StaffPasswordResetController;
use Illuminate\Support\Facades\Route;

Route::prefix('staff/auth')->group(function () {
    Route::post('/login', [StaffAuthController::class, 'login'])->middleware('throttle:login-staff');
    Route::post('/password/forgot', [StaffPasswordResetController::class, 'forgot']);
    Route::post('/password/reset', [StaffPasswordResetController::class, 'reset']);

    Route::middleware(['auth:staff', 'ensure-active-account'])->group(function () {
        Route::post('/logout', [StaffAuthController::class, 'logout']);
        Route::get('/me', [StaffAuthController::class, 'me']);
    });
});

Route::prefix('portal/auth')->group(function () {
    Route::post('/login', [PortalAuthController::class, 'login'])->middleware('throttle:login-client');
    Route::post('/password/forgot', [PortalPasswordResetController::class, 'forgot']);
    Route::post('/password/reset', [PortalPasswordResetController::class, 'reset']);

    Route::middleware(['auth:client', 'ensure-active-account'])->group(function () {
        Route::post('/logout', [PortalAuthController::class, 'logout']);
        Route::get('/me', [PortalAuthController::class, 'me']);
    });
});
