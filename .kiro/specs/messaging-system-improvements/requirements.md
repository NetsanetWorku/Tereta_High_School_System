# Messaging System Improvements - Requirements

## 1. Overview
Improve the messaging system to properly handle multiple conversations between the same teacher and parent about different students, fix the close conversation functionality, and ensure both teachers and parents can initiate new conversations when needed.

## 2. User Stories

### 2.1 As a Teacher
- I want to see all my conversations with different parents clearly distinguished by student name
- I want to be able to start a new conversation with a parent when all existing conversations are closed
- I want to successfully close conversations without errors
- I want to see which student each conversation is about at a glance

### 2.2 As a Parent
- I want to have separate conversations for each of my children with the same teacher
- I want to clearly see which child each conversation is about
- I want to successfully close conversations without errors
- I want to start new conversations even when previous ones are closed

### 2.3 As an Admin
- I want to see all conversations with clear identification of parent, teacher, and student
- I want the conversation list to show "Parent Name ↔ Teacher Name (Re: Student Name)" format

## 3. Acceptance Criteria

### 3.1 Conversation Display
- Each conversation in the list must clearly show the student name prominently
- Conversations with the same teacher/parent but different students must be visually distinct
- The conversation list item should show: Other Participant Name, Subject, and Student Name (if applicable)
- Admin view should show both parent and teacher names with student context

### 3.2 Close Conversation Functionality
- Clicking "Close" button must successfully close the conversation without console errors
- The backend must return a proper success response
- The conversation status must update to "closed" in the UI
- Closed conversations should remain visible in the list with "closed" status badge

### 3.3 New Conversation Initiation
- Teachers must have a "New Conversation" button visible when viewing the messages page
- Parents must have a "New Conversation" button visible when viewing the messages page
- The "New Conversation" button should be available even when all conversations are closed
- Teachers should be able to select a parent and optionally a student when starting a conversation
- Parents should be able to select a teacher and optionally a child when starting a conversation

### 3.4 Multiple Conversations Support
- A teacher can have multiple open conversations with the same parent about different students
- A parent can have multiple open conversations with the same teacher about different children
- Each conversation is uniquely identified by the combination of teacher_id, parent_id, and student_id
- Starting a new conversation with the same teacher/parent but different student creates a separate conversation

## 4. Technical Requirements

### 4.1 Backend
- The `closeConversation` endpoint must return a proper JSON response with success status
- The `startConversation` logic must allow multiple conversations between same teacher/parent with different students
- The conversation uniqueness check should consider teacher_id, parent_id, AND student_id together

### 4.2 Frontend
- Teacher messages page must include a "New Conversation" button and modal
- The conversation list must display student name prominently (not just in small text)
- The close conversation functionality must properly handle the PUT request and response
- Error handling must provide clear feedback to users

## 5. Out of Scope
- Real-time notifications for new messages
- Message attachments or file uploads
- Message search functionality
- Conversation archiving (separate from closing)
