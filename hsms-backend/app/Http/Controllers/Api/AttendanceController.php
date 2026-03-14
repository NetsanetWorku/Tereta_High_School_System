<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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

        // Get classes that this teacher teaches
        $teacherClassIds = DB::table('teacher_subjects')
            ->where('teacher_id', $teacher->id)
            ->pluck('class_id')
            ->unique();

        // Only show attendance for students in teacher's assigned classes
        $attendance = Attendance::with(['student.user', 'classRoom', 'subject'])
            ->whereIn('class_id', $teacherClassIds)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    // 🔹 TEACHER: Record attendance
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
            'class_id' => 'required|exists:class_rooms,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // VALIDATION: Check if teacher is assigned to this class
        $isAssigned = DB::table('teacher_subjects')
            ->where('teacher_id', $teacher->id)
            ->where('class_id', $request->class_id)
            ->when($request->subject_id, function ($query) use ($request) {
                return $query->where('subject_id', $request->subject_id);
            })
            ->exists();

        if (!$isAssigned) {
            return response()->json([
                'success' => false,
                'message' => 'You are not assigned to teach this class' . ($request->subject_id ? ' for this subject' : '')
            ], 403);
        }

        // VALIDATION: Check if student belongs to this class
        $student = Student::find($request->student_id);
        if ($student->class_id != $request->class_id) {
            return response()->json([
                'success' => false,
                'message' => 'Student does not belong to this class'
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
                'class_id' => $request->class_id,
                'teacher_id' => $teacher->id,
                'subject_id' => $request->subject_id,
                'notes' => $request->notes,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Attendance updated',
                'data' => $existing->load(['student.user', 'classRoom', 'subject'])
            ]);
        }

        // Create new attendance record
        $attendance = Attendance::create([
            'student_id' => $request->student_id,
            'class_id' => $request->class_id,
            'teacher_id' => $teacher->id,
            'subject_id' => $request->subject_id,
            'date' => $request->date,
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Attendance recorded',
            'data' => $attendance->load(['student.user', 'classRoom', 'subject'])
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
        $teacher = Teacher::where('user_id', $request->user()->id)->first();

        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher profile not found'], 404);
        }

        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance record not found'], 404);
        }

        // Ownership check: only the teacher who recorded it can update
        if ($attendance->teacher_id !== $teacher->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:present,absent,late,excused'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $attendance->update($request->only('status'));

        return response()->json(['success' => true, 'message' => 'Attendance updated successfully']);
    }
}
