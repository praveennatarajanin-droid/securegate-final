<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VisitorController;

use App\Http\Controllers\SocietyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SettingsController;

Route::post('/register', [VisitorController::class, 'register']);
Route::get('/details/{id}', [VisitorController::class, 'getRequest']);
Route::get('/status/{id}', [VisitorController::class, 'getStatus']);
Route::post('/approve/{id}', [VisitorController::class, 'approve']);
Route::post('/reject/{id}', [VisitorController::class, 'reject']);
Route::post('/exit/{id}', [VisitorController::class, 'exit']);
Route::get('/visitors', [VisitorController::class, 'getAll']);
Route::delete('/visitors/{id}', [VisitorController::class, 'destroy']);

use App\Models\Resident;

Route::get('/residents', function(Illuminate\Http\Request $request) {
    $query = Resident::query();
    if ($request->has('society_id')) {
        $query->where('society_id', $request->society_id);
    }
    return response()->json(['success' => true, 'data' => $query->get()]);
});

Route::post('/residents', function(Illuminate\Http\Request $request) {
    try {
        $data = $request->all();
        $resident = Resident::create($data);
        
        if (isset($data['generateAccount']) && $data['generateAccount'] == true && !empty($data['email'])) {
            try {
                // Check if user already exists
                $user = \App\Models\User::where('email', $data['email'])->first();
                $password = \Illuminate\Support\Str::random(8);
                
                if (!$user) {
                    $user = \App\Models\User::create([
                        'name' => $data['name'],
                        'email' => $data['email'],
                        'password' => \Illuminate\Support\Facades\Hash::make($password),
                    ]);
                } else {
                    // Update password for existing user if requested again
                    $user->password = \Illuminate\Support\Facades\Hash::make($password);
                    $user->save();
                }
                
                \Illuminate\Support\Facades\Mail::to($data['email'])->send(new \App\Mail\UserAccountCreated($data['email'], $password));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to create user or send mail: '.$e->getMessage());
            }
        }
        
        return response()->json(['success' => true, 'data' => $resident]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::put('/residents/{id}', function(Illuminate\Http\Request $request, $id) {
    $resident = Resident::find($id);
    if($resident) {
        $resident->update($request->all());
        return response()->json(['success' => true, 'data' => $resident]);
    }
    return response()->json(['success' => false, 'message' => 'Not found'], 404);
});

Route::delete('/residents/{id}', function($id) {
    Resident::destroy($id);
    return response()->json(['success' => true]);
});

use App\Models\Community;
use App\Models\Block;
use App\Models\Apartment;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

// Communities
Route::get('/communities', function(Illuminate\Http\Request $request) {
    $query = Community::query();
    if ($request->has('society_id')) {
        $query->where('society_id', $request->society_id);
    }
    return response()->json(['success' => true, 'data' => $query->with('blocks.apartments')->get()]);
});
Route::post('/communities', function(Illuminate\Http\Request $request) {
    return response()->json(['success' => true, 'data' => Community::create($request->all())]);
});
Route::delete('/communities/{id}', function($id) {
    Community::destroy($id);
    return response()->json(['success' => true]);
});

// Blocks
Route::get('/blocks', function(Illuminate\Http\Request $request) {
    $societyId = $request->society_id;
    \Illuminate\Support\Facades\Log::info("Fetching blocks for society_id: " . ($societyId ?? 'none'));
    
    $query = Block::query();
    if ($societyId) {
        $query->where('society_id', $societyId);
    }
    $blocks = $query->with('apartments')->get();
    \Illuminate\Support\Facades\Log::info("Found " . $blocks->count() . " blocks");
    
    return response()->json(['success' => true, 'data' => $blocks]);
});
Route::post('/blocks', function(Illuminate\Http\Request $request) {
    return response()->json(['success' => true, 'data' => Block::create($request->all())]);
});
Route::delete('/blocks/{id}', function($id) {
    Block::destroy($id);
    return response()->json(['success' => true]);
});

// Apartments
Route::get('/apartments', function(Illuminate\Http\Request $request) {
    $query = Apartment::query();
    if ($request->has('society_id')) {
        $query->where('society_id', $request->society_id);
    }
    return response()->json(['success' => true, 'data' => $query->get()]);
});
Route::post('/apartments', function(Illuminate\Http\Request $request) {
    return response()->json(['success' => true, 'data' => Apartment::create($request->all())]);
});
Route::delete('/apartments/{id}', function($id) {
    Apartment::destroy($id);
    return response()->json(['success' => true]);
});
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
