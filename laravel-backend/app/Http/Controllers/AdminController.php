<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminInvitation;
use Illuminate\Validation\ValidationException;
use App\Services\MailSettingsService;
use App\Models\AdminAuditLog;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = User::where('role', 'admin')->with('society');

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('limit', 10);
            $admins = $query->paginate($perPage);

            return response()->json([
                'success' => true, 
                'data' => $admins->items(),
                'meta' => [
                    'current_page' => $admins->currentPage(),
                    'last_page' => $admins->lastPage(),
                    'total' => $admins->total(),
                    'per_page' => $admins->perPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'society_id' => 'required|exists:societies,id',
            ]);

            $admin = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'admin',
                'society_id' => $request->society_id,
            ]);

            $admin->load('society');

            // Apply dynamic mail settings
            MailSettingsService::apply();

            // Send invitation email
            try {
                Mail::to($admin->email)->send(new AdminInvitation($admin, $request->password));
                $admin->update(['invitation_status' => 'sent']);
            } catch (\Exception $e) {
                \Log::error("Invitation email failed: " . $e->getMessage());
            }

            AdminAuditLog::create([
                'user_id' => $admin->id,
                'action' => 'Admin Created',
                'description' => "Admin {$admin->name} ({$admin->email}) was created.",
                'ip_address' => $request->ip(),
            ]);

            return response()->json(['success' => true, 'message' => 'Admin created and invitation sent.', 'data' => $admin], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false, 
                'error' => 'Validation failed', 
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error("Admin creation failed: " . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $admin = User::findOrFail($id);
            $data = $request->only(['name', 'email', 'society_id', 'role']);
            if ($request->has('password') && !empty($request->password)) {
                $data['password'] = Hash::make($request->password);
            }
            $admin->update($data);

            AdminAuditLog::create([
                'user_id' => $admin->id,
                'action' => 'Admin Updated',
                'description' => "Admin {$admin->name} was updated.",
                'ip_address' => $request->ip(),
            ]);

            return response()->json(['success' => true, 'message' => 'Admin updated.', 'data' => $admin], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $admin = User::findOrFail($id);
            $adminName = $admin->name;
            $admin->delete();

            AdminAuditLog::create([
                'user_id' => null, // Deleted
                'action' => 'Admin Deleted',
                'description' => "Admin {$adminName} was deleted.",
                'ip_address' => request()->ip(),
            ]);

            return response()->json(['success' => true, 'message' => 'Admin deleted.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function resendInvitation(Request $request, $id)
    {
        try {
            $admin = User::with('society')->findOrFail($id);
            
            // Generate a temporary password for the invitation if none provided
            // In a real app, you might want a password reset link instead
            $tempPassword = $request->password ?: 'SecureGate' . rand(1000, 9999);
            
            $admin->password = Hash::make($tempPassword);
            $admin->save();

            MailSettingsService::apply();
            Mail::to($admin->email)->send(new AdminInvitation($admin, $tempPassword));
            $admin->update(['invitation_status' => 'sent']);

            return response()->json(['success' => true, 'message' => 'Invitation sent successfully.'], 200);
        } catch (\Exception $e) {
            \Log::error("Resend invitation failed: " . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function bulkAction(Request $request)
    {
        try {
            $action = $request->action;
            $ids = $request->admin_ids;

            if (empty($ids) || !is_array($ids)) {
                return response()->json(['success' => false, 'error' => 'No admins selected'], 400);
            }

            if ($action === 'delete') {
                User::whereIn('id', $ids)->delete();
                AdminAuditLog::create([
                    'action' => 'Bulk Delete',
                    'description' => count($ids) . " admins deleted.",
                    'ip_address' => $request->ip(),
                ]);
                return response()->json(['success' => true, 'message' => 'Admins deleted successfully.']);
            } elseif ($action === 'assign_society') {
                if (!$request->has('society_id')) {
                    return response()->json(['success' => false, 'error' => 'Society ID required for assignment'], 400);
                }
                User::whereIn('id', $ids)->update(['society_id' => $request->society_id]);
                AdminAuditLog::create([
                    'action' => 'Bulk Assign',
                    'description' => count($ids) . " admins assigned to society {$request->society_id}.",
                    'ip_address' => $request->ip(),
                ]);
                return response()->json(['success' => true, 'message' => 'Admins assigned successfully.']);
            }

            return response()->json(['success' => false, 'error' => 'Invalid action'], 400);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
