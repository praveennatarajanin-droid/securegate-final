<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Society;

class SocietyController extends Controller
{
    public function index()
    {
        try {
            $societies = Society::withCount('users')->get();
            return response()->json(['success' => true, 'data' => $societies], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:100',
                'postal_code' => 'required|string|max:20',
                'unit_count' => 'required|integer|min:0',
            ]);

            $society = Society::create([
                'name' => $request->name,
                'type' => $request->type,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'unit_count' => $request->unit_count,
                'status' => 'Active',
            ]);

            return response()->json(['success' => true, 'message' => 'Society created.', 'data' => $society], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $society = Society::findOrFail($id);
            $society->update($request->all());
            return response()->json(['success' => true, 'message' => 'Society updated.', 'data' => $society], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $society = Society::findOrFail($id);
            $society->delete();
            return response()->json(['success' => true, 'message' => 'Society deleted.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
