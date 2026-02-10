<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use App\Models\ClassRoom;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TimetableController extends Controller
{
    // Get all timetables (Admin)
    public function index()
    {
        $timetables = Timetable::with(['classRoom', 'subject', 'teacher.user'])
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $timetables
        ]);
    }

    // Get timetable for a specific class
    public function getByClass($classId)
    {
        $timetables = Timetable::with(['subject', 'teacher.user'])
            ->where('class_id', $classId)
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        // Group by day
        $grouped = $timetables->groupBy('day');

        return response()->json([
            'success' => true,
            'data' => $grouped
        ]);
    }

    // Get timetable for logged-in teacher
    public function getMyTimetable(Request $request)
    {
        $user = $request->user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher profile not found'
            ], 404);
        }

        $timetables = Timetable::with(['classRoom', 'subject'])
            ->where('teacher_id', $teacher->id)
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        // Group by day
        $grouped = $timetables->groupBy('day');

        return response()->json([
            'success' => true,
            'data' => $grouped
        ]);
    }

    // Get timetable for logged-in student
    public function getStudentTimetable(Request $request)
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student || !$student->class_id) {
            return response()->json([
                'success' => false,
                'message' => 'Student not assigned to any class'
            ], 404);
        }

        $timetables = Timetable::with(['subject', 'teacher.user'])
            ->where('class_id', $student->class_id)
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        // Group by day
        $grouped = $timetables->groupBy('day');

        return response()->json([
            'success' => true,
            'data' => $grouped,
            'class' => $student->class
        ]);
    }

    // Create new timetable entry (Admin)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'class_id' => 'required|exists:class_rooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room_number' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for overlapping schedules
        $overlap = Timetable::where('class_id', $request->class_id)
            ->where('day', $request->day)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                    ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '<=', $request->start_time)
                          ->where('end_time', '>=', $request->end_time);
                    });
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'success' => false,
                'message' => 'Time slot overlaps with existing schedule'
            ], 422);
        }

        $timetable = Timetable::create($request->all());
        $timetable->load(['classRoom', 'subject', 'teacher.user']);

        return response()->json([
            'success' => true,
            'message' => 'Timetable entry created successfully',
            'data' => $timetable
        ], 201);
    }

    // Update timetable entry (Admin)
    public function update(Request $request, $id)
    {
        $timetable = Timetable::find($id);

        if (!$timetable) {
            return response()->json([
                'success' => false,
                'message' => 'Timetable entry not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'class_id' => 'sometimes|required|exists:class_rooms,id',
            'subject_id' => 'sometimes|required|exists:subjects,id',
            'teacher_id' => 'sometimes|required|exists:teachers,id',
            'day' => 'sometimes|required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            'room_number' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for overlapping schedules (excluding current entry)
        $classId = $request->class_id ?? $timetable->class_id;
        $day = $request->day ?? $timetable->day;
        $startTime = $request->start_time ?? $timetable->start_time;
        $endTime = $request->end_time ?? $timetable->end_time;

        $overlap = Timetable::where('class_id', $classId)
            ->where('day', $day)
            ->where('id', '!=', $id)
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $startTime)
                          ->where('end_time', '>=', $endTime);
                    });
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'success' => false,
                'message' => 'Time slot overlaps with existing schedule'
            ], 422);
        }

        $timetable->update($request->all());
        $timetable->load(['classRoom', 'subject', 'teacher.user']);

        return response()->json([
            'success' => true,
            'message' => 'Timetable entry updated successfully',
            'data' => $timetable
        ]);
    }

    // Delete timetable entry (Admin)
    public function destroy($id)
    {
        $timetable = Timetable::find($id);

        if (!$timetable) {
            return response()->json([
                'success' => false,
                'message' => 'Timetable entry not found'
            ], 404);
        }

        $timetable->delete();

        return response()->json([
            'success' => true,
            'message' => 'Timetable entry deleted successfully'
        ]);
    }
}
