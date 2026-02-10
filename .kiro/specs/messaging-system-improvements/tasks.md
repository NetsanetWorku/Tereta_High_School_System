# Messaging System Improvements - Tasks

## 1. Backend API Fixes

### 1.1 Fix closeConversation Response
- [ ] Update `MessageController::closeConversation()` to return proper response with conversation data
- [ ] Ensure response includes `success`, `message`, and `data` fields
- [ ] Load relationships (parent.user, teacher.user, student) in response

### 1.2 Add getAvailableParents Endpoint
- [ ] Create `MessageController::getAvailableParents()` method
- [ ] Restrict access to teachers only
- [ ] Return list of parents with user relationships
- [ ] Add route in `routes/api.php`: `GET /available-parents`

## 2. Frontend - Teacher Messages Page

### 2.1 Add New Conversation Feature
- [ ] Add "New Conversation" button to page header
- [ ] Create state for `showNewConversation` modal
- [ ] Create state for `parents` list
- [ ] Create state for `students` list (teacher's students)
- [ ] Create `fetchParents()` function to call `/available-parents`
- [ ] Create `fetchStudents()` function to call `/teacher/students`

### 2.2 Create New Conversation Modal
- [ ] Create modal component with form
- [ ] Add "Select Parent" dropdown
- [ ] Add "About Student" dropdown (optional)
- [ ] Add "Subject" text input
- [ ] Add "Message" textarea
- [ ] Add form validation
- [ ] Add "Start Conversation" and "Cancel" buttons
- [ ] Implement `handleStartConversation()` function
- [ ] Close modal and refresh conversations on success

### 2.3 Improve Conversation List Display
- [ ] Update conversation list item layout
- [ ] Make student name more prominent (larger font, better color)
- [ ] Move subject to smaller, secondary text
- [ ] Ensure "Re: Student Name" or "General" is clearly visible

### 2.4 Fix Close Conversation
- [ ] Verify `handleCloseConversation()` uses PUT method correctly
- [ ] Add proper error handling for close conversation
- [ ] Ensure conversation list refreshes after closing
- [ ] Update selected conversation state if closed conversation was selected

## 3. Frontend - Parent Messages Page

### 3.1 Improve Conversation List Display
- [ ] Update conversation list item layout (same as teacher page)
- [ ] Make student name more prominent
- [ ] Move subject to smaller, secondary text
- [ ] Ensure "Re: Student Name" or "General" is clearly visible

### 3.2 Fix Close Conversation
- [ ] Verify `handleCloseConversation()` uses PUT method correctly
- [ ] Add proper error handling for close conversation
- [ ] Ensure conversation list refreshes after closing
- [ ] Update selected conversation state if closed conversation was selected

## 4. Testing & Verification

### 4.1 Backend Testing
- [ ] Test close conversation returns proper response
- [ ] Test teacher can fetch available parents
- [ ] Test multiple conversations with same teacher/parent but different students
- [ ] Test conversation uniqueness logic

### 4.2 Frontend Testing
- [ ] Test teacher can start new conversation
- [ ] Test parent can start new conversation
- [ ] Test conversation list displays correctly with multiple conversations
- [ ] Test close conversation works without errors
- [ ] Test "New Conversation" button is always visible
- [ ] Test student names are prominently displayed

### 4.3 Integration Testing
- [ ] Test full flow: teacher starts conversation → parent responds → teacher closes
- [ ] Test full flow: parent starts conversation → teacher responds → parent closes
- [ ] Test multiple conversations between same participants about different students
- [ ] Test UI updates correctly when conversations are closed

## 5. Documentation

### 5.1 Update Documentation
- [ ] Update MESSAGING_FEATURE_GUIDE.md with new conversation flow
- [ ] Document the "New Conversation" feature for teachers
- [ ] Document how multiple conversations work
- [ ] Add screenshots of improved UI (if applicable)
