<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\GameCaseController;
use App\Http\Controllers\Api\GameTemplateController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });

    // Games
    Route::prefix('games')->group(function () {
        Route::get('/', [GameController::class, 'index']);
        Route::get('history', [GameController::class, 'history']);
        Route::get('{id}', [GameController::class, 'show']);
    });

    // Cases
    Route::prefix('cases')->group(function () {
        Route::get('/', [GameCaseController::class, 'index']);
        Route::get('{id}', [GameCaseController::class, 'show']);
    });

    // Templates
    Route::prefix('templates')->group(function () {
        Route::get('/', [GameTemplateController::class, 'index']);
        Route::get('{id}', [GameTemplateController::class, 'show']);
    });
});
