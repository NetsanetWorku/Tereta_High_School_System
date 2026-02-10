# Parent-Teacher Communication (Messaging) Feature Guide

**Feature**: Parent-Teacher Communication System  
**Status**: ✅ FULLY IMPLEMENTED  
**Date**: February 9, 2026

---

## Overview

The messaging system enables direct communication between parents and teachers about student-related matters. It provides a structured way for parents to reach out to teachers and maintain conversation history.

---

## Features

### For Parents
- **Start Conversations**: Initiate new conversations with any teacher
- **Link to Children**: Optionally associate conversations with specific children
- **Real-time Messaging**: Send and receive messages instantly
- **Conversation List**: View all conversations with status and unread counts
- **Message History**: Access complete conversation history

### For Teachers
- **Receive Messages**: Get messages from parents
- **Reply to Parents**: Respond to parent inquiries
- **Close Conversations**: Mark conversations as resolved
- **Conversation Management**: View all conversations with unread indicators
- **Auto-refresh**: Messages update automatically every 5 seconds

### For Admins
- **Monitor All Conversations**: View all parent-teacher communications
- **Read-only Access**: Monitor without participating
- **Conversation Overview**: See all active and closed conversations

### For Students
- **View Related Conversations**: See conversations about them
- **Read-only Access**: Cannot send messages, only view

---

## Database Structure

### Conversations Table
```sql
- id: Primary key
- parent_id: Foreign key to parents table
- teacher_id: Foreign key to teachers table
- student_id: Optional foreign key to students table
- subject: Conversation topic
- status: 'open' or 'closed'
- created_at, updated_at: Timestamps
```

### Messages Table
```sql
- id: Primary key
- conversation_id: Foreign key to conversations table
- sender_id: Foreign key to users table
- message: Text content
- is_read: Boolean flag
- read_at: Timestamp when read
- created_at, updated_at: Timestamps
```

---

## API Endpoints

### Get Conversations
```
GET /api/conversations
```
Returns all conversations for the authenticated user (parent, teacher, or admin).

**Response**:
```json
[
  {
    "id": 1,
    "subject": "Question about homework",
    "status": "open",
    "parent": { "id": 1, "name": "John Doe" },
    "teacher": { "id": 1, "name": "Jane Smith" },
    "student": { "id": 1, "name": "Alice Doe" },
    "unread_count": 2,
    "created_at": "2026-02-09T10:00:00Z"
  }
]
```

### Get Messages
```
GET /api/conversations/{id}/messages
```
Returns all messages in a specific conversation.

**Response**:
```json
[
  {
    "id": 1,
    "conversation_id": 1,
    "sender_id": 5,
    "message": "Hello, I have a question about the homework.",
    "is_read": true,
    "created_at": "2026-02-09T10:00:00Z"
  }
]
```

### Start Conversation
```
POST /api/conversations
```
Creates a new conversation (parents only).

**Request Body**:
```json
{
  "teacher_id": 1,
  "student_id": 1,  // Optional
  "subject": "Question about homework"
}
```

### Send Message
```
POST /api/conversations/{id}/messages
```
Sends a message in a conversation.

**Request Body**:
```json
{
  "message": "Thank you for your help!"
}
```

### Close Conversation
```
POST /api/conversations/{id}/close
```
Marks a conversation as closed (teachers only).

### Get Available Teachers
```
GET /api/conversations/available-teachers
```
Returns list of teachers that parents can message.

---

## User Interface

### Parent Interface
**Location**: `/parent/messages`

**Features**:
1. **New Conversation Button**: Top-right corner
2. **Conversation List**: Left sidebar showing all conversations
3. **Message Area**: Right side showing selected conversation
4. **Message Input**: Bottom of message area (when conversation is open)

**Starting a Conversation**:
1. Click "New Conversation" button
2. Select a teacher from dropdown
3. Optionally select which child the conversation is about
4. Enter a subject/topic
5. Click "Start Conversation"
6. Begin messaging immediately

### Teacher Interface
**Location**: `/teacher/messages`

**Features**:
1. **Conversation List**: Left sidebar with unread counts
2. **Message Area**: Right side showing selected conversation
3. **Close Button**: Mark conversation as resolved
4. **Message Input**: Bottom of message area (when conversation is open)

**Responding to Messages**:
1. Select a conversation from the list
2. View message history
3. Type response in input field
4. Press Enter or click Send button
5. Optionally close conversation when resolved

### Admin Interface
**Location**: `/admin/messages`

**Features**:
1. **All Conversations**: View all parent-teacher conversations
2. **Read-only Mode**: Cannot send messages
3. **Participant Info**: See both parent and teacher names
4. **Message History**: View complete conversation threads

### Student Interface
**Location**: `/student/messages`

**Features**:
1. **Related Conversations**: View conversations about them
2. **Read-only Mode**: Cannot send messages
3. **Message History**: View what parents and teachers discuss

---

## How to Use

### As a Parent

1. **Login** to your parent account
2. **Navigate** to "Messages" in the sidebar
3. **Click** "New Conversation" button
4. **Select** a teacher you want to contact
5. **Choose** which child (optional)
6. **Enter** a subject line
7. **Start** the conversation
8. **Type** your message and send
9. **Wait** for teacher's response (auto-refreshes every 5 seconds)

### As a Teacher

1. **Login** to your teacher account
2. **Navigate** to "Messages" in the sidebar
3. **Select** a conversation from the list
4. **Read** the parent's message
5. **Type** your response
6. **Send** the message
7. **Close** the conversation when resolved (optional)

### As an Admin

1. **Login** to your admin account
2. **Navigate** to "Messages Monitor" in the sidebar
3. **View** all conversations
4. **Select** a conversation to read
5. **Monitor** communication quality

### As a Student

1. **Login** to your student account
2. **Navigate** to "Messages" in the sidebar
3. **View** conversations about you
4. **Read** what your parents and teachers discuss

---

## Features in Detail

### Conversation Status
- **Open**: Active conversation, messages can be sent
- **Closed**: Resolved conversation, no new messages allowed

### Unread Message Counts
- Shows number of unread messages per conversation
- Displayed as blue badge on conversation list
- Updates automatically when messages are read

### Auto-refresh
- Messages refresh every 5 seconds
- No need to manually reload
- Ensures real-time communication

### Message Timestamps
- Recent messages show time (e.g., "10:30 AM")
- Older messages show date (e.g., "Feb 9")
- Helps track conversation timeline

### Conversation Linking
- Parents can link conversations to specific children
- Helps teachers understand context
- Students can see conversations about them

---

## Testing the Feature

### Test Scenario 1: Parent Starts Conversation

1. Login as parent
2. Go to Messages
3. Click "New Conversation"
4. Select a teacher
5. Enter subject: "Question about homework"
6. Send first message
7. Verify conversation appears in list

### Test Scenario 2: Teacher Responds

1. Login as teacher
2. Go to Messages
3. See new conversation with unread badge
4. Click on conversation
5. Read parent's message
6. Type and send response
7. Verify message appears

### Test Scenario 3: Admin Monitors

1. Login as admin
2. Go to Messages Monitor
3. See all conversations
4. Click on a conversation
5. View complete message history
6. Verify read-only mode (no input field)

### Test Scenario 4: Student Views

1. Login as student
2. Go to Messages
3. See conversations about them
4. Click on a conversation
5. View messages
6. Verify read-only mode

---

## Troubleshooting

### Issue: Conversations not loading
**Solution**: Check if migrations ran successfully. Run `php artisan migrate` in backend.

### Issue: Cannot send messages
**Solution**: Verify conversation status is "open". Closed conversations don't allow new messages.

### Issue: Messages not refreshing
**Solution**: Check browser console for errors. Ensure API endpoints are accessible.

### Issue: Teachers list empty
**Solution**: Ensure teachers exist in database and have proper user accounts.

### Issue: Unread counts not updating
**Solution**: Backend automatically marks messages as read when fetched. Check API response.

---

## Future Enhancements

Potential improvements for future versions:

1. **Push Notifications**: Real-time alerts for new messages
2. **File Attachments**: Share documents and images
3. **Message Search**: Find specific messages in history
4. **Message Reactions**: Like or acknowledge messages
5. **Typing Indicators**: Show when other person is typing
6. **Message Editing**: Edit sent messages
7. **Message Deletion**: Remove messages
8. **Conversation Archiving**: Archive old conversations
9. **Email Notifications**: Send email when new message arrives
10. **SMS Notifications**: Send SMS for urgent messages

---

## Technical Notes

### Frontend
- Built with React and Next.js
- Uses custom hooks (useApi, useAuth)
- Auto-refresh with setInterval
- Modal for new conversation form
- Responsive design for mobile

### Backend
- Laravel API with authentication
- Eloquent relationships for data
- Role-based access control
- Automatic message read tracking
- Foreign key constraints for data integrity

### Security
- Authentication required for all endpoints
- Role-based authorization
- Users can only access their own conversations
- Admins have read-only monitoring access
- SQL injection prevention with Eloquent ORM

---

## Files Modified/Created

### Backend
- `database/migrations/2026_02_09_110000_create_conversations_table.php`
- `database/migrations/2026_02_09_110001_create_messages_table.php`
- `app/Models/Conversation.php`
- `app/Models/Message.php`
- `app/Http/Controllers/Api/MessageController.php`
- `routes/api.php` (added message routes)

### Frontend
- `src/app/teacher/messages/page.jsx`
- `src/app/parent/messages/page.jsx`
- `src/app/admin/messages/page.jsx`
- `src/app/student/messages/page.jsx`
- `src/components/layout/Sidebar.jsx` (added Messages links)

### Documentation
- `MESSAGING_FEATURE_GUIDE.md` (this file)
- `MODULES_STATUS.md` (updated)

---

## Support

For issues or questions:
1. Check this guide first
2. Review API endpoint responses
3. Check browser console for errors
4. Verify database migrations
5. Test with different user roles

---

**Last Updated**: February 9, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
