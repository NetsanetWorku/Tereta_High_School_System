# Implementation Plan: Teacher Assignments 403 Fix

## Overview

This implementation plan provides a systematic approach to diagnosing and fixing the 403 Forbidden error that occurs when teachers try to access the `/my-assignments` endpoint. The plan follows a diagnostic-first approach: identify the root cause, implement fixes, add safeguards, and verify the solution works across all role-protected endpoints.

The implementation is organized into discrete phases: database diagnostics, middleware enhancement, role validation, frontend verification, and comprehensive testing.

## Tasks

- [x] 1. Create diagnostic script for role investigation
  - [x] 1.1 Create DiagnoseRoleIssue command class
    - Create `app/Console/Commands/DiagnoseRoleIssue.php`
    - Implement `checkTeacherRoles()` method to query all users with teacher profiles
    - Implement `checkRoleValues()` method to identify case sensitivity and whitespace issues
    - Implement `checkUserAuthentication()` method to test token generation for specific users
    - Output diagnostic report with: total teachers, role value distribution, problematic users
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 1.2 Write unit tests for diagnostic script
    - Test querying users with various role values
    - Test identifying case sensitivity issues ("Teacher" vs "teacher")
    - Test identifying whitespace issues (" teacher " vs "teacher")
    - Test reporting format and completeness
    - _Requirements: 1.1, 1.2, 1.4_

- [x] 2. Enhance RoleMiddleware with diagnostic logging
  - [x] 2.1 Add logging to RoleMiddleware
    - Modify `app/Http/Middleware/RoleMiddleware.php`
    - Add logging before role comparison: user ID, user role, required roles
    - Add logging after role comparison: authorization decision (allow/deny)
    - Include diagnostic information in 403 response for development environment
    - Use Laravel's Log facade with appropriate log levels
    - _Requirements: 3.1, 3.5, 6.1, 6.2, 6.3_

  - [ ]* 2.2 Write property test for role middleware authorization
    - **Property 7: Role Middleware Authorization Decision**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
    - Generate random users with various roles
    - Generate random required role lists
    - Test: matching roles → request proceeds, non-matching roles → 403 response
    - Verify case-sensitive comparison (Teacher ≠ teacher)

  - [ ]* 2.3 Write unit tests for middleware logging
    - Test logging output contains user ID, role, required roles
    - Test 403 response includes diagnostic info in development mode
    - Test 403 response excludes diagnostic info in production mode
    - _Requirements: 3.5, 6.1, 6.2, 6.3, 6.4_


- [ ] 3. Create role validation and correction service
  - [ ] 3.1 Create RoleValidationService class
    - Create `app/Services/RoleValidationService.php`
    - Define VALID_ROLES constant: ['admin', 'teacher', 'student', 'parent']
    - Implement `normalizeRole()` method: lowercase and trim role values
    - Implement `validateRole()` method: check if role is in VALID_ROLES
    - Implement `fixIncorrectRoles()` method: find and correct all incorrect role values
    - Return detailed report of fixed users
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 3.2 Write property test for role normalization
    - **Property 16: Role Value Normalization**
    - **Validates: Requirements 7.3**
    - Generate random role strings with various cases and whitespace
    - Test: all normalized roles are lowercase and trimmed
    - Verify "Teacher" → "teacher", " ADMIN " → "admin"

  - [ ]* 3.3 Write property test for role validation
    - **Property 17: Role Value Validation**
    - **Validates: Requirements 7.4**
    - Generate random invalid role strings
    - Test: all invalid roles are rejected
    - Verify "superuser", "moderator", "guest" all fail validation

  - [ ]* 3.4 Write property test for role correction
    - **Property 18: Incorrect Role Correction**
    - **Validates: Requirements 7.2**
    - Create users with incorrect role values
    - Run correction script
    - Test: all incorrect roles are fixed to correct normalized values

- [ ] 4. Update AuthController to use role validation
  - [ ] 4.1 Integrate RoleValidationService into registration
    - Modify `app/Http/Controllers/Api/AuthController.php`
    - Inject RoleValidationService into register method
    - Normalize role value before creating user
    - Validate role value against allowed list
    - Return validation error if role is invalid
    - _Requirements: 7.3, 7.4_

  - [ ]* 4.2 Write unit tests for registration role validation
    - Test registration with valid roles succeeds
    - Test registration with invalid roles fails
    - Test role normalization during registration
    - _Requirements: 7.3, 7.4_

- [ ] 5. Run diagnostics and apply fixes
  - [ ] 5.1 Execute diagnostic script
    - Run `php artisan diagnose:roles` command
    - Review output for problematic users
    - Document findings: number of users with incorrect roles, specific issues found
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 5.2 Apply role corrections
    - Run role correction script if issues found
    - Verify all teacher accounts now have role = "teacher"
    - Verify all other accounts have correct normalized roles
    - _Requirements: 7.1, 7.2_

- [ ] 6. Checkpoint - Verify backend fixes
  - Ensure all tests pass
  - Verify diagnostic script runs successfully
  - Verify role corrections applied correctly
  - Ask the user if questions arise


- [ ] 7. Verify frontend authentication flow
  - [ ] 7.1 Create frontend diagnostic utility
    - Create `hsms-frontend/src/utils/authDiagnostics.js`
    - Implement `checkLocalStorage()`: verify token and user object exist
    - Implement `verifyUserObject()`: validate user object structure and role field
    - Implement `testAuthenticatedRequest()`: make test request to /api/me
    - Log diagnostic information to console
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.2 Write property test for localStorage round-trip
    - **Property 4: LocalStorage Round-Trip Integrity**
    - **Validates: Requirements 2.2, 5.2**
    - Generate random user objects with various field values
    - Test: store in localStorage → retrieve → compare for equality
    - Verify role field is preserved exactly

  - [ ]* 7.3 Write property test for authentication header
    - **Property 5: Authentication Header Presence**
    - **Validates: Requirements 2.3, 5.4**
    - Generate random authenticated requests
    - Test: all requests include Authorization header with bearer token
    - Verify header format: "Bearer {token}"

  - [ ]* 7.4 Write unit test for corrupted data handling
    - Test corrupted JSON in localStorage triggers clear and redirect
    - Test missing token triggers redirect to login
    - Test missing user object triggers redirect to login
    - _Requirements: 5.3_

- [ ] 8. Test teacher assignments endpoint access
  - [ ] 8.1 Create integration test for teacher access
    - Create test file for /my-assignments endpoint
    - Test: teacher login → get token → request /my-assignments → verify 200 OK
    - Test: verify response contains assignment data array
    - Test: verify assignment data structure is correct
    - _Requirements: 4.1_

  - [ ]* 8.2 Write property test for login response completeness
    - **Property 3: Login Response Completeness**
    - **Validates: Requirements 2.1**
    - Generate logins for all user roles (teacher, student, parent, admin)
    - Test: all login responses include complete user object
    - Verify fields: id, name, email, role, profile_picture, profile_picture_url

  - [ ]* 8.3 Write property test for authentication method compatibility
    - **Property 12: Authentication Method Compatibility**
    - **Validates: Requirements 4.4**
    - Test email/password login for teachers, parents, admins
    - Test name/student_id login for students
    - Verify all methods produce valid token and user object with role

  - [ ]* 8.4 Write unit tests for error messages
    - Test 403 response includes descriptive error message
    - Test error message indicates "Insufficient permissions"
    - _Requirements: 4.2_

- [ ] 9. Comprehensive role-based access control testing
  - [ ]* 9.1 Write property test for RBAC integrity
    - **Property 11: Role-Based Access Control Integrity**
    - **Validates: Requirements 4.3, 8.1, 8.2, 8.3, 8.4**
    - Generate all combinations of user roles and protected endpoints
    - Test teacher access: teacher endpoints → 200, others → 403
    - Test student access: student endpoints → 200, others → 403
    - Test parent access: parent endpoints → 200, others → 403
    - Test admin access: admin endpoints → 200, others → 403

  - [ ] 9.2 Manual verification of all role-protected endpoints
    - Test teacher accessing: /my-classes, /my-assignments, /my-timetable, /my-exam-schedules
    - Test student accessing: /my-attendance, /my-results, /my-timetable, /my-assignments
    - Test parent accessing: /parent/children, /child-attendance, /child-results
    - Test admin accessing: /students, /teachers, /classes, /subjects
    - Document any endpoints that fail authorization
    - _Requirements: 4.3, 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Checkpoint - Verify complete solution
  - Ensure all tests pass
  - Verify teacher can access /my-assignments without 403 error
  - Verify all other role-protected endpoints work correctly
  - Verify no regressions in authentication flows
  - Ask the user if questions arise


- [ ] 11. Add production safeguards
  - [ ] 11.1 Implement production log security
    - Review all logging statements in RoleMiddleware
    - Ensure no passwords, tokens, or sensitive data are logged
    - Add environment check: detailed logs in dev, minimal logs in production
    - _Requirements: 6.4_

  - [ ]* 11.2 Write property test for log security
    - **Property 15: Production Log Security**
    - **Validates: Requirements 6.4**
    - Generate various log entries in production mode
    - Test: no log entry contains passwords, tokens, or PII
    - Verify sensitive fields are redacted or excluded

  - [ ] 11.3 Add development mode diagnostic responses
    - Modify RoleMiddleware to include diagnostic info in 403 responses when in development
    - Include: user ID, actual role, required roles, endpoint attempted
    - Exclude diagnostic info in production mode
    - _Requirements: 6.3_

  - [ ]* 11.4 Write unit test for diagnostic responses
    - Test 403 in development includes diagnostic information
    - Test 403 in production excludes diagnostic information
    - _Requirements: 6.3_

- [ ] 12. Documentation and cleanup
  - [ ] 12.1 Document the fix and prevention measures
    - Create or update TROUBLESHOOTING.md with 403 error diagnosis steps
    - Document role validation requirements for future development
    - Document how to run diagnostic script
    - Document how to use role correction script
    - _Requirements: All_

  - [ ] 12.2 Add database migration for role validation
    - Create migration to add CHECK constraint on users.role field
    - Constraint: role IN ('admin', 'teacher', 'student', 'parent')
    - This prevents invalid roles at database level
    - _Requirements: 7.4_

  - [ ] 12.3 Update API documentation
    - Document role field requirements in API documentation
    - Document authentication and authorization flow
    - Document error responses for 401 and 403 errors
    - _Requirements: All_

- [ ] 13. Final verification and deployment
  - [ ] 13.1 Run full test suite
    - Run all unit tests
    - Run all property-based tests
    - Run all integration tests
    - Verify 100% pass rate

  - [ ] 13.2 Manual end-to-end testing
    - Test teacher login and assignment access
    - Test creating, editing, and deleting assignments
    - Test viewing assignment submissions
    - Test all other teacher endpoints
    - Verify no 403 errors occur for valid teacher access

  - [ ] 13.3 Verify fix in production-like environment
    - Deploy to staging environment
    - Test with real teacher accounts
    - Monitor logs for any authorization issues
    - Verify performance is not impacted by additional logging

## Notes

- Tasks marked with `*` are optional property-based and unit tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and allow for user feedback
- Property tests validate universal correctness properties across many inputs
- Unit tests validate specific examples and edge cases
- The diagnostic-first approach ensures we understand the problem before implementing fixes
- Role validation at multiple layers (application, database) provides defense in depth
