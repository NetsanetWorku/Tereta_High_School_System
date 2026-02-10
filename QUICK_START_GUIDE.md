# Quick Start Guide - Tereta High School Management System

## System Overview

The Tereta High School Management System (HSMS) is a comprehensive web-based platform for managing all aspects of school operations including student records, attendance, results, timetables, exams, assignments, and parent-teacher communication.

## Current Status

✅ **22 Core Modules Fully Working** (79%)
⚠️ **2 Modules Partially Complete** (7%)
❌ **4 Future Modules** (14%)

---

## Quick Access

### URLs:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Login Page**: http://localhost:3000/login

### Test Accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@hsms.com | password | Full system access |
| Teacher | teacher@hsms.com | password | Classes, attendance, results |
| Student | student1@hsms.com | password | View attendance & results |
| Student | student2-12@hsms.com | password | View attendance & results |

---

## Starting the System

### Backend (Laravel):
```bash
cd hsms-backend
php artisan serve
```
Server runs on: http://localhost:8000

### Frontend (Next.js):
```bash
cd hsms-frontend
npm run dev
```
Server runs on: http://localhost:3000

---

## Core Features

### 1. Authentication & User Management
- Login/Register with email verification
- Role-based access (Admin, Teacher, Student, Parent)
- Profile management with picture upload
- Password reset

### 2. Admin Functions
- Manage students, teachers, parents
- Manage classes and subjects
- Assign teachers to classes/subjects
- Link parents to children
- Create timetables
- Create exams and schedules
- Monitor all system activities

### 3. Teacher Functions
- View assigned classes
- Mark attendance (Present/Absent/Late)
- Enter exam results with auto-grading
- View teaching timetable
- Create and manage assignments
- Grade student submissions
- Communicate with parents via messaging

### 4. Student Functions
- View class timetable
- View attendance records
- View exam results and grades
- View and submit assignments
- View parent-teacher conversations (read-only)
- View exam schedules

### 5. Parent Functions
- View children's information
- View children's attendance
- View children's results
- View children's timetable
- View children's exam schedules
- Communicate with teachers via messaging
- View children's assignments

---

## Key Features Explained

### Attendance System
**How it works:**
1. Teacher selects class and subject
2. System loads all students in that class
3. Teacher marks each student (Present/Absent/Late)
4. System saves attendance with date
5. Prevents duplicates (updates if already exists)

**Access:**
- Teachers: Mark attendance
- Students: View own attendance
- Parents: View children's attendance
- Admin: View all attendance

### Results System
**How it works:**
1. Teacher selects class and subject
2. System loads all students
3. Teacher enters marks (0-100)
4. System auto-calculates grade (A+, A, B+, B, C+, C, D, F)
5. System saves results
6. Prevents duplicates (updates if already exists)

**Grading Scale:**
- A+: 90-100
- A: 80-89
- B+: 75-79
- B: 70-74
- C+: 65-69
- C: 60-64
- D: 50-59
- F: Below 50

### Timetables
**How it works:**
1. Admin creates timetable entries
2. Specifies: Day, Time, Subject, Teacher, Class, Room
3. System prevents scheduling conflicts
4. All users view relevant timetables in weekly grid

**Access:**
- Admin: Create and manage all timetables
- Teachers: View teaching schedule
- Students: View class schedule
- Parents: View children's schedule

### Exams & Tests
**How it works:**
1. Admin creates exam (type: midterm, final, quiz, test)
2. Admin creates exam schedules for classes/subjects
3. Teachers enter exam results
4. System auto-calculates grades
5. Students and parents view schedules and results

**Exam Types:**
- Midterm Exam
- Final Exam
- Quiz
- Test

### Assignments
**How it works:**
1. Teacher creates assignment with title, description, due date
2. Students view assignments in their dashboard
3. Students submit work (text or file)
4. Teacher grades submissions
5. Parents track progress

**Features:**
- Due date tracking
- Late submission detection
- Status indicators (pending, submitted, graded)
- File upload support

### Parent-Teacher Communication
**How it works:**
1. Parent starts conversation with teacher
2. Parent can link conversation to specific child
3. Both parties exchange messages
4. Real-time updates (5-second polling)
5. Unread message tracking
6. Conversation can be closed when resolved

**Access:**
- Parents: Start conversations, send messages
- Teachers: Reply to messages, close conversations
- Students: View conversations (read-only)
- Admin: Monitor all conversations (read-only)

---

## Reports & Analytics (Backend Ready)

### Available Reports (API):

1. **Dashboard Statistics**
   - Endpoint: `GET /api/reports/dashboard-stats`
   - Returns: Total counts, today's attendance, recent results

2. **Student Performance**
   - Endpoint: `GET /api/reports/student/{studentId}`
   - Returns: Average marks, attendance %, subject breakdown

3. **Class Performance**
   - Endpoint: `GET /api/reports/class/{classId}`
   - Returns: Class average, top performers, subject analysis

4. **Attendance Report**
   - Endpoint: `GET /api/reports/attendance?start_date=&end_date=&class_id=`
   - Returns: Attendance statistics with filters

5. **Results Report**
   - Endpoint: `GET /api/reports/results?class_id=&subject_id=`
   - Returns: Grade distribution, pass/fail stats

6. **Teacher Performance**
   - Endpoint: `GET /api/reports/teacher/{teacherId}`
   - Returns: Assignments, workload, students taught

**Note**: Frontend dashboard pages need to be created to visualize these reports.

---

## SMS Notifications (Infrastructure Ready)

### Current Setup:
- SMS channel configured
- Development mode: Messages logged to `storage/logs/laravel.log`
- Production ready: Twilio integration prepared

### Checking SMS Logs:
```bash
# Windows
type hsms-backend\storage\logs\laravel.log | findstr "SMS NOTIFICATION"
```

### Production Setup:
1. Install Twilio: `composer require twilio/sdk`
2. Add to `.env`:
   ```
   TWILIO_SID=your_account_sid
   TWILIO_TOKEN=your_auth_token
   TWILIO_FROM=+1234567890
   ```
3. Uncomment Twilio code in `app/Channels/SmsChannel.php`

---

## Database Structure

### Main Tables:
- `users` - All system users
- `students` - Student profiles
- `teachers` - Teacher profiles
- `parents` - Parent profiles
- `class_rooms` - Classes (Grade 9-12, sections A-C)
- `subjects` - Subjects (Math, English, Science, etc.)
- `teacher__subjects` - Teacher-class-subject assignments
- `parent_student` - Parent-child relationships
- `attendances` - Attendance records
- `results` - Exam results
- `timetables` - Class schedules
- `exams` - Exam definitions
- `exam_schedules` - Exam timetables
- `exam_results` - Exam marks
- `assignments` - Homework assignments
- `assignment_submissions` - Student submissions
- `conversations` - Parent-teacher conversations
- `messages` - Conversation messages

---

## Common Tasks

### Adding a New Student:
1. Login as admin
2. Go to "Students" page
3. Click "Add Student"
4. Fill in details (name, email, class, etc.)
5. Click "Save"

### Marking Attendance:
1. Login as teacher
2. Go to "Mark Attendance"
3. Select class and subject
4. Mark each student (Present/Absent/Late)
5. Click "Save Attendance"

### Entering Results:
1. Login as teacher
2. Go to "Enter Results"
3. Select class and subject
4. Enter marks for each student
5. Grade auto-calculates
6. Click "Save" for each student

### Starting a Conversation (Parent):
1. Login as parent
2. Go to "Messages"
3. Click "New Conversation"
4. Select teacher and optionally a child
5. Enter subject and first message
6. Click "Start Conversation"

### Creating an Exam:
1. Login as admin
2. Go to "Exams"
3. Click "Create Exam"
4. Fill in exam details (name, type, year, term)
5. Click "Create"
6. Click "Schedule" to add exam schedules for classes

---

## Troubleshooting

### Backend Issues:

**Database Connection Error:**
```bash
cd hsms-backend
php artisan config:clear
php artisan cache:clear
```

**Migration Issues:**
```bash
php artisan migrate:fresh --seed
```
⚠️ Warning: This will delete all data!

**Route Not Found:**
```bash
php artisan route:clear
php artisan route:cache
```

### Frontend Issues:

**API Connection Error:**
- Check `.env.local` has correct API URL
- Verify backend is running on port 8000
- Check CORS settings in `hsms-backend/config/cors.php`

**Login Issues:**
- Clear browser cache and cookies
- Check if email is verified
- Verify credentials are correct

**Page Not Loading:**
```bash
cd hsms-frontend
npm run dev
```

---

## File Structure

### Backend (Laravel):
```
hsms-backend/
├── app/
│   ├── Http/Controllers/Api/  # API controllers
│   ├── Models/                # Database models
│   ├── Channels/              # SMS channel
│   └── Notifications/         # SMS notifications
├── database/
│   └── migrations/            # Database migrations
├── routes/
│   └── api.php               # API routes
└── storage/logs/             # Log files
```

### Frontend (Next.js):
```
hsms-frontend/
├── src/
│   ├── app/                  # Pages (admin, teacher, student, parent)
│   ├── components/           # Reusable components
│   ├── hooks/                # Custom hooks (useAuth, useApi)
│   └── lib/                  # Utilities
└── public/                   # Static files
```

---

## Documentation Files

| File | Description |
|------|-------------|
| `SYSTEM_SETUP_GUIDE.md` | Initial setup instructions |
| `USER_GUIDE.md` | Detailed user manual |
| `MODULES_STATUS.md` | Complete module status |
| `QUICK_START_GUIDE.md` | This file |
| `TIMETABLE_FEATURE_GUIDE.md` | Timetable system guide |
| `EXAMS_FEATURE_GUIDE.md` | Exams system guide |
| `MESSAGING_FEATURE_GUIDE.md` | Messaging system guide |
| `REPORTS_AND_SMS_GUIDE.md` | Reports and SMS guide |
| `FEATURES_IMPLEMENTATION_PLAN.md` | Future features plan |
| `DATABASE_RELATIONSHIPS.md` | Database schema |
| `IMPLEMENTATION_SUMMARY.md` | Recent changes summary |

---

## Support

For issues or questions:
1. Check the relevant documentation file
2. Review the troubleshooting section
3. Check `storage/logs/laravel.log` for backend errors
4. Check browser console for frontend errors

---

## Next Steps

### For Developers:
1. Create frontend pages for Reports & Analytics
2. Add SMS notification triggers
3. Implement Announcements system
4. Add Fee Management module

### For Users:
1. Start using the system with test accounts
2. Add real student/teacher/parent data
3. Test all features thoroughly
4. Provide feedback for improvements

---

**System Version**: 1.0
**Last Updated**: February 9, 2026
**Status**: Production Ready (Core Features)
