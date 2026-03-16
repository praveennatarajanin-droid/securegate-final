<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingsController extends Controller
{
    /**
     * Get all settings grouped by group.
     */
    public function index()
    {
        try {
            $settings = Setting::all()->groupBy('group');
            // Flatten for easier frontend consumption { key: value }
            $flattened = [];
            foreach (Setting::all() as $setting) {
                $flattened[$setting->key] = $setting->value;
            }
            
            return response()->json([
                'success' => true,
                'data' => $flattened
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update settings.
     */
    public function update(Request $request)
    {
        try {
            $allowedKeys = [
                'mail_mailer', 'mail_host', 'mail_port', 'mail_username', 
                'mail_password', 'mail_encryption', 'mail_from_address', 'mail_from_name'
            ];

            $data = $request->only($allowedKeys);
            
            foreach ($data as $key => $value) {
                // Determine group based on key prefix
                $group = str_starts_with($key, 'mail_') ? 'mail' : 'general';
                Setting::set($key, $value, $group);
            }

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            \Log::error("Settings update failed: " . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
