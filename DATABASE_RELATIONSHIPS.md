# Tereta High School Management System - Database Relationships

## Database Schema Overview

This document describes all the database tables and their relationships in the system.

---

## Core Tables

### 1. **users** (Central Authentication Table)
Primary table for all system users (Admin, Teacher, Student, Parent)

**Columns:**
- `id` - Primary Key
- `name` - User's full name
- `email` - Unique email address
- `password` - Encrypted password
- `role` - User role (admin, teacher, student, parent)
- `phone` - Phone number (optional)
- `profile_picture` - Profile image path
- `verification_code` - 6-digit verification code
- `verification_code_expires_at` - Code expiration timestamp
- `is_verified` - Verification status
- `created_at`, `updated_at`

**Relationships:**
- Has one → `students` (if role = student)
- Has one → `teachers` (if role = teacher)
- Has one → `parent_models` (if role = parent)

---

### 2. **students**
Extended profile for student users

**Columns:**
- `id` - Primary Key
- `user_id` - Foreign Key → `users.id`
- `class_id` - Foreign Key → `class_rooms.id` (nullable)
- `student_code` - Unique student ID (e.g., STU20260037)
- `grade` - Grade level (9, 10, 11, 12)
- `date_of_birth` - Birth date
- `address` - Home address
- `guardian_name` - Guardian's name
- `guardian_phone` - Guardian's phone
- `created_at`, `updated_at`

**Relationships:**
- Belongs to → `users` (user_id)
- Belongs to → `class_rooms` (class_id)
- Has many → `attendances`
- Has many → `results`
- Belongs to many → `parent_models` (through `parent_student` pivot table)

---

### 3. **teachers**
Extended profile for teacher users

**Columns:**
- `id` - Primary Key
- `user_id` - Foreign Key → `users.id`
- `subject_specialization` - Main subject expertise
- `qualification` - Educational qualifications
- `experience_years` - Years of teaching experience
- `hire_date` - Date of hiring
- `created_at`, `updated_at`

**Relationships:**
- Belongs to → `users` (user_id)
- Has many → `teacher_subjects` (class and subject assignments)
- Has many → `attendances` (records they create)
- Has many → `results` (grades they enter)

---

### 4. **parent_models**
Extended profile for parent users

**Columns:**
- `id` - Primary Key
- `user_id` - Foreign Key → `users.id`
- `phone` - Contact phone number
- `address` - Home address
- `emergency_contact` - Alternative contact number
- `occupation` - Parent's occupation
- `created_at`, `updated_at`

**Relationships:**
- Belongs to → `users` (user_id)
- Belongs to many → `students` (through `parent_student` pivot table)

---

### 5. **class_rooms**
Classes/Sections in the school

**Columns:**
- `id` - Primary Key
- `name` - Class name (e.g., "Grade 9")
- `section` - Section identifier (e.g., "A", "B")
- `capacity` - Maximum students
- `room_number` - Physical classroom number
- `created_at`, `updated_at`

**Relationships:**
- Has many → `students`
- Has many → `teacher_subjects` (teacher assignments)
- Has many → `attendances`
- Has many → `results`

---

### 6. **subjects**
Academic subjects taught in school

**Columns:**
- `id` - Primary Key
- `name` - Subject name (e.g., "Mathematics", "English")
- `code` - Subject code (e.g., "MATH101")
- `description` - Subject description
- `credits` - Credit hours
- `created_at`, `updated_at`

**Relationships:**
- Has many → `teacher_subjects` (teacher assignments)
- Has many → `attendances`
- Has many → `results`

---

## Relationship Tables

### 7. **teacher_subjects** (Pivot Table)
Links teachers to their assigned classes and subjects

**Columns:**
- `id` - Primary Key
- `teacher_id` - Foreign Key → `teachers.id`
- `class_id` - Foreign Key → `class_rooms.id`
- `subject_id` - Foreign Key → `subjects.id`
- `created_at`, `updated_at`

**Relationships:**
- Belongs to → `teachers`
- Belongs to → `class_rooms`
- Belongs to → `subjects`

**Purpose:** Defines which teacher teaches which subject to which class

---

### 8. **parent_student** (Pivot Table)
Links parents to their children (students)

**Columns:**
- `id` - Primary Key
- `parent_id` - Foreign Key → `parent_models.id`
- `student_id` - Foreign Key → `students.id`
- `relationship` - Relationship type (father, mother, guardian)
- `created_at`, `updated_at`

**Relationships:**
- Belongs to → `parent_models`
- Belongs to → `students`

**Purpose:** Allows multiple parents per student and multiple children per parent

---

## Transaction Tables

### 9. **attendances**
Daily attendance records

**Columns:**
- `id` - Primary Key
- `student_id` - Foreign Key → `students.id`
- `class_id` - Foreign Key → `class_rooms.id`
- `subject_id` - Foreign Key → `subjects.id`
- `teacher_id` - Foreign Key → `teachers.id`
- `date` - Attendance date
- `status` - Status (present, absent, late, excused)
- `remarks` - Additional notes
- `created_at`, `updated_at`

**Relationships:**
- Belongs to → `students`
- Belongs to → `class_rooms`
- Belongs to → `subjects`
- Belongs to → `teachers` (who marked it)

---

### 10. **results**
Academic results/grades

**Columns:**
- `id` - Primary Key
- `student_id` - Foreign Key → `students.id`
- `class_id` - Foreign Key → `class_rooms.id`
- `subject_id` - Foreign Key → `subjects.id`
- `teacher_id` - Foreign Key → `teachers.id`
- `exam_type` - Type (midterm, final, quiz, assignment)
- `marks` - Score obtained
- `total_marks` - Maximum possible score
- `grade` - Letter grade (A, B, C, etc.)
- `remarks` - Teacher's comments
- `exam_date` - Date of examination
- `created_at`, `updated_at`

**Relationships:**
- Belongs to → `students`
- Belongs to → `class_rooms`
- Belongs to → `subjects`
- Belongs to → `teachers` (who entered it)

---

## Relationship Diagram (Text Format)

```
┌─────────────┐
│    users    │ (Central table for all users)
└──────┬──────┘
       │
       ├─────────────────────────────────────────────┐
       │                                             │
       ▼                                             ▼
┌─────────────┐                              ┌──────────────┐
│  students   │◄─────────────────────────────┤ parent_models│
└──────┬──────┘                              └──────┬───────┘
       │                                             │
       │         ┌──────────────────┐               │
       └────────►│ parent_student   │◄──────────────┘
                 └──────────────────┘
                 (Many-to-Many Pivot)

┌─────────────┐
│  teachers   │
└──────┬──────┘
       │
       │         ┌──────────────────┐
       └────────►│ teacher_subjects │
                 └────────┬─────────┘
                          │
                          ├──────────► class_rooms
                          └──────────► subjects

┌─────────────┐
│  students   │
└──────┬──────┘
       │
       ├──────────► attendances ◄──── teachers
       │                 │
       │                 ├──────────► class_rooms
       │                 └──────────► subjects
       │
       └──────────► results ◄──────── teachers
                         │
                         ├──────────► class_rooms
                         └──────────► subjects
```

---

## Key Relationships Explained

### 1. **User → Role-Specific Profile** (One-to-One)
- Each user has ONE role-specific profile
- `users.role = 'student'` → has one record in `students`
- `users.role = 'teacher'` → has one record in `teachers`
- `users.role = 'parent'` → has one record in `parent_models`
- `users.role = 'admin'` → no additional profile table

### 2. **Parent ↔ Student** (Many-to-Many)
- One parent can have multiple children
- One student can have multiple parents/guardians
- Linked through `parent_student` pivot table
- Example: Father and Mother both linked to same student

### 3. **Teacher → Classes & Subjects** (Many-to-Many)
- One teacher can teach multiple subjects
- One teacher can teach multiple classes
- One subject can be taught by multiple teachers
- Linked through `teacher_subjects` table
- Example: Teacher A teaches Math to Grade 9A and Grade 9B

### 4. **Student → Class** (Many-to-One)
- One student belongs to ONE class
- One class has MANY students
- `students.class_id` → `class_rooms.id`

### 5. **Attendance Records** (Many-to-One relationships)
- Each attendance record belongs to:
  - ONE student
  - ONE class
  - ONE subject
  - ONE teacher (who marked it)
- Used to track daily presence/absence

### 6. **Results/Grades** (Many-to-One relationships)
- Each result record belongs to:
  - ONE student
  - ONE class
  - ONE subject
  - ONE teacher (who entered it)
- Used to track academic performance

---

## Data Flow Examples

### Example 1: Teacher Marking Attendance
1. Teacher logs in → `users` table (role = teacher)
2. System fetches teacher's assigned classes → `teacher_subjects` table
3. Teacher selects a class and subject
4. System shows students in that class → `students` table (filtered by class_id)
5. Teacher marks attendance → Creates records in `attendances` table

### Example 2: Parent Viewing Child's Results
1. Parent logs in → `users` table (role = parent)
2. System fetches parent's children → `parent_student` pivot table
3. Parent selects a child
4. System fetches child's results → `results` table (filtered by student_id)
5. Results displayed with subject names and teacher names

### Example 3: Admin Assigning Teacher to Class
1. Admin selects a teacher → `teachers` table
2. Admin selects a class → `class_rooms` table
3. Admin selects a subject → `subjects` table
4. System creates assignment → `teacher_subjects` table

---

## Important Notes

1. **Soft Deletes**: Not currently implemented, but recommended for production
2. **Timestamps**: All tables have `created_at` and `updated_at`
3. **Foreign Key Constraints**: Ensure referential integrity
4. **Indexes**: Primary keys and foreign keys are indexed for performance
5. **Nullable Fields**: Some fields like `class_id` in students can be null (unassigned students)

---

## Database Migrations Location

All migrations are in: `hsms-backend/database/migrations/`

Key migration files:
- `create_users_table.php`
- `create_students_table.php`
- `create_teachers_table.php`
- `create_parent_models_table.php`
- `create_class_rooms_table.php`
- `create_subjects_table.php`
- `create_teacher__subjects_table.php`
- `create_parent_student_table.php`
- `create_attendances_table.php`
- `create_results_table.php`

---

## Model Relationships in Laravel

### User Model
```php
public function student() { return $this->hasOne(Student::class); }
public function teacher() { return $this->hasOne(Teacher::class); }
public function parent() { return $this->hasOne(ParentModel::class); }
```

### Student Model
```php
public function user() { return $this->belongsTo(User::class); }
public function class() { return $this->belongsTo(ClassRoom::class); }
public function parents() { return $this->belongsToMany(ParentModel::class, 'parent_student'); }
public function attendances() { return $this->hasMany(Attendance::class); }
public function results() { return $this->hasMany(Result::class); }
```

### Teacher Model
```php
public function user() { return $this->belongsTo(User::class); }
public function teacherSubjects() { return $this->hasMany(TeacherSubject::class); }
```

### ParentModel
```php
public function user() { return $this->belongsTo(User::class); }
public function students() { return $this->belongsToMany(Student::class, 'parent_student'); }
```

---

This database structure supports all the features of the Tereta High School Management System including user management, class assignments, attendance tracking, grade management, and parent-student relationships.
