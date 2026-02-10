# Tereta High School Management System - Complete Setup Guide

## Overview
This guide walks you through setting up the complete system from scratch, including creating classes, subjects, students, teachers, and enabling attendance marking.

---

## Prerequisites

✅ Backend server running: `php artisan serve` (port 8000)
✅ Frontend server running: `npm run dev` (port 3000)
✅ Database configured and migrated
✅ Admin account created

---

## Step-by-Step Setup Process

### STEP 1: Login as Admin

1. Go to `http://localhost:3000/login`
2. Login with admin credentials:
   - **Email:** `admin@hsms.com`
   - **Password:** `password`

---

### STEP 2: Create Classes

**Purpose:** Classes are where students are grouped (e.g., Grade 9A, Grade 10B)

1. Navigate to **Admin → Classes**
2. Click **"Add New Class"** button
3. Fill in the form:
   - **Name:** Grade 9
   - **Section:** A
   - **Capacity:** 40
   - **Room Number:** 101
4. Click **"Add Class"**

**Repeat for multiple classes:**
- Grade 9A (Room 101)
- Grade 9B (Room 102)
- Grade 10A (Room 201)
- Grade 10B (Room 202)
- Grade 11A (Room 301)
- Grade 12A (Room 401)

✅ **Result:** Classes created in `class_rooms` table

---

### STEP 3: Create Subjects

**Purpose:** Subjects are the courses taught in school

1. Navigate to **Admin → Subjects**
2. Click **"Add New Subject"** button
3. Fill in the form:
   - **Name:** Mathematics
   - **Code:** MATH101
   - **Description:** Basic Mathematics
   - **Credits:** 4
4. Click **"Add Subject"**

**Repeat for multiple subjects:**
- Mathematics (MATH101)
- English (ENG101)
- Science (SCI101)
- History (HIST101)
- Physics (PHY101)
- Chemistry (CHEM101)
- Biology (BIO101)
- Computer Science (CS101)

✅ **Result:** Subjects created in `subjects` table

---

### STEP 4: Add Students

**Purpose:** Students who will attend classes

**Option A: Admin Creates Students**

1. Navigate to **Admin → Students**
2. Click **"Add New Student"** button
3. Fill in the form:
   - **Name:** John Doe
   - **Email:** john.doe@student.teretahs.edu
   - **Password:** password123
   - **Grade:** 9
   - **Class:** Grade 9A ← **IMPORTANT: Must select a class!**
   - **Date of Birth:** 2010-01-15
   - **Address:** 123 Main St
   - **Guardian Name:** Jane Doe
   - **Guardian Phone:** +1234567890
4. Click **"Add Student"**

**Option B: Students Self-Register**

1. Students go to `http://localhost:3000/register`
2. Select **"Student"** role
3. Fill in registration form
4. **Note:** Admin must later assign them to a class via Admin → Students → Edit

**Create at least 5-10 students for testing:**
- John Doe (Grade 9A)
- Jane Smith (Grade 9A)
- Mike Johnson (Grade 9B)
- Sarah Williams (Grade 10A)
- Tom Brown (Grade 10A)

✅ **Result:** Students created in `students` table with `class_id` assigned

---

### STEP 5: Add Teachers

**Purpose:** Teachers who will teach subjects and mark attendance

**Option A: Admin Creates Teachers**

1. Navigate to **Admin → Teachers**
2. Click **"Add New Teacher"** button
3. Fill in the form:
   - **Name:** Prof. Robert Smith
   - **Email:** robert.smith@teretahs.edu
   - **Password:** teacher123
   - **Subject Specialization:** Mathematics
   - **Qualification:** M.Sc. Mathematics
   - **Experience Years:** 5-10 years
   - **Hire Date:** 2020-01-15
4. Click **"Add Teacher"**

**Option B: Teachers Self-Register**

1. Teachers go to `http://localhost:3000/register`
2. Select **"Teacher"** role
3. Fill in registration form

**Create multiple teachers:**
- Prof. Robert Smith (Mathematics)
- Prof. Emily Johnson (English)
- Prof. David Lee (Science)
- Prof. Maria Garcia (History)

✅ **Result:** Teachers created in `teachers` table

---

### STEP 6: Assign Teachers to Classes & Subjects

**Purpose:** Link teachers to the classes and subjects they teach

**This is the CRITICAL step for attendance marking!**

1. Navigate to **Admin → Teachers**
2. Find a teacher (e.g., Prof. Robert Smith)
3. Click the green **"Assign"** button next to their name
4. In the assignment modal:
   - **Teacher:** Prof. Robert Smith (auto-filled)
   - **Class:** Select "Grade 9A"
   - **Subject:** Select "Mathematics"
5. Click **"Assign"**

**Repeat for multiple assignments:**

**Prof. Robert Smith (Mathematics):**
- Grade 9A - Mathematics
- Grade 9B - Mathematics
- Grade 10A - Mathematics

**Prof. Emily Johnson (English):**
- Grade 9A - English
- Grade 9B - English

**Prof. David Lee (Science):**
- Grade 10A - Science
- Grade 10B - Science

✅ **Result:** Teacher assignments created in `teacher_subjects` table

---

### STEP 7: Verify Setup (Admin Dashboard)

1. Go to **Admin → Dashboard**
2. Check the statistics:
   - **Total Students:** Should show your student count
   - **Total Teachers:** Should show your teacher count
   - **Total Classes:** Should show your class count
   - **Total Subjects:** Should show your subject count

---

### STEP 8: Test Teacher Workflow

**Login as Teacher:**

1. Logout from admin account
2. Login as teacher:
   - **Email:** `robert.smith@teretahs.edu`
   - **Password:** `teacher123`

**View Assigned Classes:**

1. Navigate to **Teacher → My Classes**
2. You should see:
   - Grade 9A - Mathematics
   - Grade 9B - Mathematics
   - Grade 10A - Mathematics
3. Each class should show the number of students enrolled

**Mark Attendance:**

1. Navigate to **Teacher → Mark Attendance**
2. Select:
   - **Class:** Grade 9A
   - **Subject:** Mathematics
   - **Date:** Today's date
3. Click **"Load Students"**
4. You should see a list of all students in Grade 9A
5. Mark each student as:
   - ✅ Present
   - ❌ Absent
   - ⏰ Late
   - 📝 Excused
6. Add remarks if needed
7. Click **"Submit Attendance"**

✅ **Result:** Attendance records created in `attendances` table

**Enter Results/Grades:**

1. Navigate to **Teacher → Enter Results**
2. Select:
   - **Class:** Grade 9A
   - **Subject:** Mathematics
3. Click **"Load Students"**
4. For each student, enter:
   - **Exam Type:** Midterm/Final/Quiz
   - **Marks:** Score obtained (e.g., 85)
   - **Total Marks:** Maximum score (e.g., 100)
   - **Grade:** Letter grade (A/B/C/D/F)
   - **Remarks:** Teacher's comments
5. Click **"Submit Results"**

✅ **Result:** Results created in `results` table

---

### STEP 9: Test Student Workflow

**Login as Student:**

1. Logout from teacher account
2. Login as student:
   - **Name:** John Doe
   - **Student ID:** STU20260001 (check email for actual ID)

**View Attendance:**

1. Navigate to **Student → My Attendance**
2. You should see all attendance records marked by teachers
3. View attendance percentage

**View Results:**

1. Navigate to **Student → My Results**
2. You should see all grades entered by teachers
3. View average grade

---

### STEP 10: Test Parent Workflow

**Create Parent Account:**

1. Go to `http://localhost:3000/register`
2. Select **"Parent"** role
3. Fill in:
   - **Name:** Jane Doe
   - **Email:** jane.doe@parent.com
   - **Phone:** +1234567890
   - **Address:** 123 Main St
   - **Password:** parent123

**Link Parent to Student (Admin):**

1. Login as admin
2. Navigate to **Admin → Parents**
3. Find the parent (Jane Doe)
4. Click **"Link Children"** or edit parent
5. Select student(s) to link (John Doe)
6. Save

**Login as Parent:**

1. Login with parent credentials
2. Navigate to **Parent → My Children**
3. View linked children
4. Navigate to **Parent → Attendance Reports**
5. View children's attendance
6. Navigate to **Parent → Results Reports**
7. View children's grades

---

## Quick Reference: Required Data Flow

```
1. Admin creates Classes
   ↓
2. Admin creates Subjects
   ↓
3. Admin creates Students (with class_id assigned)
   ↓
4. Admin creates Teachers
   ↓
5. Admin assigns Teachers to Classes & Subjects
   ↓
6. Teacher can now:
   - View assigned classes
   - Mark attendance for students in those classes
   - Enter results/grades for students
   ↓
7. Students can view:
   - Their attendance records
   - Their grades/results
   ↓
8. Parents can view:
   - Their children's attendance
   - Their children's grades
```

---

## Common Issues & Solutions

### Issue 1: Teacher can't see any classes

**Problem:** Teacher not assigned to any class/subject

**Solution:**
1. Login as admin
2. Go to Admin → Teachers
3. Click "Assign" next to the teacher
4. Assign them to at least one class and subject

---

### Issue 2: No students appear when marking attendance

**Problem:** No students enrolled in the selected class

**Solution:**
1. Login as admin
2. Go to Admin → Students
3. Edit each student and assign them to a class
4. Make sure the `class_id` field is set

---

### Issue 3: Student can't see attendance/results

**Problem:** No attendance/results have been entered yet

**Solution:**
1. Login as teacher
2. Mark attendance for the student's class
3. Enter results for the student's class

---

### Issue 4: Parent can't see children

**Problem:** Parent not linked to any students

**Solution:**
1. Login as admin
2. Go to Admin → Parents
3. Link the parent to their children using the parent-student relationship

---

## Test Accounts

After setup, you should have these test accounts:

**Admin:**
- Email: `admin@hsms.com`
- Password: `password`

**Teacher:**
- Email: `robert.smith@teretahs.edu`
- Password: `teacher123`

**Student:**
- Name: `John Doe`
- Student ID: `STU20260001` (check email)

**Parent:**
- Email: `jane.doe@parent.com`
- Password: `parent123`

---

## Database Verification

You can verify the setup by checking these tables:

```sql
-- Check classes
SELECT * FROM class_rooms;

-- Check subjects
SELECT * FROM subjects;

-- Check students with their classes
SELECT s.*, c.name as class_name, c.section 
FROM students s 
LEFT JOIN class_rooms c ON s.class_id = c.id;

-- Check teachers
SELECT * FROM teachers;

-- Check teacher assignments
SELECT t.id, u.name as teacher_name, c.name as class_name, 
       c.section, s.name as subject_name
FROM teacher_subjects ts
JOIN teachers t ON ts.teacher_id = t.id
JOIN users u ON t.user_id = u.id
JOIN class_rooms c ON ts.class_id = c.id
JOIN subjects s ON ts.subject_id = s.id;

-- Check attendance records
SELECT a.*, u.name as student_name, c.name as class_name, 
       s.name as subject_name
FROM attendances a
JOIN students st ON a.student_id = st.id
JOIN users u ON st.user_id = u.id
JOIN class_rooms c ON a.class_id = c.id
JOIN subjects s ON a.subject_id = s.id;
```

---

## Next Steps

After completing this setup:

1. ✅ Test all user roles (Admin, Teacher, Student, Parent)
2. ✅ Mark attendance for multiple days
3. ✅ Enter results for different exam types
4. ✅ Generate reports
5. ✅ Test email notifications (if configured)
6. ✅ Test SMS notifications (if configured)

---

## Support

If you encounter any issues:

1. Check the browser console (F12) for errors
2. Check backend logs: `hsms-backend/storage/logs/laravel.log`
3. Verify database records using the SQL queries above
4. Ensure both servers are running
5. Clear browser cache and re-login

---

**System is now ready for use!** 🎉
