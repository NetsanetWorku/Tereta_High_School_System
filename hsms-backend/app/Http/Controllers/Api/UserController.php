<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get all pending users (Admin only)
     */
    public function getPendingUsers()
    {
        $users = User::where('is_approved', false)
            ->with(['student', 'teacher', 'parent'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Get all approved users (Admin only)
     */
    public function getApprovedUsers()
    {
        $users = User::where('is_approved', true)
            ->with(['student', 'teacher', 'parent'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Approve a user (Admin only)
     */
    public function approveUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => $request->user()->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User approved successfully',
            'data' => $user
        ]);
    }

    /**
     * Reject/Delete a user (Admin only)
     */
    public function rejectUser($id)
    {
        $user = User::findOrFail($id);
        
        // Delete related records first
        if ($user->role === 'student' && $user->student) {
            $user->student->delete();
        } elseif ($user->role === 'teacher' && $user->teacher) {
            $user->teacher->delete();
        } elseif ($user->role === 'parent' && $user->parent) {
            $user->parent->delete();
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User rejected and deleted successfully'
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
