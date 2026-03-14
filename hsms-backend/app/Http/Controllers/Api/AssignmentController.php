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
            return response()->json([
                'success' => false,
                'message' => 'Teacher not found'
            ], 404);
        }

        $assignments = Assignment::with(['subject', 'class', 'submissions'])
            ->where('teacher_id', $teacher->id)
            ->orderBy('due_date', 'desc')
            ->get();

        // Add submission counts and rename class to class_room for consistency
        $assignments->each(function ($assignment) {
            $assignment->class_room = $assignment->class;
            $assignment->total_students = Student::where('class_id', $assignment->class_id)->count();
            $assignment->submissions_count = $assignment->submissions()->whereNotNull('submitted_at')->count();
            $assignment->pending_submissions = $assignment->submissions()->whereNull('graded_at')->whereNotNull('submitted_at')->count();
        });

        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    // Create assignment (Teacher)
    public function store(Request $request)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher not found'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:class_rooms,id',
            'due_date' => 'required|date',
            'max_marks' => 'nullable|integer|min:1',
            'total_marks' => 'nullable|integer|min:1',
            'instructions' => 'nullable|string',
            'attachment_url' => 'nullable|string',
        ]);

        // VALIDATION: Check if teacher is assigned to teach this subject to this class
        $isAssigned = DB::table('teacher_subjects')
            ->where('teacher_id', $teacher->id)
            ->where('subject_id', $validated['subject_id'])
            ->where('class_id', $validated['class_id'])
            ->exists();

        if (!$isAssigned) {
            return response()->json([
                'success' => false,
                'message' => 'You are not assigned to teach this subject to this class'
            ], 403);
        }

        // Use max_marks if provided, otherwise use total_marks, default to 100
        $totalMarks = $validated['max_marks'] ?? $validated['total_marks'] ?? 100;

        $assignment = Assignment::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'subject_id' => $validated['subject_id'],
            'class_id' => $validated['class_id'],
            'teacher_id' => $teacher->id,
            'due_date' => $validated['due_date'],
            'total_marks' => $totalMarks,
            'attachment_url' => $validated['attachment_url'] ?? null,
        ]);

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
            'success' => true,
            'message' => 'Assignment created successfully',
            'data' => $assignment
        ], 201);
    }

    // Update assignment (Teacher)
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $assignment = Assignment::findOrFail($id);

        // Ownership check: only the teacher who created it can update
        if ($assignment->teacher_id !== $teacher->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

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
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $assignment = Assignment::findOrFail($id);

        // Ownership check
        if ($assignment->teacher_id !== $teacher->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted successfully']);
    }

    // Get assignment submissions (Teacher)
    public function getSubmissions(Request $request, $assignmentId)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $assignment = Assignment::with(['subject', 'class'])->findOrFail($assignmentId);

        // Ownership check
        if ($assignment->teacher_id !== $teacher->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

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
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['success' => false, 'message' => 'Teacher not found'], 404);
        }

        $submission = AssignmentSubmission::with('assignment')->findOrFail($submissionId);

        // Ownership check: only the assignment's teacher can grade
        if ($submission->assignment->teacher_id !== $teacher->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'marks_obtained' => 'required|integer|min:0',
            'feedback' => 'nullable|string',
        ]);

        // Ensure marks don't exceed total_marks
        if ($validated['marks_obtained'] > $submission->assignment->total_marks) {
            return response()->json([
                'success' => false,
                'message' => 'Marks cannot exceed total marks (' . $submission->assignment->total_marks . ')'
            ], 422);
        }

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

        // Get student's submissions with assignment relationship for grade calculation
        $submissions = AssignmentSubmission::with('assignment')
            ->where('student_id', $student->id)
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
        // Verify the requesting parent actually owns this student
        $parent = \App\Models\ParentModel::where('user_id', $request->user()->id)
            ->with('students')
            ->first();

        if (!$parent) {
            return response()->json(['success' => false, 'message' => 'Parent profile not found'], 404);
        }

        $ownsStudent = $parent->students->contains('id', $studentId);
        if (!$ownsStudent) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $student = Student::findOrFail($studentId);

        $assignments = Assignment::with(['subject', 'class', 'teacher.user'])
            ->where('class_id', $student->class_id)
            ->orderBy('due_date', 'desc')
            ->get();

        // Get student's submissions with assignment relationship for grade calculation
        $submissions = AssignmentSubmission::with('assignment')
            ->where('student_id', $studentId)
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
