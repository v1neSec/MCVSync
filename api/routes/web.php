<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'MCVSync API',
        'version' => '1.0.0',
        'status' => 'online',
        'message' => 'Welcome to the MCVSync API.',
    ]);
});