<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VisitorRequest;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use App\Mail\VisitorAlert;
use Illuminate\Support\Str;

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

            $visitor = VisitorRequest::create([
                'id' => $requestId,
                'name' => $request->name,
                'phone' => $request->phone,
                'flat' => $request->flat,
                'purpose' => $request->purpose,
                'timestamp' => $timestamp,
                'status' => 'waiting',
                'createdAt' => (int)(microtime(true) * 1000),
            ]);

            // Use the request host to avoid hardcoded IP addresses
            $host = $request->getSchemeAndHttpHost();
            $verifyLink = $host . "/resident/" . $requestId;

            // Send email
            $recipientEmail = 'vinithkumar78878@gmail.com';
            try {
                Mail::to($recipientEmail)->send(new VisitorAlert($visitor, $verifyLink));
            } catch (\Exception $e) {
                // Log error but continue
                \Log::error("Email failed: " . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Visitor registered.',
                'data' => ['requestId' => $requestId]
            ], 200);
        } catch (\Exception $e) {
            \Log::error("Registration failed: " . $e->getMessage());
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
                \Log::error("Socket notification failed: " . $e->getMessage());
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
                \Log::error("Socket notification failed: " . $e->getMessage());
            }

            return response()->json(['success' => true, 'message' => 'Visitor rejected.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $visitors = VisitorRequest::orderBy('createdAt', 'desc')->get();
            return response()->json(['success' => true, 'data' => $visitors], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
