<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Teacher;
use App\Models\ParentModel;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    // Get all conversations for logged-in user
    public function getConversations(Request $request)
    {
        $user = $request->user();
        $conversations = collect();

        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if (!$teacher) {
                return response()->json(['success' => false, 'message' => 'Teacher profile not found'], 404);
            }

            $conversations = Conversation::with(['parent.user', 'student', 'latestMessage.sender'])
                ->where('teacher_id', $teacher->id)
                ->orderBy('updated_at', 'desc')
                ->get();

            // Add unread count
            $conversations->each(function ($conversation) use ($user) {
                $conversation->unread_count = $conversation->unreadCount($user->id);
            });

        } elseif ($user->role === 'parent') {
            $parent = ParentModel::where('user_id', $user->id)->first();
            if (!$parent) {
                return response()->json(['success' => false, 'message' => 'Parent profile not found'], 404);
            }

            $conversations = Conversation::with(['teacher.user', 'student', 'latestMessage.sender'])
                ->where('parent_id', $parent->id)
                ->orderBy('updated_at', 'desc')
                ->get();

            // Add unread count
            $conversations->each(function ($conversation) use ($user) {
                $conversation->unread_count = $conversation->unreadCount($user->id);
            });

        } elseif ($user->role === 'student') {
            $student = \App\Models\Student::where('user_id', $user->id)->first();
            if (!$student) {
                return response()->json(['success' => false, 'message' => 'Student profile not found'], 404);
            }

            // Students can see conversations about them
            $conversations = Conversation::with(['parent.user', 'teacher.user', 'student', 'latestMessage.sender'])
                ->where('student_id', $student->id)
                ->orderBy('updated_at', 'desc')
                ->get();

        } elseif ($user->role === 'admin') {
            // Admin can see all conversations
            $conversations = Conversation::with(['parent.user', 'teacher.user', 'student', 'latestMessage.sender'])
                ->orderBy('updated_at', 'desc')
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }

    // Get messages in a conversation
    public function getMessages(Request $request, $conversationId)
    {
        $user = $request->user();
        $conversation = Conversation::with(['parent.user', 'teacher.user', 'student'])
            ->find($conversationId);

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        // Check access
        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if ($conversation->teacher_id !== $teacher->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'parent') {
            $parent = ParentModel::where('user_id', $user->id)->first();
            if ($conversation->parent_id !== $parent->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            if ($conversation->student_id !== $student->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        }

        $messages = Message::with('sender')
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages as read
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'conversation' => $conversation,
            'data' => $messages
        ]);
    }

    // Start a new conversation (Parent or Teacher)
    public function startConversation(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['parent', 'teacher'])) {
            return response()->json(['success' => false, 'message' => 'Only parents and teachers can start conversations'], 403);
        }

        // Different validation based on user role
        if ($user->role === 'parent') {
            $validator = Validator::make($request->all(), [
                'teacher_id' => 'required|exists:teachers,id',
                'student_id' => 'nullable|exists:students,id',
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
            ]);
        } else {
            // Teacher
            $validator = Validator::make($request->all(), [
                'parent_id' => 'required|exists:parents,id',
                'student_id' => 'nullable|exists:students,id',
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
            ]);
        }

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($user->role === 'parent') {
            $parent = ParentModel::where('user_id', $user->id)->first();
            if (!$parent) {
                return response()->json(['success' => false, 'message' => 'Parent profile not found'], 404);
            }

            $teacherId = $request->teacher_id;
            $parentId = $parent->id;
        } else {
            // Teacher
            $teacher = Teacher::where('user_id', $user->id)->first();
            if (!$teacher) {
                return response()->json(['success' => false, 'message' => 'Teacher profile not found'], 404);
            }

            $teacherId = $teacher->id;
            $parentId = $request->parent_id;
        }

        // Check if conversation already exists
        $existingConversation = Conversation::where('parent_id', $parentId)
            ->where('teacher_id', $teacherId)
            ->where('student_id', $request->student_id)
            ->where('status', 'open')
            ->first();

        if ($existingConversation) {
            // Add message to existing conversation
            $message = Message::create([
                'conversation_id' => $existingConversation->id,
                'sender_id' => $user->id,
                'message' => $request->message,
            ]);

            $existingConversation->touch(); // Update updated_at

            return response()->json([
                'success' => true,
                'message' => 'Message sent to existing conversation',
                'conversation' => $existingConversation->load(['parent.user', 'teacher.user', 'student']),
                'new_message' => $message->load('sender')
            ], 200);
        }

        // Create new conversation
        $conversation = Conversation::create([
            'parent_id' => $parentId,
            'teacher_id' => $teacherId,
            'student_id' => $request->student_id,
            'subject' => $request->subject,
            'status' => 'open',
        ]);

        // Create first message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'message' => $request->message,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Conversation started successfully',
            'conversation' => $conversation->load(['parent.user', 'teacher.user', 'student']),
            'new_message' => $message->load('sender')
        ], 201);
    }

    // Send a message in existing conversation
    public function sendMessage(Request $request, $conversationId)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $conversation = Conversation::find($conversationId);
        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        // Check access
        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if ($conversation->teacher_id !== $teacher->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'parent') {
            $parent = ParentModel::where('user_id', $user->id)->first();
            if ($conversation->parent_id !== $parent->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        } else {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $user->id,
            'message' => $request->message,
        ]);

        $conversation->touch(); // Update updated_at

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message->load('sender')
        ], 201);
    }

    // Close a conversation
    public function closeConversation(Request $request, $conversationId)
    {
        $user = $request->user();
        $conversation = Conversation::find($conversationId);

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        // Check access
        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if ($conversation->teacher_id !== $teacher->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'parent') {
            $parent = ParentModel::where('user_id', $user->id)->first();
            if ($conversation->parent_id !== $parent->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        } else {
            // Only teachers and parents can close conversations
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $conversation->update(['status' => 'closed']);

        return response()->json([
            'success' => true,
            'message' => 'Conversation closed successfully',
            'data' => $conversation->fresh()->load(['parent.user', 'teacher.user', 'student'])
        ]);
    }

    // Reopen a conversation
    public function reopenConversation(Request $request, $conversationId)
    {
        $user = $request->user();
        $conversation = Conversation::find($conversationId);

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        // Check access
        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if ($conversation->teacher_id !== $teacher->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'parent') {
            $parent = ParentModel::where('user_id', $user->id)->first();
            if ($conversation->parent_id !== $parent->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
        } else {
            // Only teachers and parents can reopen conversations
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $conversation->update(['status' => 'open']);

        return response()->json([
            'success' => true,
            'message' => 'Conversation reopened successfully',
            'data' => $conversation->fresh()->load(['parent.user', 'teacher.user', 'student'])
        ]);
    }

    // Get available teachers for parent to message
    public function getAvailableTeachers(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'parent') {
            return response()->json(['success' => false, 'message' => 'Only parents can access this'], 403);
        }

        $teachers = Teacher::with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $teachers
        ]);
    }

    // Get available parents for teacher to message
    public function getAvailableParents(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'teacher') {
            return response()->json(['success' => false, 'message' => 'Only teachers can access this'], 403);
        }

        $parents = ParentModel::with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $parents
        ]);
    }
}
