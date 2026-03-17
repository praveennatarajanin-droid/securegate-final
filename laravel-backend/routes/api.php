<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VisitorController;

use App\Http\Controllers\SocietyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SettingsController;

Route::post('/register', [VisitorController::class, 'register']);
Route::get('/request/{id}', [VisitorController::class, 'getRequest']);
Route::get('/status/{id}', [VisitorController::class, 'getStatus']);
Route::post('/approve/{id}', [VisitorController::class, 'approve']);
Route::post('/reject/{id}', [VisitorController::class, 'reject']);
Route::post('/exit/{id}', [VisitorController::class, 'exit']);
Route::get('/visitors', [VisitorController::class, 'getAll']);

Route::post('/login', [AuthController::class, 'login']);

// Society Management
Route::get('/societies', [SocietyController::class, 'index']);
Route::post('/societies', [SocietyController::class, 'store']);
Route::put('/societies/{id}', [SocietyController::class, 'update']);
Route::delete('/societies/{id}', [SocietyController::class, 'destroy']);

// Admin Management
Route::get('/admins', [AdminController::class, 'index']);
Route::post('/admins', [AdminController::class, 'store']);
Route::put('/admins/{id}', [AdminController::class, 'update']);
Route::delete('/admins/{id}', [AdminController::class, 'destroy']);
Route::post('/admins/{id}/resend-invitation', [AdminController::class, 'resendInvitation']);
Route::post('/admins/bulk-action', [AdminController::class, 'bulkAction']);

use App\Http\Controllers\AuditLogController;

// System Settings
Route::get('/settings', [SettingsController::class, 'index']);
Route::post('/settings', [SettingsController::class, 'update']);

// Audit Logs
Route::get('/audit-logs', [AuditLogController::class, 'index']);

use App\Http\Controllers\GlobalAnnouncementController;

// Global Announcements
Route::get('/announcements', [GlobalAnnouncementController::class, 'index']);
Route::get('/announcements/active', [GlobalAnnouncementController::class, 'getActive']);
Route::post('/announcements', [GlobalAnnouncementController::class, 'store']);
Route::put('/announcements/{id}', [GlobalAnnouncementController::class, 'update']);
Route::delete('/announcements/{id}', [GlobalAnnouncementController::class, 'destroy']);
