<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VisitorRequest;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use App\Mail\VisitorAlert;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class VisitorController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'phone' => 'required',
                'flat' => 'required',
                'purpose' => 'required',
            ]);

            $requestId = bin2hex(random_bytes(8));
            $timestamp = date('h:i A');

            $photoPath = null;
            if ($request->visitor_photo) {
                try {
                    $imageData = $request->visitor_photo;
                    if (str_contains($imageData, ',')) {
                        $imageData = explode(',', $imageData)[1];
                    }
                    $decodedImage = base64_decode($imageData);
                    $fileName = 'visitor_' . $requestId . '.jpg';
                    
                    $uploadPath = public_path('uploads/visitors');
                    if (!file_exists($uploadPath)) {
                        mkdir($uploadPath, 0777, true);
                    }
                    
                    file_put_contents($uploadPath . '/' . $fileName, $decodedImage);
                    $photoPath = '/uploads/visitors/' . $fileName;
                    Log::info("✅ Photo saved successfully: " . $photoPath);
                } catch (\Exception $e) {
                    Log::error("❌ Photo save failed: " . $e->getMessage());
                }
            } else {
                Log::warning("⚠️ No visitor_photo found in request payload.");
            }

            $visitor = VisitorRequest::create([
                'id' => $requestId,
                'society_id' => $request->society_id, // Scoped to society
                'name' => $request->name,
                'phone' => $request->phone,
                'flat' => $request->flat,
                'purpose' => $request->purpose,
                'timestamp' => $timestamp,
                'status' => 'waiting',
                'createdAt' => (int)(microtime(true) * 1000),
<<<<<<< HEAD
                'visitor_photo' => $photoPath,
=======
                'visitor_photo' => $request->photo,
>>>>>>> vinith-code
            ]);

            // Extract exact frontend IP/port via Referer to avoid Vite Proxy changing 'Origin' to localhost:8000
            $referer = $request->header('referer');
            $frontendUrl = '';
            if ($referer) {
                $parsed = parse_url($referer);
                if (isset($parsed['scheme']) && isset($parsed['host'])) {
                    $host = $parsed['host'];
                    $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
                    
                    // If accessed via localhost, forcefully change to current network IP for mobile testing
                    if ($host === 'localhost' || $host === '127.0.0.1') {
                        $frontendUrl = env('FRONTEND_URL', 'https://10.100.10.30:5173'); 
                    } else {
                        // Force HTTPS for all mobile/network requests to ensure camera API and secure links work
                        $frontendUrl = 'https://' . $host . $port;
                    }
                }
            }
            
            // Fallback securely to the stored network address if referer is missing
            if (empty($frontendUrl)) {
                $frontendUrl = env('FRONTEND_URL', 'https://10.100.10.30:5173'); 
            }

            $verifyLink = $frontendUrl . "/resident/" . $requestId;

            // Find the resident by flat number
            Log::info("🔍 Looking up resident for flat: " . $request->flat);
            $resident = \App\Models\Resident::where('flat', $request->flat)->first();
            
            if (!$resident) {
                Log::warning("❌ No resident found in DB for flat: " . $request->flat);
                return response()->json([
                    'success' => false,
                    'message' => 'No resident registered for this flat.'
                ], 404);
            }

            if (empty($resident->email) && empty($resident->additional_email)) {
                Log::warning("⚠️ Resident found for flat " . $request->flat . " but has no email address.");
                return response()->json([
                    'success' => false,
                    'message' => 'Resident has no email address.'
                ], 404);
            }

            Log::info("✅ Found resident: " . $resident->name . " | Email: " . ($resident->email ?: 'N/A'));

            $recipientEmails = [];
            if (!empty($resident->email)) {
                $recipientEmails[] = $resident->email;
            }
            if (!empty($resident->additional_email)) {
                $recipientEmails[] = $resident->additional_email;
            }

            try {
                Log::info("Sending visitor approval email to: " . implode(', ', $recipientEmails) . " for flat: " . $request->flat);
                Mail::to($recipientEmails)->send(new VisitorAlert($visitor, $verifyLink));
                Log::info("✅ Email sent successfully to: " . implode(', ', $recipientEmails));
            } catch (\Exception $e) {
                // Log error but continue
                Log::error("❌ Email failed for flat " . $request->flat . ": " . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Visitor registered.',
                'data' => [
                    'requestId' => $requestId,
                    'approvalLink' => $verifyLink,
                    'whatsappUrl' => "https://wa.me/{$request->phone}?text=" . urlencode("Visitor Approval: " . $verifyLink)
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error("Registration failed: " . $e->getMessage() . "\nTrace: " . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Registration failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRequest($id)
    {
        try {
            $request = VisitorRequest::find($id);
            if (!$request) {
                return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
            }
            return response()->json(['success' => true, 'data' => $request]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function getStatus($id)
    {
        try {
            $request = VisitorRequest::find($id);
            if (!$request) {
                return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
            }
            return response()->json([
                'success' => true, 
                'status' => $request->status, 
                'reason' => $request->reason
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function approve($id)
    {
        try {
            $request = VisitorRequest::find($id);
            if (!$request) {
                return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
            }

            $request->update(['status' => 'approved']);

            // Notify Node socket server (if used for signaling)
            try {
                // Use environment variable for socket server if needed, fallback to localhost for now
                $socketUrl = env('SOCKET_SERVER_URL', 'http://localhost:3001');
                Http::post("$socketUrl/api/internal/status-update", [
                    'requestId' => $id,
                    'status' => 'approved'
                ]);
            } catch (\Exception $e) {
                Log::error("Socket notification failed: " . $e->getMessage());
            }

            return response()->json(['success' => true, 'message' => 'Visitor approved.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        try {
            $visitorRequest = VisitorRequest::find($id);
            if (!$visitorRequest) {
                return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
            }

            $reason = $request->reason ?: 'Not expecting anyone';
            $visitorRequest->update(['status' => 'denied', 'reason' => $reason]);

            // Notify Node socket server
            try {
                $socketUrl = env('SOCKET_SERVER_URL', 'http://localhost:3001');
                Http::post("$socketUrl/api/internal/status-update", [
                    'requestId' => $id,
                    'status' => 'denied',
                    'reason' => $reason
                ]);
            } catch (\Exception $e) {
                Log::error("Socket notification failed: " . $e->getMessage());
            }

            return response()->json(['success' => true, 'message' => 'Visitor rejected.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function getAll(Request $request)
    {
        try {
            $query = VisitorRequest::orderBy('created_at', 'desc');
            
            if ($request->has('society_id')) {
                $query->where('society_id', $request->society_id);
            }

            $visitors = $query->get();
            return response()->json(['success' => true, 'data' => $visitors], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
    public function exit($id)
    {
        try {
            $request = VisitorRequest::find($id);
            if (!$request) {
                return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
            }

            $request->update([
                'exit_time' => date('h:i A'),
                'status' => 'exited'
            ]);

            return response()->json(['success' => true, 'message' => 'Exit recorded.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
