<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use App\Models\TeacherSubject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    // 🔹 ADMIN: GET /api/teachers
    public function index()
    {
        $teachers = Teacher::with('user')->get()->map(function ($teacher) {
            return [
                'id' => $teacher->id,
                'name' => $teacher->user->name ?? '',
                'email' => $teacher->user->email ?? '',
                'subject_specialization' => $teacher->subject_specialization,
                'qualification' => $teacher->qualification,
                'experience_years' => $teacher->experience_years,
                'hire_date' => $teacher->hire_date,
                'user_id' => $teacher->user_id,
                'created_at' => $teacher->created_at,
                'updated_at' => $teacher->updated_at
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $teachers
        ]);
    }

    // 🔹 ADMIN: POST /api/teachers
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'subject_specialization' => 'nullable|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'hire_date' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'teacher',
            'is_approved' => true
        ]);

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'subject_specialization' => $request->subject_specialization,
            'qualification' => $request->qualification,
            'experience_years' => $request->experience_years,
            'hire_date' => $request->hire_date
        ]);

        // Load user relationship
        $teacher->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Teacher created successfully',
            'data'    => [
                'id' => $teacher->id,
                'name' => $teacher->user->name,
                'email' => $teacher->user->email,
                'subject_specialization' => $teacher->subject_specialization,
                'qualification' => $teacher->qualification,
                'experience_years' => $teacher->experience_years,
                'hire_date' => $teacher->hire_date,
                'user_id' => $teacher->user_id
            ]
        ], 201);
    }

    // 🔹 ADMIN: GET /api/teachers/{id}
    public function show($id)
    {
        $teacher = Teacher::with(['user', 'subjects.subject', 'subjects.classRoom'])
            ->find($id);

        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $teacher
        ]);
    }

    // 🔹 ADMIN: PUT /api/teachers/{id}
    public function update(Request $request, $id)
    {
        $teacher = Teacher::find($id);

        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $teacher->user_id,
            'subject_specialization' => 'sometimes|string|max:255',
            'qualification' => 'sometimes|string|max:255',
            'experience_years' => 'sometimes|integer|min:0',
            'hire_date' => 'sometimes|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Update user table (name, email)
        $teacher->user->update($request->only('name', 'email'));

        // Update teacher table (teacher-specific fields)
        $teacher->update($request->only([
            'subject_specialization',
            'qualification',
            'experience_years',
            'hire_date'
        ]));

        // Reload the teacher with user relationship
        $teacher->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Teacher updated successfully',
            'data' => [
                'id' => $teacher->id,
                'name' => $teacher->user->name,
                'email' => $teacher->user->email,
                'subject_specialization' => $teacher->subject_specialization,
                'qualification' => $teacher->qualification,
                'experience_years' => $teacher->experience_years,
                'hire_date' => $teacher->hire_date,
                'user_id' => $teacher->user_id
            ]
        ]);
    }

    // 🔹 ADMIN: DELETE /api/teachers/{id}
    public function destroy($id)
    {
        $teacher = Teacher::find($id);

        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher not found'
            ], 404);
        }

        $teacher->user()->delete();
        $teacher->delete();

        return response()->json([
            'success' => true,
            'message' => 'Teacher deleted successfully'
        ]);
    }

    // 🔹 TEACHER: GET /api/my-classes
    public function myClasses(Request $request)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->first();

        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher profile not found'
            ], 404);
        }

        $assignments = TeacherSubject::with(['subject', 'classRoom.students.user'])
            ->where('teacher_id', $teacher->id)
            ->get();

        // Transform data to include students and use 'class' key for frontend compatibility
        $transformedAssignments = $assignments->map(function ($assignment) {
            $classRoom = $assignment->classRoom;
            $students = $classRoom && $classRoom->students ? $classRoom->students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name ?? 'Unknown',
                    'student_id' => $student->student_code ?? 'N/A',
                    'email' => $student->user->email ?? ''
                ];
            }) : [];

            return [
                'id' => $assignment->id,
                'subject' => $assignment->subject ? [
                    'id' => $assignment->subject->id,
                    'name' => $assignment->subject->name,
                    'code' => $assignment->subject->code
                ] : null,
                'class' => $classRoom ? [
                    'id' => $classRoom->id,
                    'name' => $classRoom->name,
                    'section' => $classRoom->section,
                    'grade' => $classRoom->grade
                ] : null,
                'classRoom' => $classRoom, // Keep for backward compatibility
                'students' => $students
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedAssignments
        ]);
    }
    
}
