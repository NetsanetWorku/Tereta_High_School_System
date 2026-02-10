<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AssignmentController extends Controller
{
    // Get all assignments (Admin)
    public function index()
    {
        $assignments = Assignment::with(['subject', 'class', 'teacher.user'])
            ->orderBy('due_date', 'desc')
            ->get();

        return response()->json(['data' => $assignments]);
    }

    // Get teacher's assignments
    public function getTeacherAssignments(Request $request)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        $assignments = Assignment::with(['subject', 'class', 'submissions'])
            ->where('teacher_id', $teacher->id)
            ->orderBy('due_date', 'desc')
            ->get();

        // Add submission counts
        $assignments->each(function ($assignment) {
            $assignment->total_students = Student::where('class_id', $assignment->class_id)->count();
            $assignment->submitted_count = $assignment->submissions()->where('status', '!=', 'pending')->count();
            $assignment->graded_count = $assignment->submissions()->where('status', 'graded')->count();
        });

        return response()->json(['data' => $assignments]);
    }

    // Create assignment (Teacher)
    public function store(Request $request)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:class_rooms,id',
            'due_date' => 'required|date',
            'total_marks' => 'required|integer|min:1',
            'attachment_url' => 'nullable|string',
        ]);

        $validated['teacher_id'] = $teacher->id;

        $assignment = Assignment::create($validated);
        $assignment->load(['subject', 'class']);

        // Create pending submissions for all students in the class
        $students = Student::where('class_id', $validated['class_id'])->get();
        foreach ($students as $student) {
            AssignmentSubmission::create([
                'assignment_id' => $assignment->id,
                'student_id' => $student->id,
                'status' => 'pending',
            ]);
        }

        return response()->json([
            'message' => 'Assignment created successfully',
            'data' => $assignment
        ], 201);
    }

    // Update assignment (Teacher)
    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'due_date' => 'date',
            'total_marks' => 'integer|min:1',
            'attachment_url' => 'nullable|string',
        ]);

        $assignment->update($validated);
        $assignment->load(['subject', 'class']);

        return response()->json([
            'message' => 'Assignment updated successfully',
            'data' => $assignment
        ]);
    }

    // Delete assignment (Teacher)
    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted successfully']);
    }

    // Get assignment submissions (Teacher)
    public function getSubmissions($assignmentId)
    {
        $assignment = Assignment::with(['subject', 'class'])->findOrFail($assignmentId);
        
        $submissions = AssignmentSubmission::with(['student.user'])
            ->where('assignment_id', $assignmentId)
            ->get();

        return response()->json([
            'assignment' => $assignment,
            'submissions' => $submissions
        ]);
    }

    // Grade submission (Teacher)
    public function gradeSubmission(Request $request, $submissionId)
    {
        $submission = AssignmentSubmission::findOrFail($submissionId);

        $validated = $request->validate([
            'marks_obtained' => 'required|integer|min:0',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'marks_obtained' => $validated['marks_obtained'],
            'feedback' => $validated['feedback'] ?? null,
            'graded_at' => now(),
            'status' => 'graded',
        ]);

        return response()->json([
            'message' => 'Submission graded successfully',
            'data' => $submission
        ]);
    }

    // Get student's assignments
    public function getStudentAssignments(Request $request)
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $assignments = Assignment::with(['subject', 'class', 'teacher.user'])
            ->where('class_id', $student->class_id)
            ->orderBy('due_date', 'desc')
            ->get();

        // Get student's submissions
        $submissions = AssignmentSubmission::where('student_id', $student->id)
            ->get()
            ->keyBy('assignment_id');

        // Merge assignments with submissions
        $assignments->each(function ($assignment) use ($submissions) {
            $submission = $submissions->get($assignment->id);
            $assignment->submission = $submission;
            $assignment->is_overdue = $assignment->due_date < now() && (!$submission || $submission->status === 'pending');
        });

        return response()->json(['data' => $assignments]);
    }

    // Submit assignment (Student)
    public function submitAssignment(Request $request, $assignmentId)
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $assignment = Assignment::findOrFail($assignmentId);

        $validated = $request->validate([
            'submission_text' => 'nullable|string',
            'attachment_url' => 'nullable|string',
        ]);

        // Check if assignment is overdue
        $isLate = $assignment->due_date < now();

        $submission = AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignmentId,
                'student_id' => $student->id,
            ],
            [
                'submission_text' => $validated['submission_text'] ?? null,
                'attachment_url' => $validated['attachment_url'] ?? null,
                'submitted_at' => now(),
                'status' => $isLate ? 'late' : 'submitted',
            ]
        );

        return response()->json([
            'message' => 'Assignment submitted successfully',
            'data' => $submission
        ]);
    }

    // Get child's assignments (Parent)
    public function getChildAssignments(Request $request, $studentId)
    {
        $student = Student::findOrFail($studentId);

        $assignments = Assignment::with(['subject', 'class', 'teacher.user'])
            ->where('class_id', $student->class_id)
            ->orderBy('due_date', 'desc')
            ->get();

        // Get student's submissions
        $submissions = AssignmentSubmission::where('student_id', $studentId)
            ->get()
            ->keyBy('assignment_id');

        // Merge assignments with submissions
        $assignments->each(function ($assignment) use ($submissions) {
            $submission = $submissions->get($assignment->id);
            $assignment->submission = $submission;
            $assignment->is_overdue = $assignment->due_date < now() && (!$submission || $submission->status === 'pending');
        });

        return response()->json(['data' => $assignments]);
    }
}
