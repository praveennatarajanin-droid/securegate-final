<?php

namespace App\Http\Controllers;

use App\Models\GlobalAnnouncement;
use Illuminate\Http\Request;

class GlobalAnnouncementController extends Controller
{
    public function index()
    {
        try {
            $announcements = GlobalAnnouncement::orderBy('created_at', 'desc')->get();
            return response()->json(['success' => true, 'data' => $announcements], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function getActive()
    {
        try {
            $announcements = GlobalAnnouncement::where('is_active', true)
                ->where(function($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                })
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json(['success' => true, 'data' => $announcements], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'type' => 'required|in:info,warning,danger,success',
                'is_active' => 'boolean',
                'expires_at' => 'nullable|date'
            ]);

            $announcement = GlobalAnnouncement::create($validated);
            return response()->json(['success' => true, 'data' => $announcement], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $announcement = GlobalAnnouncement::findOrFail($id);
            $validated = $request->validate([
                'title' => 'string|max:255',
                'message' => 'string',
                'type' => 'in:info,warning,danger,success',
                'is_active' => 'boolean',
                'expires_at' => 'nullable|date'
            ]);

            $announcement->update($validated);
            return response()->json(['success' => true, 'data' => $announcement], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $announcement = GlobalAnnouncement::findOrFail($id);
            $announcement->delete();
            return response()->json(['success' => true, 'message' => 'Announcement deleted.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
