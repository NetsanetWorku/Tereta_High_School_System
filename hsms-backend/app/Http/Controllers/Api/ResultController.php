<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ResultController extends Controller
{
    // 🔹 TEACHER: My results only
    // 🔹 TEACHER: My results only
    public function index(Request $request)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->first();

        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher profile not found'
            ], 404);
        }

        // Get classes that this teacher teaches
        $teacherClassIds = \DB::table('teacher_subjects')
            ->where('teacher_id', $teacher->id)
            ->pluck('class_id')
            ->unique();

        // Only show results for students in teacher's assigned classes
        $results = Result::with(['student.user', 'subject', 'classRoom'])
            ->whereIn('class_id', $teacherClassIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }

    // 🔹 TEACHER: Store result
    // 🔹 TEACHER: Store result
    public function store(Request $request)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->first();

        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher profile not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'exam_type' => 'required|in:assignment,test,midterm,final',
            'exam_name' => 'nullable|string|max:255',
            'marks' => 'required|numeric|min:0|max:100',
            'grade' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Get student to get their class_id
        $student = Student::find($request->student_id);

        if (!$student || !$student->class_id) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found or not assigned to a class'
            ], 422);
        }

        // VALIDATION: Check if teacher is assigned to teach this subject to this student's class
        $isAssigned = \DB::table('teacher_subjects')
            ->where('teacher_id', $teacher->id)
            ->where('subject_id', $request->subject_id)
            ->where('class_id', $student->class_id)
            ->exists();

        if (!$isAssigned) {
            return response()->json([
                'success' => false,
                'message' => 'You are not assigned to teach this subject to this student\'s class'
            ], 403);
        }

        // Check if result already exists for this student, subject, and exam type
        $existingResult = Result::where('student_id', $request->student_id)
            ->where('subject_id', $request->subject_id)
            ->where('exam_type', $request->exam_type)
            ->where('exam_name', $request->exam_name)
            ->first();

        if ($existingResult) {
            // Update existing result
            $existingResult->update([
                'marks' => $request->marks,
                'grade' => $request->grade,
                'class_id' => $student->class_id,
                'teacher_id' => $teacher->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Result updated',
                'data' => $existingResult->load(['student.user', 'subject', 'classRoom', 'teacher.user'])
            ], 200);
        }

        // Create new result
        $result = Result::create([
            'student_id' => $request->student_id,
            'subject_id' => $request->subject_id,
            'class_id' => $student->class_id,
            'teacher_id' => $teacher->id,
            'exam_type' => $request->exam_type,
            'exam_name' => $request->exam_name,
            'marks' => $request->marks,
            'grade' => $request->grade
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Result saved',
            'data' => $result->load(['student.user', 'subject', 'classRoom', 'teacher.user'])
        ], 201);
    }

    // 🔹 STUDENT: My results
    public function studentResults(Request $request)
    {
        $student = Student::where('user_id', $request->user()->id)->first();
        
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found'
            ], 404);
        }

        $results = Result::where('student_id', $student->id)
            ->with('subject')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }

    // 🔹 PARENT: Child results
    public function parentResults(Request $request)
    {
        $parent = $request->user()->parentModel;
        
        if (!$parent) {
            return response()->json([
                'success' => false,
                'message' => 'Parent profile not found'
            ], 404);
        }

        $results = Result::whereIn('student_id', $parent->students->pluck('id'))
            ->with(['student.user', 'subject'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }

    // 🔹 TEACHER: Update result
    public function update(Request $request, $id)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->first();

        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher profile not found'], 404);
        }

        $result = Result::find($id);

        if (!$result) {
            return response()->json(['success' => false, 'message' => 'Result not found'], 404);
        }

        // Ownership check: only the teacher who created it can update
        if ($result->teacher_id !== $teacher->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'marks' => 'sometimes|numeric|min:0|max:100',
            'grade' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $result->update($request->only('marks', 'grade'));

        return response()->json(['success' => true, 'message' => 'Result updated successfully']);
    }
}
