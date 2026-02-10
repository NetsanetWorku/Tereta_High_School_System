<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherSubject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeacherSubjectController extends Controller
{
    // 🔹 ADMIN: Assign teacher to subject & class
    // POST /api/assign-teacher
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
            'class_id'   => 'required|exists:class_rooms,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        $assignment = TeacherSubject::create([
            'teacher_id' => $request->teacher_id,
            'subject_id' => $request->subject_id,
            'class_id' => $request->class_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Teacher assigned successfully',
            'data'    => $assignment
        ], 201);
    }

    // 🔹 ADMIN: View all assignments
    // GET /api/assign-teacher
    public function index()
    {
        $assignments = TeacherSubject::with([
            'teacher.user',
            'subject',
            'classRoom'
        ])->get();

        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    // 🔹 ADMIN: Delete assignment
    // DELETE /api/assign-teacher/{id}
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
}
