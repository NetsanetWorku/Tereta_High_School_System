<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResultController extends Controller
{
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

        $results = Result::with(['student.user', 'subject'])->get();

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }

    // 🔹 TEACHER: Store result
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks' => 'required|numeric|min:0|max:100',
            'grade' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if result already exists for this student and subject
        $existingResult = Result::where('student_id', $request->student_id)
            ->where('subject_id', $request->subject_id)
            ->first();

        if ($existingResult) {
            // Update existing result
            $existingResult->update([
                'marks' => $request->marks,
                'grade' => $request->grade
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Result updated',
                'data' => $existingResult
            ], 200);
        }

        // Create new result
        $result = Result::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Result saved',
            'data' => $result
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
        $result = Result::find($id);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Result not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'marks' => 'sometimes|numeric|min:0|max:100',
            'grade' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $result->update($request->only('marks', 'grade'));

        return response()->json([
            'success' => true,
            'message' => 'Result updated successfully'
        ]);
    }
}
