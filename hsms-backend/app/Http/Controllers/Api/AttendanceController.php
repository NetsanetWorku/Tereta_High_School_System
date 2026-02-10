<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    // 🔹 TEACHER: List attendance for own classes
    public function index(Request $request)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->first();
        
        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher profile not found'
            ], 404);
        }

        $attendance = Attendance::with(['student.user', 'classRoom'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    // 🔹 TEACHER: Record attendance
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:class_rooms,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if attendance already exists for this student on this date
        $existing = Attendance::where('student_id', $request->student_id)
            ->where('date', $request->date)
            ->first();

        if ($existing) {
            // Update existing record
            $existing->update([
                'status' => $request->status,
                'class_id' => $request->class_id
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Attendance updated',
                'data' => $existing
            ]);
        }

        // Create new attendance record
        $attendance = Attendance::create($request->only(['student_id', 'class_id', 'date', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Attendance recorded',
            'data' => $attendance
        ], 201);
    }

    // 🔹 STUDENT: My attendance
    public function studentAttendance(Request $request)
    {
        $student = Student::where('user_id', $request->user()->id)->first();
        
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found'
            ], 404);
        }

        $attendance = Attendance::where('student_id', $student->id)
            ->with('classRoom')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    // 🔹 PARENT: Child attendance
    public function parentAttendance(Request $request)
    {
        $parent = $request->user()->parentModel;
        
        if (!$parent) {
            return response()->json([
                'success' => false,
                'message' => 'Parent profile not found'
            ], 404);
        }

        $attendance = Attendance::whereIn(
            'student_id',
            $parent->students->pluck('id')
        )->with(['student.user', 'classRoom'])->get();

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    // 🔹 TEACHER: Update attendance
    public function update(Request $request, $id)
    {
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance record not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:present,absent'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $attendance->update($request->only('status'));

        return response()->json([
            'success' => true,
            'message' => 'Attendance updated successfully'
        ]);
    }
}
