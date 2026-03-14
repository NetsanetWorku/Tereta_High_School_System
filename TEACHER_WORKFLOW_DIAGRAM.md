# Teacher Workflow - Visual Diagram

## 🎯 Complete Teacher Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN PAGE                              │
│                    http://localhost:3000/login                  │
│                                                                 │
│  Email: teacher@tereta.edu.et                                   │
│  Password: teacher123                                           │
│                                                                 │
│                    [Login Button]                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TEACHER DASHBOARD                            │
│                   /teacher (Main Hub)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 STATISTICS CARDS                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │    5     │ │   150    │ │    12    │ │    8     │          │
│  │ Classes  │ │ Students │ │Assignments│ │ Pending  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│  🏫 MY CLASSES              📝 RECENT ASSIGNMENTS               │
│  ┌─────────────────┐       ┌─────────────────┐                │
│  │ Grade 9A - Math │       │ Chapter 5 HW    │                │
│  │ 30 students     │       │ Due: Mar 20     │                │
│  │ [View Students] │       │ 15/30 submitted │                │
│  └─────────────────┘       │ [Grade]         │                │
│                            └─────────────────┘                │
│                                                                 │
│  ⚡ QUICK ACTIONS                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │ 📝 Create    │ │ 📅 Mark      │ │ 📊 Enter     │          │
│  │ Assignment   │ │ Attendance   │ │ Results      │          │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘          │
│         │                 │                 │                  │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          │                 │                 │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │           │    │           │    │           │
    │           │    │           │    │           │
```

---

## 📅 ATTENDANCE WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              ATTENDANCE RECORDS PAGE                            │
│              /teacher/attendance                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Statistics: Total Records: 450                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Student    │ Date       │ Status  │ Notes              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ John Doe   │ 2026-03-13 │ Present │ -                  │   │
│  │ Jane Smith │ 2026-03-13 │ Absent  │ Sick leave         │   │
│  │ Bob Wilson │ 2026-03-13 │ Present │ -                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                    [Mark Attendance]                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              MARK ATTENDANCE PAGE                               │
│              /teacher/attendance/mark                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: Select Class                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [Grade 9A - A (Mathematics)                        ▼]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  STEP 2: Select Date                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [2026-03-13                                        📅]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  STEP 3: Mark Students (30 students)                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ # │ ID    │ Name       │ Status                        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 1 │ S001  │ John Doe   │ ⚪Present ⚪Absent            │   │
│  │ 2 │ S002  │ Jane Smith │ ⚪Present ⚫Absent            │   │
│  │ 3 │ S003  │ Bob Wilson │ ⚪Present ⚪Absent            │   │
│  │ ... (27 more students)                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│              [Cancel]  [Mark Attendance]                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    ✅ Success!
                    Redirects to Attendance Records
```

---

## 📝 ASSIGNMENT WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              MY ASSIGNMENTS PAGE                                │
│              /teacher/assignments                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 [Search assignments...]                                     │
│                                                                 │
│  📊 Stats: Total: 12 | Active: 8 | Overdue: 2 | Pending: 15    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Title      │ Class  │ Due Date │ Status │ Submissions  │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Ch 5 HW    │ 9A     │ Mar 20   │ Active │ 15/30        │   │
│  │            │        │          │        │ [Grade][Edit]│   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Midterm    │ 9B     │ Mar 15   │Overdue │ 28/28        │   │
│  │            │        │          │        │ [Grade][Edit]│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                    [Create Assignment]                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              CREATE ASSIGNMENT PAGE                             │
│              /teacher/assignments/add                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Title *                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Chapter 5 Homework                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Description *                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Complete exercises 1-10 from textbook page 45          │   │
│  │ Show all work. Due by end of day.                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Class *              │  Subject (auto-filled)                  │
│  ┌──────────────────┐ │  ┌──────────────────┐                  │
│  │ Grade 9A - Math▼ │ │  │ Mathematics      │                  │
│  └──────────────────┘ │  └──────────────────┘                  │
│                                                                 │
│  Due Date *           │  Due Time                               │
│  ┌──────────────────┐ │  ┌──────────────────┐                  │
│  │ 2026-03-20   📅 │ │  │ 23:59        🕐 │                  │
│  └──────────────────┘ │  └──────────────────┘                  │
│                                                                 │
│  Total Marks *                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 50                                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Instructions (optional)                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Use pencil. Write neatly. Submit on time.              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│              [Cancel]  [Create Assignment]                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    ✅ Success!
                    Redirects to My Assignments
```

---

## 📊 RESULTS WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              MY RESULTS PAGE                                    │
│              /teacher/results                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Statistics: Total Results: 450                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Student    │ Subject │ Score │ Grade │ Date           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ John Doe   │ Math    │ 85    │ B     │ 2026-03-10     │   │
│  │ Jane Smith │ Math    │ 92    │ A     │ 2026-03-10     │   │
│  │ Bob Wilson │ Math    │ 78    │ C     │ 2026-03-10     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                    [Enter Results]                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              ENTER RESULTS PAGE                                 │
│              /teacher/results/add                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Assessment Name *    │  Assessment Type *                      │
│  ┌──────────────────┐ │  ┌──────────────────┐                  │
│  │ Chapter 5 Test   │ │  │ Test          ▼ │                  │
│  └──────────────────┘ │  └──────────────────┘                  │
│                                                                 │
│  Select Class *       │  Subject (auto-filled)                  │
│  ┌──────────────────┐ │  ┌──────────────────┐                  │
│  │ Grade 9A - Math▼ │ │  │ Mathematics      │                  │
│  └──────────────────┘ │  └──────────────────┘                  │
│                                                                 │
│  Date *               │  Total Marks *                          │
│  ┌──────────────────┐ │  ┌──────────────────┐                  │
│  │ 2026-03-13   📅 │ │  │ 100              │                  │
│  └──────────────────┘ │  └──────────────────┘                  │
│                                                                 │
│  Enter Marks for Students (30 students)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ # │ ID   │ Name       │ Marks Obtained │ Grade        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 1 │ S001 │ John Doe   │ [85    ] / 100 │ 🟢 B         │   │
│  │ 2 │ S002 │ Jane Smith │ [92    ] / 100 │ 🟢 A         │   │
│  │ 3 │ S003 │ Bob Wilson │ [78    ] / 100 │ 🟡 C         │   │
│  │ ... (27 more students)                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📊 Summary: Total Students: 30 | Marks Entered: 30/30          │
│                                                                 │
│              [Cancel]  [Save Results]                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    ✅ Success!
                    Redirects to My Results
```

---

## 🏫 CLASSES WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              MY CLASSES PAGE                                    │
│              /teacher/classes                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  Grade 9A        │  │  Grade 9B        │                    │
│  │  Mathematics     │  │  Mathematics     │                    │
│  │  Grade: 9        │  │  Grade: 9        │                    │
│  │  👨‍🎓 30 students  │  │  👨‍🎓 28 students  │                    │
│  │                  │  │                  │                    │
│  │ [View Students]  │  │ [View Students]  │                    │
│  └────────┬─────────┘  └──────────────────┘                    │
│           │                                                     │
└───────────┼─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│              CLASS STUDENTS PAGE                                │
│              /teacher/classes/[id]/students                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Grade 9A - Mathematics (30 students)                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ID   │ Name       │ Email          │ Phone      │ Actions│   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ S001 │ John Doe   │ john@email.com │ 0911234567 │ View  │   │
│  │ S002 │ Jane Smith │ jane@email.com │ 0911234568 │ View  │   │
│  │ S003 │ Bob Wilson │ bob@email.com  │ 0911234569 │ View  │   │
│  │ ... (27 more students)                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Quick Actions:                                                 │
│  [Mark Attendance] [Create Assignment] [Enter Results]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 COMPLETE DAILY WORKFLOW

```
8:00 AM - Login
    ↓
8:05 AM - Check Dashboard
    │     - View statistics
    │     - Check pending submissions
    │     - Review upcoming assignments
    ↓
8:15 AM - Mark Attendance (Class 1)
    │     - Select Grade 9A
    │     - Mark 2 students absent
    │     - Submit
    ↓
9:00 AM - Teach Class 1
    ↓
10:00 AM - Mark Attendance (Class 2)
    │      - Select Grade 9B
    │      - Mark 1 student absent
    │      - Submit
    ↓
11:00 AM - Teach Class 2
    ↓
12:00 PM - Lunch Break
    ↓
1:00 PM - Grade Submissions
    │     - Open "Chapter 4 HW"
    │     - Grade 15 submissions
    │     - Add feedback
    │     - Save grades
    ↓
2:00 PM - Create New Assignment
    │     - Title: "Chapter 6 Homework"
    │     - Due: Next week
    │     - Total marks: 50
    │     - Submit
    ↓
3:00 PM - Enter Test Results
    │     - Assessment: "Chapter 5 Test"
    │     - Enter marks for 30 students
    │     - Grades auto-calculated
    │     - Save results
    ↓
4:00 PM - Review Dashboard
    │     - Check all tasks completed
    │     - Review statistics
    │     - Plan tomorrow
    ↓
4:30 PM - Logout
```

---

## 📊 DATA FLOW

```
┌─────────────┐
│   TEACHER   │
└──────┬──────┘
       │
       ├─────────────────────────────────────────┐
       │                                         │
       ▼                                         ▼
┌─────────────┐                          ┌─────────────┐
│  FRONTEND   │                          │   BACKEND   │
│  (Next.js)  │◄────────────────────────►│  (Laravel)  │
│  Port 3000  │      API Requests        │  Port 9000  │
└─────────────┘                          └──────┬──────┘
                                                │
                                                ▼
                                         ┌─────────────┐
                                         │   DATABASE  │
                                         │   (MySQL)   │
                                         │  Port 3306  │
                                         └─────────────┘

API Endpoints Used:
- GET  /api/my-classes          → Get teacher's classes
- GET  /api/attendance          → Get attendance records
- POST /api/attendance          → Mark attendance
- GET  /api/teacher/assignments → Get assignments
- POST /api/assignments         → Create assignment
- GET  /api/results             → Get results
- POST /api/results             → Enter results
```

---

## 🎯 PERMISSION MATRIX

```
┌──────────────────────┬─────────┬─────────┬─────────┬─────────┐
│      Action          │ Teacher │ Student │ Parent  │  Admin  │
├──────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ View own classes     │    ✅   │    ❌   │    ❌   │    ✅   │
│ Mark attendance      │    ✅   │    ❌   │    ❌   │    ✅   │
│ Create assignments   │    ✅   │    ❌   │    ❌   │    ✅   │
│ Grade submissions    │    ✅   │    ❌   │    ❌   │    ✅   │
│ Enter results        │    ✅   │    ❌   │    ❌   │    ✅   │
│ View all classes     │    ❌   │    ❌   │    ❌   │    ✅   │
│ Assign teachers      │    ❌   │    ❌   │    ❌   │    ✅   │
│ View own results     │    ✅   │    ✅   │    ✅   │    ✅   │
│ Submit assignments   │    ❌   │    ✅   │    ❌   │    ❌   │
└──────────────────────┴─────────┴─────────┴─────────┴─────────┘
```

---

**Last Updated:** March 13, 2026
**Version:** 1.0
**For detailed instructions, see:** `TEACHER_WORKFLOW_GUIDE.md`
