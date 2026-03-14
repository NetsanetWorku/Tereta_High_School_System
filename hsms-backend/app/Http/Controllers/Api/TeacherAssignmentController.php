<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherSubject;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\ClassRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeacherAssignmentController extends Controller
{
    // 🔹 ADMIN: GET /api/teacher-assignments
    public function index()
    {
        $assignments = TeacherSubject::with(['teacher.user', 'subject', 'classRoom'])
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'teacher_id' => $assignment->teacher_id,
                    'teacher_name' => $assignment->teacher->user->name ?? '',
                    'subject_id' => $assignment->subject_id,
                    'subject_name' => $assignment->subject->name ?? '',
                    'class_id' => $assignment->class_id,
                    'class_name' => $assignment->classRoom->name ?? '',
                    'class_section' => $assignment->classRoom->section ?? '',
                    'created_at' => $assignment->created_at,
                    'updated_at' => $assignment->updated_at
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    // 🔹 ADMIN: POST /api/teacher-assignments
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:class_rooms,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if assignment already exists
        $existing = TeacherSubject::where('teacher_id', $request->teacher_id)
            ->where('subject_id', $request->subject_id)
            ->where('class_id', $request->class_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'This teacher is already assigned to this subject and class'
            ], 409);
        }

        $assignment = TeacherSubject::create([
            'teacher_id' => $request->teacher_id,
            'subject_id' => $request->subject_id,
            'class_id' => $request->class_id
        ]);

        $assignment->load(['teacher.user', 'subject', 'classRoom']);

        return response()->json([
            'success' => true,
            'message' => 'Teacher assigned successfully',
            'data' => [
                'id' => $assignment->id,
                'teacher_id' => $assignment->teacher_id,
                'teacher_name' => $assignment->teacher->user->name ?? '',
                'subject_id' => $assignment->subject_id,
                'subject_name' => $assignment->subject->name ?? '',
                'class_id' => $assignment->class_id,
                'class_name' => $assignment->classRoom->name ?? '',
                'class_section' => $assignment->classRoom->section ?? ''
            ]
        ], 201);
    }

    // 🔹 ADMIN: DELETE /api/teacher-assignments/{id}
    public function destroy($id)
    {
        $assignment = TeacherSubject::find($id);

        if (!$assignment) {
            return response()->json([
                'success' => false,
                'message' => 'Assignment not found'
            ], 404);
        }

        $assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Assignment removed successfully'
        ]);
    }

    // 🔹 ADMIN: GET /api/teachers-without-assignments
    public function getTeachersWithoutAssignments()
    {
        $teachers = Teacher::with('user')
            ->whereDoesntHave('teacherSubjects')
            ->get()
            ->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->user->name ?? '',
                    'email' => $teacher->user->email ?? '',
                    'subject_specialization' => $teacher->subject_specialization
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $teachers
        ]);
    }

    // 🔹 ADMIN: GET /api/available-subjects
    public function getAvailableSubjects()
    {
        $subjects = Subject::all();

        return response()->json([
            'success' => true,
            'data' => $subjects
        ]);
    }

    // 🔹 ADMIN: GET /api/available-classes
    public function getAvailableClasses()
    {
        $classes = ClassRoom::all();

        return response()->json([
            'success' => true,
            'data' => $classes
        ]);
    }
}