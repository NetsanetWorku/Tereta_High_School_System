# Teacher Dashboard - Complete Workflow Guide

## Overview
This guide shows how teachers use the system to manage classes, attendance, assignments, and results.

---

## 🏠 Teacher Dashboard

**URL:** `/teacher`

### Dashboard Features:
- **Statistics Cards:**
  - 🏫 My Classes (total count)
  - 👨‍🎓 Total Students (across all classes)
  - 📝 My Assignments (total count)
  - ⏳ Pending Submissions (needs grading)

- **My Classes Section:**
  - Shows first 5 classes
  - Click on any class to view students
  - Shows student count per class
  - Displays subject and grade level

- **Recent Assignments Section:**
  - Shows last 5 assignments
  - Status badges (Active/Overdue)
  - Submission count
  - Due date display

- **Quick Actions:**
  - 📝 Create Assignment
  - 📅 Mark Attendance
  - 📊 Enter Results
  - 🏫 View Classes

---

## 📅 ATTENDANCE WORKFLOW

### Step 1: View Attendance Records
**URL:** `/teacher/attendance`

**Features:**
- View all attendance records you've marked
- Filter by date, student, status
- See student name, date, status, notes
- Button to "Mark Attendance"

### Step 2: Mark New Attendance
**URL:** `/teacher/attendance/mark`

**Process:**

1. **Select Class**
   - Dropdown shows all your assigned classes
   - Format: "Grade 9A - A (Mathematics)"
   - Only classes you teach appear

2. **Select Date**
   - Date picker (defaults to today)
   - Cannot select future dates
   - Can mark past attendance

3. **Mark Students**
   - Table shows all students in selected class
   - Columns: #, Student ID, Name, Status
   - For each student, choose:
     - ✅ Present (default)
     - ❌ Absent
   - All students default to "Present"

4. **Submit**
   - Click "Mark Attendance" button
   - System saves for all students
   - Success message appears
   - Redirects to attendance list

**Example Flow:**
```
Teacher Dashboard
    ↓ Click "Mark Attendance"
Attendance Records Page
    ↓ Click "Mark Attendance" button
Mark Attendance Form
    ↓ Select "Grade 9A - Mathematics"
Students List Appears (30 students)
    ↓ Mark 3 students as Absent
    ↓ Click "Mark Attendance"
✅ Success! Attendance saved
    ↓ Redirect to Attendance Records
```

---

## 📝 ASSIGNMENTS WORKFLOW

### Step 1: View All Assignments
**URL:** `/teacher/assignments`

**Features:**
- Search assignments by title/description
- Statistics:
  - Total Assignments
  - Active (not yet due)
  - Overdue (past due date)
  - Pending Review (submissions to grade)
- Table shows:
  - Title & Description
  - Class & Subject
  - Due Date & Time
  - Status Badge (Active/Due Soon/Overdue)
  - Submissions count (5/30)
  - Actions: Grade, Edit, Delete

### Step 2: Create New Assignment
**URL:** `/teacher/assignments/add`

**Form Fields:**

1. **Title** (required)
   - Example: "Chapter 5 Homework"

2. **Description** (required)
   - Example: "Complete exercises 1-10 from textbook"

3. **Class** (required)
   - Dropdown: Your assigned classes
   - Example: "Grade 9A - Mathematics"

4. **Subject** (auto-filled)
   - Automatically filled based on class selection
   - Read-only field

5. **Due Date** (required)
   - Cannot select past dates
   - Example: "2026-03-20"

6. **Due Time** (optional)
   - Defaults to 23:59 if not set
   - Example: "14:30"

7. **Total Marks** (required)
   - Default: 100
   - Example: 50

8. **Instructions** (optional)
   - Additional details for students
   - Example: "Show all work. Use pencil."

9. **Attachment URL** (optional)
   - Link to external resources
   - Example: "https://drive.google.com/..."

**Submit:**
- Click "Create" button
- Success message
- Redirects to assignments list

### Step 3: Grade Submissions
**URL:** `/teacher/assignments/[id]/submissions`

**Features:**
- View all student submissions
- Filter by status (Pending/Submitted/Graded)
- For each submission:
  - Student name
  - Submission date
  - Content/Answer
  - Current grade (if graded)
  - Actions: Grade, View Details

**Grading Process:**
1. Click "Grade" button
2. Enter marks (0 to total_marks)
3. Add feedback (optional)
4. Click "Save Grade"
5. Status changes to "Graded"

---

## 📊 RESULTS WORKFLOW

### Step 1: View All Results
**URL:** `/teacher/results`

**Features:**
- View all results you've entered
- Table shows:
  - Student Name
  - Subject
  - Score
  - Grade (A, B, C, etc.)
  - Date entered

### Step 2: Enter New Results
**URL:** `/teacher/results/add` (TO BE CREATED)

**Proposed Form Fields:**

1. **Class** (required)
   - Dropdown: Your assigned classes

2. **Subject** (auto-filled)
   - Based on class selection

3. **Assessment Type** (required)
   - Options:
     - Assignment
     - Test
     - Midterm
     - Final Exam

4. **Assessment Name** (required)
   - Example: "Chapter 5 Test"

5. **Date** (required)
   - When assessment was taken

6. **Total Marks** (required)
   - Example: 100

7. **Student Results** (bulk entry)
   - Table with all students
   - Columns: Student ID, Name, Marks Obtained
   - Enter marks for each student

**Submit:**
- Click "Save Results"
- System calculates grades automatically
- Success message
- Redirects to results list

---

## 🏫 CLASSES WORKFLOW

### View My Classes
**URL:** `/teacher/classes`

**Features:**
- Grid/List view of all assigned classes
- For each class:
  - Class name (Grade 9A)
  - Subject (Mathematics)
  - Grade level
  - Student count
  - Click to view students

### View Class Students
**URL:** `/teacher/classes/[id]/students`

**Features:**
- List of all students in the class
- Student details:
  - Student ID
  - Name
  - Email
  - Phone
  - Guardian info
- Actions:
  - View student profile
  - View student attendance
  - View student results

---

## 🔐 SECURITY & PERMISSIONS

### What Teachers CAN Do:
✅ View only their assigned classes
✅ Mark attendance for their classes only
✅ Create assignments for their subjects/classes only
✅ Enter results for their students only
✅ View submissions for their assignments only
✅ Update their own profile

### What Teachers CANNOT Do:
❌ View other teachers' classes
❌ Assign students to classes
❌ Create or edit subjects
❌ Approve user registrations
❌ Access admin functions
❌ Delete students or classes

---

## 📱 QUICK REFERENCE

### Common Tasks:

**Mark Today's Attendance:**
1. Dashboard → Mark Attendance
2. Select class
3. Mark absent students
4. Submit

**Create Assignment:**
1. Dashboard → Create Assignment
2. Fill form (title, description, class, due date)
3. Submit

**Grade Submissions:**
1. Dashboard → My Assignments
2. Click "Grade" on assignment
3. Enter marks for each submission
4. Save

**View Class Students:**
1. Dashboard → View Classes
2. Click on class card
3. See student list

---

## 🎯 BEST PRACTICES

### Attendance:
- Mark attendance daily
- Mark as soon as class starts
- Add notes for late arrivals
- Review past attendance regularly

### Assignments:
- Set clear due dates
- Provide detailed instructions
- Grade submissions promptly
- Give constructive feedback

### Results:
- Enter results within 1 week of assessment
- Double-check marks before submitting
- Keep assessment records organized
- Communicate results to students

### Communication:
- Respond to student messages promptly
- Keep parents informed of progress
- Report issues to admin
- Update profile information

---

## 🆘 TROUBLESHOOTING

### "No classes assigned"
**Solution:** Contact admin to assign you to classes via teacher-subject-class assignments.

### "Failed to load classes"
**Possible causes:**
1. Backend server not running
2. Database connection issue
3. No teacher_subjects records
**Solution:** Check backend logs, verify database, run seeder

### "Cannot mark attendance"
**Possible causes:**
1. Not assigned to the class
2. Date is in the future
3. Attendance already marked for that date
**Solution:** Verify class assignment, check date, view existing records

### "Assignment creation failed"
**Possible causes:**
1. Missing required fields
2. Invalid due date (past date)
3. Class not assigned to you
**Solution:** Fill all required fields, check date, verify class assignment

---

## 📊 SYSTEM ARCHITECTURE

### Database Tables Used:
- `users` - Teacher account
- `teachers` - Teacher profile
- `teacher_subjects` - Class assignments
- `class_rooms` - Classes
- `subjects` - Subjects
- `students` - Student records
- `attendances` - Attendance records
- `assignments` - Assignment records
- `assignment_submissions` - Student submissions
- `results` - Grade records

### API Endpoints Used:
- `GET /api/my-classes` - Get teacher's classes
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `GET /api/teacher/assignments` - Get assignments
- `POST /api/assignments` - Create assignment
- `GET /api/results` - Get results
- `POST /api/results` - Enter results

---

## 🎓 TEACHER DASHBOARD SUMMARY

```
┌─────────────────────────────────────────────────────┐
│           TEACHER DASHBOARD                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📊 STATISTICS                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │  5   │ │  150 │ │  12  │ │  8   │              │
│  │Classes│ │Students│ │Assign│ │Pending│            │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│  🏫 MY CLASSES              📝 RECENT ASSIGNMENTS   │
│  ┌─────────────────┐       ┌─────────────────┐    │
│  │ Grade 9A - Math │       │ Chapter 5 HW    │    │
│  │ 30 students     │       │ Due: Mar 20     │    │
│  └─────────────────┘       │ 15/30 submitted │    │
│  ┌─────────────────┐       └─────────────────┘    │
│  │ Grade 9B - Math │       ┌─────────────────┐    │
│  │ 28 students     │       │ Midterm Prep    │    │
│  └─────────────────┘       │ Due: Mar 25     │    │
│                            └─────────────────┘    │
│                                                     │
│  ⚡ QUICK ACTIONS                                   │
│  [Create Assignment] [Mark Attendance]             │
│  [Enter Results]     [View Classes]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

**Last Updated:** March 13, 2026
**System Version:** 1.0
**For Support:** Contact system administrator
