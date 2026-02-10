# Requirements Document

## Introduction

This document specifies the requirements for separating the student registration process into two distinct flows: one for new students joining high school for the first time, and another for local/existing students already in the school system. Additionally, security questions will be removed from the registration process to streamline the user experience.

The current system has a single registration form with a two-step process that asks students if they are "new to high school" and conditionally shows Grade 8 information fields. This will be replaced with two completely separate registration forms, each optimized for its specific use case.

## Glossary

- **Registration_System**: The web-based interface and backend API that handles user account creation for students, teachers, and parents
- **New_Student**: A student joining high school for the first time, typically entering Grade 9
- **Local_Student**: An existing student already enrolled in the school system, in Grade 10, 11, or 12
- **Security_Questions**: Authentication questions previously used during registration (to be removed)
- **Student_Code**: A unique identifier automatically generated for each student (format: STU{YEAR}{ID})
- **Grade_8_Information**: Academic records from the student's previous school including results, evaluation method, and school name
- **Frontend**: The Next.js application that provides the user interface
- **Backend**: The Laravel API that processes registration requests and manages data
- **Registration_Form**: The user interface component that collects student information during account creation

## Requirements

### Requirement 1: Remove Security Questions

**User Story:** As a system administrator, I want to remove security questions from the registration process, so that the registration flow is simpler and faster for users.

#### Acceptance Criteria

1. WHEN any user accesses the registration form THEN the system SHALL NOT display security question fields
2. WHEN a user submits a registration form THEN the system SHALL NOT require security question answers
3. WHEN the backend processes a registration request THEN the system SHALL NOT validate or store security question data
4. THE Frontend SHALL remove all security question UI components from the registration page
5. THE Backend SHALL remove all security question validation rules from the registration controller

### Requirement 2: Create New Student Registration Form

**User Story:** As a new student joining high school, I want a dedicated registration form for first-time students, so that I can provide my Grade 8 information and be properly enrolled in Grade 9.

#### Acceptance Criteria

1. WHEN a user selects "New Student" registration THEN the system SHALL display a form specifically designed for new students
2. THE New_Student_Form SHALL automatically set the grade level to Grade 9
3. THE New_Student_Form SHALL require the student's previous school name
4. THE New_Student_Form SHALL require Grade 8 academic results
5. THE New_Student_Form SHALL require the Grade 8 evaluation method (percentage, GPA, letter grade, points, or other)
6. WHEN a new student submits the form THEN the system SHALL create a user account with role "student" and grade "9"
7. WHEN a new student registration is successful THEN the system SHALL generate a unique Student_Code
8. WHEN a new student registration is successful THEN the system SHALL send email and SMS notifications with the Student_Code and verification code

### Requirement 3: Create Local Student Registration Form

**User Story:** As an existing student in the school system, I want a dedicated registration form for local students, so that I can register without providing unnecessary Grade 8 information.

#### Acceptance Criteria

1. WHEN a user selects "Local Student" registration THEN the system SHALL display a form specifically designed for existing students
2. THE Local_Student_Form SHALL allow grade level selection from Grade 9, 10, 11, or 12
3. THE Local_Student_Form SHALL NOT require previous school information
4. THE Local_Student_Form SHALL NOT require Grade 8 academic results
5. THE Local_Student_Form SHALL NOT require Grade 8 evaluation method
6. WHEN a local student submits the form THEN the system SHALL create a user account with the selected grade level
7. WHEN a local student registration is successful THEN the system SHALL generate a unique Student_Code
8. WHEN a local student registration is successful THEN the system SHALL send email and SMS notifications with the Student_Code and verification code

### Requirement 4: Implement Registration Type Selection

**User Story:** As a student user, I want to choose between new student and local student registration, so that I can access the appropriate registration form for my situation.

#### Acceptance Criteria

1. WHEN a user selects the "Student" role THEN the system SHALL display a registration type selection screen
2. THE Registration_Type_Selection SHALL present two clear options: "New Student" and "Local Student"
3. WHEN a user selects "New Student" THEN the system SHALL navigate to the new student registration form
4. WHEN a user selects "Local Student" THEN the system SHALL navigate to the local student registration form
5. THE Registration_Type_Selection SHALL provide clear descriptions of each option to help users choose correctly
6. THE Registration_Type_Selection SHALL include a back button to return to role selection

### Requirement 5: Maintain Common Registration Fields

**User Story:** As a developer, I want both registration forms to collect essential common information, so that all student accounts have the required base data.

#### Acceptance Criteria

1. THE New_Student_Form SHALL require full name, email, password, password confirmation, and gender
2. THE Local_Student_Form SHALL require full name, email, password, password confirmation, and gender
3. WHEN either form is submitted THEN the system SHALL validate that password and password confirmation match
4. WHEN either form is submitted THEN the system SHALL validate that the email is unique in the system
5. WHEN either form is submitted THEN the system SHALL validate that the password is at least 6 characters
6. THE Registration_System SHALL allow optional phone number entry for SMS notifications on both forms
7. THE Registration_System SHALL allow optional student ID entry on both forms
8. THE Registration_System SHALL allow optional class selection on both forms

### Requirement 6: Update Backend Registration Logic

**User Story:** As a backend developer, I want the registration API to handle both new and local student registrations, so that the system correctly processes each registration type.

#### Acceptance Criteria

1. WHEN the backend receives a new student registration THEN the system SHALL validate the presence of Grade 8 information fields
2. WHEN the backend receives a local student registration THEN the system SHALL NOT require Grade 8 information fields
3. WHEN the backend creates a new student account THEN the system SHALL store the student record with the appropriate grade level
4. THE Backend SHALL generate a unique Student_Code for all student registrations
5. THE Backend SHALL create a verification code that expires after 24 hours
6. WHEN a student registration is successful THEN the system SHALL return the Student_Code in the API response
7. THE Backend SHALL maintain backward compatibility with teacher and parent registration flows

### Requirement 7: Preserve Existing Registration Features

**User Story:** As a system user, I want the existing registration features for teachers and parents to remain unchanged, so that those user types can continue registering without disruption.

#### Acceptance Criteria

1. WHEN a user selects "Teacher" role THEN the system SHALL display the existing teacher registration form
2. WHEN a user selects "Parent" role THEN the system SHALL display the existing parent registration form
3. THE Registration_System SHALL maintain all existing teacher-specific fields (subject specialization, qualification, experience)
4. THE Registration_System SHALL maintain all existing parent-specific fields (phone, address, emergency contact)
5. THE Backend SHALL continue to process teacher and parent registrations using existing validation rules

### Requirement 8: Update Database Schema

**User Story:** As a database administrator, I want the database to store Grade 8 information for new students, so that the school has complete academic records.

#### Acceptance Criteria

1. THE Student_Table SHALL include a field for previous school name
2. THE Student_Table SHALL include a field for Grade 8 results
3. THE Student_Table SHALL include a field for Grade 8 evaluation method
4. WHEN a new student registers THEN the system SHALL store Grade 8 information in the student record
5. WHEN a local student registers THEN the system SHALL store NULL values for Grade 8 information fields
6. THE Database_Migration SHALL preserve existing student records during schema updates

### Requirement 9: Maintain Registration Success Flow

**User Story:** As a newly registered student, I want to receive my Student ID and login instructions after registration, so that I can access my account.

#### Acceptance Criteria

1. WHEN a student registration is successful THEN the system SHALL display a success screen with the Student_Code
2. THE Success_Screen SHALL display the student's name and Student_Code prominently
3. THE Success_Screen SHALL provide instructions for logging in with name and Student_Code
4. THE Success_Screen SHALL include a button to copy the Student_Code to clipboard
5. THE Success_Screen SHALL include a button to navigate to the login page
6. WHEN a student registration is successful THEN the system SHALL send an email with the Student_Code and verification code
7. WHEN a student provides a phone number THEN the system SHALL send an SMS with the Student_Code and verification code

### Requirement 10: Implement Navigation and User Experience

**User Story:** As a user, I want clear navigation between registration steps, so that I can easily move forward or go back if I make a mistake.

#### Acceptance Criteria

1. WHEN a user is on the registration type selection screen THEN the system SHALL display a back button to return to role selection
2. WHEN a user is on a registration form THEN the system SHALL display a back button to return to the previous step
3. WHEN a user clicks a back button THEN the system SHALL preserve the role selection but clear form data
4. THE Registration_System SHALL display clear progress indicators showing the current step
5. THE Registration_System SHALL display helpful descriptions and tooltips for each field
6. WHEN a validation error occurs THEN the system SHALL display clear error messages near the relevant fields
