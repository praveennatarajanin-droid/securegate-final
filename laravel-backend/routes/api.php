<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VisitorController;

Route::post('/register', [VisitorController::class, 'register']);
Route::get('/request/{id}', [VisitorController::class, 'getRequest']);
Route::get('/status/{id}', [VisitorController::class, 'getStatus']);
Route::post('/approve/{id}', [VisitorController::class, 'approve']);
Route::post('/reject/{id}', [VisitorController::class, 'reject']);
Route::post('/exit/{id}', [VisitorController::class, 'exit']);
Route::get('/visitors', [VisitorController::class, 'getAll']);

use App\Models\Resident;

Route::get('/residents', function() {
    return response()->json(['success' => true, 'data' => Resident::all()]);
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
Route::get('/communities', function() {
    return response()->json(['success' => true, 'data' => Community::with('blocks.apartments')->get()]);
});
Route::post('/communities', function(Illuminate\Http\Request $request) {
    return response()->json(['success' => true, 'data' => Community::create($request->all())]);
});
Route::delete('/communities/{id}', function($id) {
    Community::destroy($id);
    return response()->json(['success' => true]);
});

// Blocks
Route::get('/blocks', function() {
    return response()->json(['success' => true, 'data' => Block::with('apartments')->get()]);
});
Route::post('/blocks', function(Illuminate\Http\Request $request) {
    return response()->json(['success' => true, 'data' => Block::create($request->all())]);
});
Route::delete('/blocks/{id}', function($id) {
    Block::destroy($id);
    return response()->json(['success' => true]);
});

// Apartments
Route::get('/apartments', function() {
    return response()->json(['success' => true, 'data' => Apartment::all()]);
});
Route::post('/apartments', function(Illuminate\Http\Request $request) {
    return response()->json(['success' => true, 'data' => Apartment::create($request->all())]);
});
Route::delete('/apartments/{id}', function($id) {
    Apartment::destroy($id);
    return response()->json(['success' => true]);
});
