<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ResultController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TeacherSubjectController;
use App\Http\Controllers\Api\ParentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::get('ping', function () {
    return response()->json(['message' => 'Backend is running!', 'timestamp' => now()]);
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    // Profile (All authenticated users)
    Route::post('profile/upload-picture', [ProfileController::class, 'uploadPicture']);
    Route::get('profile/picture', [ProfileController::class, 'getPicture']);
    Route::delete('profile/picture', [ProfileController::class, 'deletePicture']);
    Route::put('profile', [ProfileController::class, 'updateProfile']);

    // ADMIN
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class);
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('classes', ClassController::class);
        Route::apiResource('subjects', SubjectController::class);

        // User Approval Management
        Route::get('users/pending', [UserController::class, 'getPendingUsers']);
        Route::get('users/approved', [UserController::class, 'getApprovedUsers']);
        Route::post('users/{id}/approve', [UserController::class, 'approveUser']);
        Route::delete('users/{id}/reject', [UserController::class, 'rejectUser']);

        Route::get('assign-teacher', [TeacherSubjectController::class, 'index']);
        Route::post('assign-teacher', [TeacherSubjectController::class, 'store']);
        Route::delete('assign-teacher/{id}', [TeacherSubjectController::class, 'destroy']);

        Route::get('parents', [ParentController::class, 'index']);
        Route::post('parents', [ParentController::class, 'store']);
        Route::get('parents/{id}', [ParentController::class, 'show']);
        Route::put('parents/{id}', [ParentController::class, 'update']);
        Route::post('parents/assign-student', [ParentController::class, 'assignStudent']);
        Route::delete('parents/{id}', [ParentController::class, 'destroy']);

        // Timetables (Admin can manage all)
        // Specific routes must come before apiResource to avoid conflicts
        Route::get('timetables/class/{classId}', [TimetableController::class, 'getByClass']);
        Route::apiResource('timetables', TimetableController::class);

        // Exams (Admin can manage all)
        Route::apiResource('exams', ExamController::class);
        Route::get('exams/{examId}/schedules', [ExamController::class, 'getSchedules']);
        Route::post('exam-schedules', [ExamController::class, 'storeSchedule']);
        Route::put('exam-schedules/{id}', [ExamController::class, 'updateSchedule']);
        Route::delete('exam-schedules/{id}', [ExamController::class, 'destroySchedule']);

        // Assignments (Admin can view all)
        Route::get('assignments', [AssignmentController::class, 'index']);

        // Reports & Analytics (Admin only)
        Route::get('reports/dashboard-stats', [ReportController::class, 'dashboardStats']);
        Route::get('reports/student/{studentId}', [ReportController::class, 'studentPerformance']);
        Route::get('reports/class/{classId}', [ReportController::class, 'classPerformance']);
        Route::get('reports/attendance', [ReportController::class, 'attendanceReport']);
        Route::get('reports/results', [ReportController::class, 'resultsReport']);
        Route::get('reports/teacher/{teacherId}', [ReportController::class, 'teacherPerformance']);
    });

    // TEACHER
    Route::middleware('role:teacher')->group(function () {
        Route::get('my-classes', [TeacherController::class, 'myClasses']);

        Route::get('attendance', [AttendanceController::class, 'index']);
        Route::post('attendance', [AttendanceController::class, 'store']);
        Route::put('attendance/{id}', [AttendanceController::class, 'update']);

        Route::get('results', [ResultController::class, 'index']);
        Route::post('results', [ResultController::class, 'store']);
        Route::put('results/{id}', [ResultController::class, 'update']);

        // Teacher's timetable
        Route::get('teacher/my-timetable', [TimetableController::class, 'getMyTimetable']);

        // Teacher's exams
        Route::get('teacher/my-exam-schedules', [ExamController::class, 'getTeacherSchedules']);
        Route::get('exam-schedules/{scheduleId}/students', [ExamController::class, 'getScheduleStudents']);
        Route::post('exam-results', [ExamController::class, 'storeResult']);

        // Teacher's assignments
        Route::get('teacher/my-assignments', [AssignmentController::class, 'getTeacherAssignments']);
        Route::post('assignments', [AssignmentController::class, 'store']);
        Route::put('assignments/{id}', [AssignmentController::class, 'update']);
        Route::delete('assignments/{id}', [AssignmentController::class, 'destroy']);
        Route::get('assignments/{id}/submissions', [AssignmentController::class, 'getSubmissions']);
        Route::post('assignment-submissions/{id}/grade', [AssignmentController::class, 'gradeSubmission']);
    });

    // STUDENT
    Route::middleware('role:student')->group(function () {
        Route::get('my-attendance', [AttendanceController::class, 'studentAttendance']);
        Route::get('my-results', [ResultController::class, 'studentResults']);
        
        // Student's timetable
        Route::get('my-timetable', [TimetableController::class, 'getStudentTimetable']);

        // Student's exams
        Route::get('my-exam-schedules', [ExamController::class, 'getStudentSchedules']);
        Route::get('my-exam-results', [ExamController::class, 'getStudentResults']);

        // Student's assignments
        Route::get('my-assignments', [AssignmentController::class, 'getStudentAssignments']);
        Route::post('assignments/{id}/submit', [AssignmentController::class, 'submitAssignment']);
    });

    // PARENT
    Route::middleware('role:parent')->group(function () {
        Route::get('parent/children', [ParentController::class, 'myChildren']);
        Route::get('child-attendance', [AttendanceController::class, 'parentAttendance']);
        Route::get('child-results', [ResultController::class, 'parentResults']);
        
        // Parent can view child's timetable
        Route::get('timetables/class/{classId}', [TimetableController::class, 'getByClass']);

        // Parent can view child's exams
        Route::get('child-exam-schedules/{studentId}', [ExamController::class, 'getChildSchedules']);
        Route::get('child-exam-results/{studentId}', [ExamController::class, 'getChildResults']);

        // Parent can view child's assignments
        Route::get('child-assignments/{studentId}', [AssignmentController::class, 'getChildAssignments']);
    });

    // MESSAGING (Parent & Teacher only)
    Route::middleware('role:parent,teacher')->group(function () {
        Route::get('conversations', [MessageController::class, 'getConversations']);
        Route::get('conversations/{id}/messages', [MessageController::class, 'getMessages']);
        Route::post('conversations/{id}/messages', [MessageController::class, 'sendMessage']);
        Route::put('conversations/{id}/close', [MessageController::class, 'closeConversation']);
        Route::put('conversations/{id}/reopen', [MessageController::class, 'reopenConversation']);
    });

    // Parent-specific messaging routes
    Route::middleware('role:parent')->group(function () {
        Route::post('conversations', [MessageController::class, 'startConversation']);
        Route::get('available-teachers', [MessageController::class, 'getAvailableTeachers']);
    });

    // Teacher-specific messaging routes
    Route::middleware('role:teacher')->group(function () {
        Route::post('conversations', [MessageController::class, 'startConversation']);
        Route::get('available-parents', [MessageController::class, 'getAvailableParents']);
    });

    // Admin can view all conversations
    Route::middleware('role:admin')->group(function () {
        Route::get('admin/conversations', [MessageController::class, 'getConversations']);
    });
});
