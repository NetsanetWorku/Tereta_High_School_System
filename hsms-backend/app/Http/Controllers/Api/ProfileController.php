<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Upload profile picture
     * POST /api/profile/upload-picture
     */
    public function uploadPicture(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Delete old profile picture if exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Store new profile picture
        $file = $request->file('profile_picture');
        $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('profile_pictures', $filename, 'public');

        // Update user profile picture
        $user->profile_picture = $path;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile picture uploaded successfully',
            'profile_picture' => $path,
            'profile_picture_url' => Storage::url($path)
        ]);
    }

    /**
     * Get profile picture URL
     * GET /api/profile/picture
     */
    public function getPicture(Request $request)
    {
        $user = $request->user();

        if (!$user->profile_picture) {
            return response()->json([
                'success' => false,
                'message' => 'No profile picture found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'profile_picture' => $user->profile_picture,
            'profile_picture_url' => Storage::url($user->profile_picture)
        ]);
    }

    /**
     * Delete profile picture
     * DELETE /api/profile/picture
     */
    public function deletePicture(Request $request)
    {
        $user = $request->user();

        if (!$user->profile_picture) {
            return response()->json([
                'success' => false,
                'message' => 'No profile picture to delete'
            ], 404);
        }

        // Delete file from storage
        Storage::disk('public')->delete($user->profile_picture);

        // Update user record
        $user->profile_picture = null;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile picture deleted successfully'
        ]);
    }

    /**
     * Update user profile
     * PUT /api/profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'profile_picture' => $user->profile_picture,
                'profile_picture_url' => $user->profile_picture ? Storage::url($user->profile_picture) : null
            ]
        ]);
    }
}
