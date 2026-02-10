# Implementation Plan: Student Registration Separation

## Overview

This implementation plan converts the student registration process from a single form to two distinct flows: one for new students (with Grade 8 information) and one for local students (without Grade 8 information). The plan also removes security questions from all registration flows.

The implementation follows a three-step approach:
1. Backend changes (database, models, validation)
2. Frontend changes (UI components, state management, forms)
3. Integration and testing

## Tasks

- [x] 1. Update database schema for Grade 8 information
  - Create migration to add `gender`, `previous_school`, `grade_8_result`, and `grade_8_evaluation` columns to students table
  - Run migration to update database structure
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 2. Update Student model and backend validation
  - [x] 2.1 Update Student model fillable fields
    - Add new fields to fillable array: `gender`, `previous_school`, `grade_8_result`, `grade_8_evaluation`
    - _Requirements: 8.4, 8.5_
  
  - [x] 2.2 Modify AuthController registration logic
    - Add conditional validation based on `registration_type` field
    - For `registration_type === 'new'`: require Grade 8 fields and set grade to 9
    - For `registration_type === 'local'`: allow grade selection (9-12), make Grade 8 fields optional
    - Remove security question validation
    - _Requirements: 1.3, 1.5, 2.6, 2.7, 2.8, 3.6, 3.7, 3.8, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 2.3 Write unit tests for registration validation
    - Test new student registration with valid Grade 8 data
    - Test new student registration with missing Grade 8 data (should fail)
    - Test local student registration without Grade 8 data
    - Test local student registration with invalid grade (should fail)
    - _Requirements: 2.6, 3.6, 6.1, 6.2_

- [ ] 3. Checkpoint - Ensure backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Remove security questions from frontend
  - [x] 4.1 Remove security question fields from registration form
    - Delete security question input fields and state variables
    - Remove security question validation logic
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [ ]* 4.2 Test registration without security questions
    - Verify all role types (student, teacher, parent) can register without security questions
    - _Requirements: 1.1, 1.2_

- [x] 5. Implement registration type selection screen (Step 2)
  - [x] 5.1 Create Registration Type Selection UI component
    - Add state variable `registrationType` to track user selection
    - Create two option cards: "New Student" and "Local Student"
    - Add descriptions and icons for each option
    - Add back button to return to role selection
    - Implement `handleRegistrationTypeSelect(type)` method
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ]* 5.2 Write unit tests for type selection
    - Test that selecting "New Student" sets registrationType to 'new'
    - Test that selecting "Local Student" sets registrationType to 'local'
    - Test back button returns to role selection
    - _Requirements: 4.3, 4.4, 4.6_

- [x] 6. Implement New Student Registration Form (Step 3)
  - [x] 6.1 Create New Student form component
    - Add form fields: name, email, password, password_confirmation, gender
    - Add Grade 8 fields: previous_school, grade_8_result, grade_8_evaluation
    - Set grade to 9 (auto-set, read-only or hidden)
    - Add optional fields: phone, student_id, class_id
    - Add form title "New Student Registration"
    - **CRITICAL: Do NOT add radio buttons or question about new/local**
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2_
  
  - [x] 6.2 Implement form validation for New Student
    - Validate all required fields are filled
    - Validate email format and uniqueness
    - Validate password length (minimum 6 characters)
    - Validate password confirmation matches
    - Validate Grade 8 fields are not empty
    - _Requirements: 2.6, 5.3, 5.4, 5.5_
  
  - [ ]* 6.3 Write unit tests for New Student form
    - Test form renders with correct fields
    - Test form validation catches missing required fields
    - Test form validation catches invalid email
    - Test form validation catches password mismatch
    - Test form does NOT show new/local selection
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 7. Implement Local Student Registration Form (Step 3)
  - [x] 7.1 Create Local Student form component
    - Add form fields: name, email, password, password_confirmation, gender, grade
    - Add grade dropdown with options: 9, 10, 11, 12
    - Add optional fields: phone, student_id, class_id
    - Add form title "Local Student Registration"
    - **CRITICAL: Do NOT add radio buttons or question about new/local**
    - **CRITICAL: Do NOT include Grade 8 fields**
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2_
  
  - [x] 7.2 Implement form validation for Local Student
    - Validate all required fields are filled
    - Validate email format and uniqueness
    - Validate password length (minimum 6 characters)
    - Validate password confirmation matches
    - Validate grade selection is valid (9-12)
    - _Requirements: 3.6, 5.3, 5.4, 5.5_
  
  - [ ]* 7.3 Write unit tests for Local Student form
    - Test form renders with correct fields
    - Test form does NOT show Grade 8 fields
    - Test form validation catches missing required fields
    - Test form validation catches invalid grade
    - Test form does NOT show new/local selection
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 8. Implement form rendering logic based on registrationType
  - [x] 8.1 Update RegisterPage component state management
    - Ensure `registrationType` state is set in Step 2
    - Add conditional rendering logic for Step 3
    - If `registrationType === 'new'`, render New Student form
    - If `registrationType === 'local'`, render Local Student form
    - _Requirements: 4.3, 4.4_
  
  - [x] 8.2 Implement navigation between steps
    - Add back button on forms to return to type selection
    - Preserve role selection when going back
    - Clear form data when going back
    - Add progress indicators showing current step
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 8.3 Write integration tests for step navigation
    - Test full flow: role → type → form
    - Test back button preserves role but clears form
    - Test progress indicators update correctly
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 9. Update form submission to include registration_type
  - [x] 9.1 Modify handleSubmit method
    - Include `registration_type` field in API request payload
    - For new students: include Grade 8 fields in payload
    - For local students: exclude Grade 8 fields from payload
    - Handle API response and display success screen
    - _Requirements: 2.6, 2.7, 2.8, 3.6, 3.7, 3.8_
  
  - [x] 9.2 Update success screen
    - Display student code prominently
    - Show instructions for logging in
    - Add copy-to-clipboard button for student code
    - Add button to navigate to login page
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 9.3 Write integration tests for form submission
    - Test new student registration creates account with grade 9
    - Test local student registration creates account with selected grade
    - Test success screen displays student code
    - Test email/SMS notifications are sent
    - _Requirements: 2.6, 2.7, 2.8, 3.6, 3.7, 3.8, 9.6, 9.7_

- [x] 10. Verify teacher and parent registration unchanged
  - [x] 10.1 Test teacher registration flow
    - Verify teacher form still displays correctly
    - Verify teacher-specific fields are present
    - Verify teacher registration creates account successfully
    - _Requirements: 7.1, 7.3_
  
  - [x] 10.2 Test parent registration flow
    - Verify parent form still displays correctly
    - Verify parent-specific fields are present
    - Verify parent registration creates account successfully
    - _Requirements: 7.2, 7.4_
  
  - [ ]* 10.3 Write regression tests for teacher/parent registration
    - Test teacher registration with all fields
    - Test parent registration with all fields
    - Verify backend validation rules unchanged
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 6.7_

- [x] 11. Add error handling and user feedback
  - [x] 11.1 Implement error display for validation failures
    - Show error messages near relevant fields
    - Display API error messages clearly
    - Handle network errors gracefully
    - _Requirements: 10.6_
  
  - [x] 11.2 Add helpful tooltips and descriptions
    - Add tooltips explaining Grade 8 fields
    - Add descriptions for registration type options
    - Add field-level help text
    - _Requirements: 10.5_
  
  - [ ]* 11.3 Test error handling
    - Test validation errors display correctly
    - Test API errors are handled gracefully
    - Test network errors show appropriate messages
    - _Requirements: 10.6_

- [x] 12. Final checkpoint - End-to-end testing
  - Test complete new student registration flow
  - Test complete local student registration flow
  - Test teacher and parent registration still work
  - Verify database stores data correctly
  - Verify email/SMS notifications are sent
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The critical requirement is that Step 3 forms do NOT ask the new/local question - it's only asked in Step 2
- Backend changes should be completed before frontend changes to ensure API is ready
- Teacher and parent registration flows must remain unchanged
