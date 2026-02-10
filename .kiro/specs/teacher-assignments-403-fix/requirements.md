# Requirements Document

## Introduction

This document specifies the requirements for diagnosing and fixing a 403 Forbidden error that occurs when teachers attempt to access the `/my-assignments` endpoint. The issue prevents teachers from viewing and managing their assignments, which is a critical feature for the school management system.

The root cause investigation focuses on the authentication and authorization flow, specifically the role-based middleware that protects the endpoint. The system uses Laravel Sanctum for API authentication and a custom RoleMiddleware for authorization checks.

## Glossary

- **System**: The High School Management System (HSMS) backend API
- **Frontend**: The Next.js-based web application that consumes the API
- **RoleMiddleware**: Laravel middleware that checks if authenticated users have required roles
- **Sanctum**: Laravel's API authentication system using bearer tokens
- **User_Role**: The role field stored in the users database table (values: admin, teacher, student, parent)
- **Auth_Token**: Bearer token stored in browser localStorage and sent with API requests
- **User_Object**: JSON object containing user data stored in browser localStorage

## Requirements

### Requirement 1: Diagnose Role Value Mismatch

**User Story:** As a developer, I want to verify the user's role value in the database, so that I can identify if there's a mismatch between stored and expected values.

#### Acceptance Criteria

1. WHEN querying the users table, THE System SHALL return the exact role value stored for teacher accounts
2. WHEN comparing role values, THE System SHALL identify any case sensitivity issues (e.g., "Teacher" vs "teacher")
3. WHEN examining the database schema, THE System SHALL confirm the role field type and constraints
4. THE System SHALL verify that teacher accounts have the role value "teacher" (lowercase)

### Requirement 2: Verify Authentication Token Flow

**User Story:** As a developer, I want to verify the authentication token contains correct user data, so that I can ensure the middleware receives accurate information.

#### Acceptance Criteria

1. WHEN a teacher logs in, THE System SHALL return a user object with the correct role field in the login response
2. WHEN the Frontend stores user data, THE System SHALL preserve the role field exactly as received from the API
3. WHEN making authenticated requests, THE Frontend SHALL send a valid bearer token in the Authorization header
4. WHEN the RoleMiddleware checks authentication, THE System SHALL successfully retrieve the user from the token

### Requirement 3: Validate Role Middleware Logic

**User Story:** As a developer, I want to verify the RoleMiddleware correctly checks user roles, so that I can identify any logic errors in the authorization process.

#### Acceptance Criteria

1. WHEN the RoleMiddleware receives a request, THE System SHALL retrieve the authenticated user's role from the database
2. WHEN comparing roles, THE System SHALL use case-sensitive string comparison
3. WHEN the user's role matches any of the required roles, THE System SHALL allow the request to proceed
4. IF the user's role does not match any required roles, THEN THE System SHALL return a 403 Forbidden response
5. THE System SHALL log sufficient information to debug authorization failures

### Requirement 4: Fix Authorization Issue

**User Story:** As a teacher, I want to access the `/my-assignments` endpoint without getting a 403 error, so that I can view and manage my assignments.

#### Acceptance Criteria

1. WHEN a teacher with valid credentials accesses `/my-assignments`, THE System SHALL return a 200 OK response with assignment data
2. WHEN the role check fails, THE System SHALL provide a descriptive error message indicating the authorization failure reason
3. WHEN fixing the issue, THE System SHALL ensure no other role-based endpoints are negatively affected
4. THE System SHALL maintain backward compatibility with existing authentication flows

### Requirement 5: Verify Frontend User Data Storage

**User Story:** As a developer, I want to verify the frontend correctly stores and retrieves user data, so that I can ensure the role information is available for API requests.

#### Acceptance Criteria

1. WHEN a user logs in, THE Frontend SHALL store the complete user object in localStorage
2. WHEN retrieving user data from localStorage, THE Frontend SHALL parse the JSON correctly without data loss
3. WHEN the user object is corrupted or invalid, THE Frontend SHALL clear the stored data and redirect to login
4. THE Frontend SHALL include the bearer token in all authenticated API requests

### Requirement 6: Add Diagnostic Logging

**User Story:** As a developer, I want detailed logging of the authorization process, so that I can quickly diagnose similar issues in the future.

#### Acceptance Criteria

1. WHEN the RoleMiddleware checks authorization, THE System SHALL log the user ID, requested role, and actual user role
2. WHEN authorization fails, THE System SHALL log the specific reason for failure
3. WHEN a 403 error occurs, THE System SHALL include diagnostic information in the error response for development environments
4. THE System SHALL not expose sensitive user information in production logs

### Requirement 7: Validate Database Role Values

**User Story:** As a developer, I want to ensure all teacher accounts have consistent role values, so that authorization checks work reliably.

#### Acceptance Criteria

1. THE System SHALL verify that all teacher user accounts have the role field set to "teacher" (lowercase)
2. IF any teacher accounts have incorrect role values, THEN THE System SHALL provide a migration or script to correct them
3. WHEN creating new teacher accounts, THE System SHALL enforce lowercase role values
4. THE System SHALL validate role values against an allowed list (admin, teacher, student, parent)

### Requirement 8: Test Authorization Across All Role-Protected Endpoints

**User Story:** As a developer, I want to verify that all role-protected endpoints work correctly, so that I can ensure the fix doesn't introduce regressions.

#### Acceptance Criteria

1. WHEN testing teacher endpoints, THE System SHALL verify access to all teacher-specific routes
2. WHEN testing student endpoints, THE System SHALL verify students cannot access teacher routes
3. WHEN testing admin endpoints, THE System SHALL verify only admins can access admin routes
4. WHEN testing parent endpoints, THE System SHALL verify parents can only access parent routes
5. THE System SHALL maintain proper authorization boundaries between different user roles
