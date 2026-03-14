<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    // 🔹 GET /api/students
    public function index()
    {
        $students = Student::with(['user', 'classRoom'])->get()->map(function ($student) {
            return [
                'id' => $student->id,
                'name' => $student->user->name ?? '',
                'email' => $student->user->email ?? '',
                'student_code' => $student->student_code,
                'class_id' => $student->class_id,
                'grade' => $student->grade,
                'guardian_name' => $student->guardian_name,
                'guardian_phone' => $student->guardian_phone,
                'class' => $student->classRoom ? [
                    'id' => $student->classRoom->id,
                    'name' => $student->classRoom->name,
                    'section' => $student->classRoom->section,
                    'grade' => $student->classRoom->grade
                ] : null,
                'user_id' => $student->user_id,
                'created_at' => $student->created_at,
                'updated_at' => $student->updated_at
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $students
        ]);
    }

    // 🔹 POST /api/students
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|min:6',
            'class_id'     => 'required|exists:class_rooms,id',
            'student_code' => 'nullable|unique:students,student_code'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Create user account
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'student'
        ]);

        // Generate student code if not provided
        $studentCode = $request->student_code ?: ('STU' . str_pad($user->id, 4, '0', STR_PAD_LEFT));

        // Create student record
        $student = Student::create([
            'user_id'      => $user->id,
            'class_id'     => $request->class_id,
            'student_code' => $studentCode
        ]);

        // Load relationships
        $student->load(['user', 'classRoom']);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data'    => [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'student_code' => $student->student_code,
                'class_id' => $student->class_id,
                'grade' => $student->grade,
                'user_id' => $student->user_id
            ]
        ], 201);
    }

    // 🔹 GET /api/students/{id}
    public function show($id)
    {
        $student = Student::with(['user', 'classRoom'])->find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $student->id,
                'name' => $student->user->name ?? '',
                'email' => $student->user->email ?? '',
                'student_code' => $student->student_code,
                'class_id' => $student->class_id,
                'grade' => $student->grade,
                'class_name' => $student->classRoom ? $student->classRoom->name : null,
                'class_section' => $student->classRoom ? $student->classRoom->section : null,
                'user_id' => $student->user_id
            ]
        ]);
    }

    // 🔹 PUT /api/students/{id}
    public function update(Request $request, $id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'           => 'sometimes|string|max:255',
            'email'          => 'sometimes|email|unique:users,email,' . $student->user_id,
            'student_code'   => 'sometimes|string|unique:students,student_code,' . $id,
            'class_id'       => 'sometimes|nullable|exists:class_rooms,id',
            'grade'          => 'sometimes|string',
            'guardian_name'  => 'sometimes|string|max:255',
            'guardian_phone' => 'sometimes|string|max:20'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Update user info
        if ($request->has('name') || $request->has('email')) {
            $student->user->update($request->only('name', 'email'));
        }

        // Update student info
        $student->update($request->only([
            'student_code',
            'class_id',
            'grade',
            'guardian_name',
            'guardian_phone'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => $student->load('user', 'classRoom')
        ]);
    }

    // 🔹 DELETE /api/students/{id}
    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        // Delete related user
        $student->user()->delete();
        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully'
        ]);
    }
}
