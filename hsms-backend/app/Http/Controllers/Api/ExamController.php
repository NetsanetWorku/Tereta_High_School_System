<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\ExamResult;
use App\Models\ClassRoom;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExamController extends Controller
{
    // Admin: Get all exams
    public function index()
    {
        $exams = Exam::with('schedules')->orderBy('start_date', 'desc')->get();
        return response()->json(['data' => $exams]);
    }

    // Admin: Get single exam
    public function show($id)
    {
        $exam = Exam::with('schedules')->findOrFail($id);
        return response()->json(['data' => $exam]);
    }

    // Admin: Create exam
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'exam_type' => 'required|in:midterm,final,quiz,test',
            'academic_year' => 'required|string',
            'term' => 'required|in:1,2,3',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $exam = Exam::create($validated);
        return response()->json(['data' => $exam, 'message' => 'Exam created successfully'], 201);
    }

    // Admin: Update exam
    public function update(Request $request, $id)
    {
        $exam = Exam::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'exam_type' => 'in:midterm,final,quiz,test',
            'academic_year' => 'string',
            'term' => 'in:1,2,3',
            'start_date' => 'date',
            'end_date' => 'date|after_or_equal:start_date',
        ]);

        $exam->update($validated);
        return response()->json(['data' => $exam, 'message' => 'Exam updated successfully']);
    }

    // Admin: Delete exam
    public function destroy($id)
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();
        return response()->json(['message' => 'Exam deleted successfully']);
    }

    // Admin: Get exam schedules for a specific exam
    public function getSchedules($examId)
    {
        $schedules = ExamSchedule::where('exam_id', $examId)
            ->with(['subject', 'class', 'exam'])
            ->orderBy('exam_date')
            ->orderBy('start_time')
            ->get();

        return response()->json(['data' => $schedules]);
    }

    // Admin: Create exam schedule
    public function storeSchedule(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:class_rooms,id',
            'exam_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'room_number' => 'nullable|string',
            'total_marks' => 'required|integer|min:1',
        ]);

        $schedule = ExamSchedule::create($validated);
        $schedule->load(['subject', 'class', 'exam']);

        return response()->json(['data' => $schedule, 'message' => 'Exam schedule created successfully'], 201);
    }

    // Admin: Update exam schedule
    public function updateSchedule(Request $request, $id)
    {
        $schedule = ExamSchedule::findOrFail($id);

        $validated = $request->validate([
            'exam_date' => 'date',
            'start_time' => 'string',
            'end_time' => 'string',
            'room_number' => 'nullable|string',
            'total_marks' => 'integer|min:1',
        ]);

        $schedule->update($validated);
        $schedule->load(['subject', 'class', 'exam']);

        return response()->json(['data' => $schedule, 'message' => 'Exam schedule updated successfully']);
    }

    // Admin: Delete exam schedule
    public function destroySchedule($id)
    {
        $schedule = ExamSchedule::findOrFail($id);
        $schedule->delete();
        return response()->json(['message' => 'Exam schedule deleted successfully']);
    }

    // Teacher: Get exam schedules for teacher's subjects
    public function getTeacherSchedules(Request $request)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['data' => []]);
        }

        // Get teacher's subject IDs
        $subjectIds = DB::table('teacher_subjects')
            ->where('teacher_id', $teacher->id)
            ->pluck('subject_id');

        $schedules = ExamSchedule::whereIn('subject_id', $subjectIds)
            ->with(['subject', 'class', 'exam'])
            ->orderBy('exam_date')
            ->orderBy('start_time')
            ->get();

        return response()->json(['data' => $schedules]);
    }

    // Teacher: Get students for a specific exam schedule
    public function getScheduleStudents($scheduleId)
    {
        $schedule = ExamSchedule::with(['class', 'subject', 'exam'])->findOrFail($scheduleId);
        
        $students = Student::where('class_id', $schedule->class_id)
            ->with(['user'])
            ->get();

        // Get existing results
        $results = ExamResult::where('exam_schedule_id', $scheduleId)
            ->get()
            ->keyBy('student_id');

        // Merge students with their results
        $studentsWithResults = $students->map(function ($student) use ($results) {
            $result = $results->get($student->id);
            return [
                'id' => $student->id,
                'name' => $student->user->name ?? 'Unknown',
                'student_code' => $student->student_code,
                'marks_obtained' => $result ? $result->marks_obtained : null,
                'grade' => $result ? $result->grade : null,
                'remarks' => $result ? $result->remarks : null,
                'result_id' => $result ? $result->id : null,
            ];
        });

        return response()->json(['data' => $studentsWithResults, 'schedule' => $schedule]);
    }

    // Teacher: Save exam result
    public function storeResult(Request $request)
    {
        $validated = $request->validate([
            'exam_schedule_id' => 'required|exists:exam_schedules,id',
            'student_id' => 'required|exists:students,id',
            'marks_obtained' => 'required|integer|min:0',
            'remarks' => 'nullable|string',
        ]);

        $schedule = ExamSchedule::findOrFail($validated['exam_schedule_id']);
        
        // Calculate grade
        $grade = ExamResult::calculateGrade($validated['marks_obtained'], $schedule->total_marks);
        $validated['grade'] = $grade;

        // Update or create result
        $result = ExamResult::updateOrCreate(
            [
                'exam_schedule_id' => $validated['exam_schedule_id'],
                'student_id' => $validated['student_id'],
            ],
            $validated
        );

        return response()->json(['data' => $result, 'message' => 'Result saved successfully']);
    }

    // Student: Get exam schedules for student's class
    public function getStudentSchedules(Request $request)
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student || !$student->class_id) {
            return response()->json(['data' => []]);
        }

        $schedules = ExamSchedule::where('class_id', $student->class_id)
            ->with(['subject', 'class', 'exam'])
            ->orderBy('exam_date')
            ->orderBy('start_time')
            ->get();

        return response()->json(['data' => $schedules]);
    }

    // Student: Get exam results
    public function getStudentResults(Request $request)
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['data' => []]);
        }

        $results = ExamResult::where('student_id', $student->id)
            ->with(['examSchedule.subject', 'examSchedule.exam'])
            ->get();

        return response()->json(['data' => $results]);
    }

    // Parent: Get child's exam schedules
    public function getChildSchedules(Request $request, $studentId)
    {
        $student = Student::findOrFail($studentId);

        if (!$student->class_id) {
            return response()->json(['data' => []]);
        }

        $schedules = ExamSchedule::where('class_id', $student->class_id)
            ->with(['subject', 'class', 'exam'])
            ->orderBy('exam_date')
            ->orderBy('start_time')
            ->get();

        return response()->json(['data' => $schedules]);
    }

    // Parent: Get child's exam results
    public function getChildResults(Request $request, $studentId)
    {
        $results = ExamResult::where('student_id', $studentId)
            ->with(['examSchedule.subject', 'examSchedule.exam'])
            ->get();

        return response()->json(['data' => $results]);
    }
}
