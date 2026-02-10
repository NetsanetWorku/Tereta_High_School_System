<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Attendance;
use App\Models\Result;
use App\Models\ClassRoom;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // Student Performance Report
    public function studentPerformance(Request $request, $studentId)
    {
        $student = Student::with(['class', 'user'])->find($studentId);
        
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        // Get all results
        $results = Result::with('subject')
            ->where('student_id', $studentId)
            ->get();

        // Calculate statistics
        $totalMarks = $results->sum('marks');
        $averageMarks = $results->count() > 0 ? round($totalMarks / $results->count(), 2) : 0;
        
        // Get attendance statistics
        $totalAttendance = Attendance::where('student_id', $studentId)->count();
        $presentCount = Attendance::where('student_id', $studentId)
            ->where('status', 'present')
            ->count();
        $attendancePercentage = $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100, 2) : 0;

        // Subject-wise performance
        $subjectPerformance = $results->groupBy('subject_id')->map(function ($subjectResults) {
            $subject = $subjectResults->first()->subject;
            return [
                'subject' => $subject->name,
                'marks' => $subjectResults->first()->marks,
                'grade' => $subjectResults->first()->grade,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'student' => $student,
                'average_marks' => $averageMarks,
                'attendance_percentage' => $attendancePercentage,
                'total_subjects' => $results->count(),
                'subject_performance' => $subjectPerformance,
                'results' => $results,
            ]
        ]);
    }

    // Class Performance Report
    public function classPerformance(Request $request, $classId)
    {
        $class = ClassRoom::with('students')->find($classId);
        
        if (!$class) {
            return response()->json(['success' => false, 'message' => 'Class not found'], 404);
        }

        $studentIds = $class->students->pluck('id');

        // Get all results for this class
        $results = Result::with(['student.user', 'subject'])
            ->whereIn('student_id', $studentIds)
            ->get();

        // Calculate class average
        $classAverage = $results->count() > 0 ? round($results->avg('marks'), 2) : 0;

        // Top performers
        $topPerformers = $results->groupBy('student_id')->map(function ($studentResults, $studentId) {
            $student = $studentResults->first()->student;
            $average = round($studentResults->avg('marks'), 2);
            return [
                'student_id' => $studentId,
                'student_name' => $student->user->name,
                'average_marks' => $average,
            ];
        })->sortByDesc('average_marks')->take(5)->values();

        // Subject-wise class average
        $subjectAverages = $results->groupBy('subject_id')->map(function ($subjectResults) {
            $subject = $subjectResults->first()->subject;
            return [
                'subject' => $subject->name,
                'average_marks' => round($subjectResults->avg('marks'), 2),
                'highest_marks' => $subjectResults->max('marks'),
                'lowest_marks' => $subjectResults->min('marks'),
            ];
        })->values();

        // Attendance statistics
        $totalAttendance = Attendance::whereIn('student_id', $studentIds)->count();
        $presentCount = Attendance::whereIn('student_id', $studentIds)
            ->where('status', 'present')
            ->count();
        $classAttendance = $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100, 2) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'class' => $class,
                'total_students' => $class->students->count(),
                'class_average' => $classAverage,
                'class_attendance' => $classAttendance,
                'top_performers' => $topPerformers,
                'subject_averages' => $subjectAverages,
            ]
        ]);
    }

    // Attendance Report
    public function attendanceReport(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $classId = $request->input('class_id');

        $query = Attendance::with(['student.user', 'student.class', 'subject']);

        if ($startDate) {
            $query->whereDate('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('date', '<=', $endDate);
        }
        if ($classId) {
            $query->whereHas('student', function ($q) use ($classId) {
                $q->where('class_id', $classId);
            });
        }

        $attendanceRecords = $query->get();

        // Statistics
        $totalRecords = $attendanceRecords->count();
        $presentCount = $attendanceRecords->where('status', 'present')->count();
        $absentCount = $attendanceRecords->where('status', 'absent')->count();
        $lateCount = $attendanceRecords->where('status', 'late')->count();

        $statistics = [
            'total' => $totalRecords,
            'present' => $presentCount,
            'absent' => $absentCount,
            'late' => $lateCount,
            'present_percentage' => $totalRecords > 0 ? round(($presentCount / $totalRecords) * 100, 2) : 0,
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $statistics,
                'records' => $attendanceRecords,
            ]
        ]);
    }

    // Results Report
    public function resultsReport(Request $request)
    {
        $classId = $request->input('class_id');
        $subjectId = $request->input('subject_id');

        $query = Result::with(['student.user', 'student.class', 'subject']);

        if ($classId) {
            $query->whereHas('student', function ($q) use ($classId) {
                $q->where('class_id', $classId);
            });
        }
        if ($subjectId) {
            $query->where('subject_id', $subjectId);
        }

        $results = $query->get();

        // Grade distribution
        $gradeDistribution = $results->groupBy('grade')->map(function ($gradeResults, $grade) {
            return [
                'grade' => $grade,
                'count' => $gradeResults->count(),
            ];
        })->values();

        // Statistics
        $statistics = [
            'total_students' => $results->count(),
            'average_marks' => $results->count() > 0 ? round($results->avg('marks'), 2) : 0,
            'highest_marks' => $results->max('marks'),
            'lowest_marks' => $results->min('marks'),
            'pass_count' => $results->where('marks', '>=', 50)->count(),
            'fail_count' => $results->where('marks', '<', 50)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $statistics,
                'grade_distribution' => $gradeDistribution,
                'results' => $results,
            ]
        ]);
    }

    // Teacher Performance Report
    public function teacherPerformance(Request $request, $teacherId)
    {
        $teacher = Teacher::with('user')->find($teacherId);
        
        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        // Get teacher's assigned subjects and classes
        $assignments = DB::table('teacher_subjects')
            ->join('subjects', 'teacher_subjects.subject_id', '=', 'subjects.id')
            ->join('class_rooms', 'teacher_subjects.class_id', '=', 'class_rooms.id')
            ->where('teacher_subjects.teacher_id', $teacherId)
            ->select('subjects.name as subject', 'class_rooms.name as class', 'class_rooms.section')
            ->get();

        // Get students taught by this teacher
        $classIds = DB::table('teacher_subjects')
            ->where('teacher_id', $teacherId)
            ->pluck('class_id');

        $totalStudents = Student::whereIn('class_id', $classIds)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'teacher' => $teacher,
                'assignments' => $assignments,
                'total_classes' => $assignments->count(),
                'total_students' => $totalStudents,
            ]
        ]);
    }

    // Dashboard Statistics (Admin)
    public function dashboardStats(Request $request)
    {
        $stats = [
            'total_students' => Student::count(),
            'total_teachers' => Teacher::count(),
            'total_classes' => ClassRoom::count(),
            'total_subjects' => Subject::count(),
            
            // Attendance today
            'attendance_today' => Attendance::whereDate('date', today())->count(),
            'present_today' => Attendance::whereDate('date', today())->where('status', 'present')->count(),
            
            // Recent results
            'recent_results' => Result::with(['student.user', 'subject'])
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
