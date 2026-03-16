<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\AdminAuditLog;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = AdminAuditLog::query();

            if ($request->has('action') && !empty($request->action)) {
                $query->where('action', 'like', '%' . $request->action . '%');
            }
            if ($request->has('search') && !empty($request->search)) {
                $query->where('description', 'like', '%' . $request->search . '%');
            }

            $perPage = $request->query('limit', 15);
            $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $logs->items(),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'last_page' => $logs->lastPage(),
                    'total' => $logs->total(),
                    'per_page' => $logs->perPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
