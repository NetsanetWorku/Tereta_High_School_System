<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParentModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ParentController extends Controller
{
    // 🔹 ADMIN: List all parents
    // GET /api/parents
    public function index()
    {
        $parents = ParentModel::with(['user', 'students.user', 'students.classRoom'])->get()->map(function ($parent) {
            return [
                'id' => $parent->id,
                'name' => $parent->user->name ?? '',
                'email' => $parent->user->email ?? '',
                'phone' => $parent->phone,
                'address' => $parent->address,
                'emergency_contact' => $parent->emergency_contact,
                'user_id' => $parent->user_id,
                'students' => $parent->students->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->user->name ?? '',
                        'email' => $student->user->email ?? '',
                        'student_code' => $student->student_code,
                        'class_id' => $student->class_id,
                        'class_name' => $student->classRoom ? $student->classRoom->name : null,
                    ];
                }),
                'created_at' => $parent->created_at,
                'updated_at' => $parent->updated_at
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $parents
        ]);
    }

    // 🔹 ADMIN: Create parent
    // POST /api/parents
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone'    => 'required',
            'address'  => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Create user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'parent'
        ]);

        // Create parent profile
        $parent = ParentModel::create([
            'user_id' => $user->id,
            'phone'   => $request->phone,
            'address' => $request->address
        ]);

        // Load user relationship
        $parent->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Parent created successfully',
            'data' => [
                'id' => $parent->id,
                'name' => $parent->user->name,
                'email' => $parent->user->email,
                'phone' => $parent->phone,
                'address' => $parent->address,
                'user_id' => $parent->user_id
            ]
        ], 201);
    }

    // 🔹 ADMIN: Assign student to parent
    // POST /api/parents/assign-student
    public function assignStudent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'parent_id'  => 'required|exists:parents,id',
            'student_id' => 'required|exists:students,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $parent = ParentModel::find($request->parent_id);
        $parent->students()->syncWithoutDetaching([$request->student_id]);

        return response()->json([
            'success' => true,
            'message' => 'Student assigned to parent'
        ]);
    }

    // 🔹 PARENT: View own children
    // GET /api/parent/children
    public function myChildren(Request $request)
    {
        $parent = $request->user()->parentModel;
        
        $parent = ParentModel::where('user_id', $request->user()->id)
            ->with(['students.classRoom'])
            ->first();

        if (!$parent) {
            return response()->json([
                'success' => false,
                'message' => 'Parent profile not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $parent->students
        ]);
    }

    // 🔹 ADMIN: Delete parent
    // DELETE /api/parents/{id}
    public function destroy($id)
    {
        $parent = ParentModel::find($id);

        if (!$parent) {
            return response()->json([
                'success' => false,
                'message' => 'Parent not found'
            ], 404);
        }

        $parent->user()->delete();
        $parent->delete();

        return response()->json([
            'success' => true,
            'message' => 'Parent deleted successfully'
        ]);
    }
}
