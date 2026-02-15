# Exams & Tests Management Feature Guide

**Feature**: Exams & Tests Management System  
**Status**: ✅ FULLY IMPLEMENTED  
**Date**: February 9, 2026

---

## Overview

The Exams & Tests Management system provides a comprehensive solution for creating exams, scheduling them for classes, entering results, and viewing performance. It supports multiple exam types and automatic grade calculation.

---

## Features

### For Admins
- **Create Exams**: Define exams with type, academic year, and term
- **Manage Exam Schedules**: Schedule exams for specific classes and subjects
- **Set Exam Details**: Configure date, time, room, and total marks
- **View All Exams**: Monitor all exams across the school

### For Teachers
- **View Exam Schedule**: See all exams for their subjects
- **Enter Results**: Input marks for students with auto-grade calculation
- **Add Remarks**: Provide feedback on student performance
- **Update Results**: Modify existing results if needed

### For Students
- **View Exam Schedule**: See upcoming exams with dates and times
- **View Results**: Check marks and grades for completed exams
- **Track Performance**: Monitor academic progress across subjects

### For Parents
- **View Child's Schedule**: See exam timetable for their children
- **View Child's Results**: Check marks, grades, and teacher remarks
- **Monitor Progress**: Track academic performance over time

---

## Database Structure

### Exams Table
```sql
- id: Primary key
- name: Exam name (e.g., "Mid-term Exam 2026")
- exam_type: Type (midterm, final, quiz, test)
- academic_year: Year (e.g., "2025-2026")
- term: Term number (1, 2, or 3)
- start_date: Exam period start date
- end_date: Exam period end date
- created_at, updated_at: Timestamps
```

### Exam Schedules Table
```sql
- id: Primary key
- exam_id: Foreign key to exams table
- subject_id: Foreign key to subjects table
- class_id: Foreign key to class_rooms table
- exam_date: Specific exam date
- start_time: Exam start time
- end_time: Exam end time
- room_number: Exam room (optional)
- total_marks: Maximum marks for this exam
- created_at, updated_at: Timestamps
```

### Exam Results Table
```sql
- id: Primary key
- exam_schedule_id: Foreign key to exam_schedules table
- student_id: Foreign key to students table
- marks_obtained: Marks scored by student
- grade: Auto-calculated grade (A+, A, B+, B, C+, C, D, F)
- remarks: Teacher's comments (optional)
- created_at, updated_at: Timestamps
- Unique constraint: (exam_schedule_id, student_id)
```

---

## API Endpoints

### Admin Endpoints

**Get All Exams**
```
GET /api/exams
```

**Create Exam**
```
POST /api/exams
Body: {
  "name": "Mid-term Exam 2026",
  "exam_type": "midterm",
  "academic_year": "2025-2026",
  "term": "1",
  "start_date": "2026-03-01",
  "end_date": "2026-03-15"
}
```

**Update Exam**
```
PUT /api/exams/{id}
```

**Delete Exam**
```
DELETE /api/exams/{id}
```

**Get Exam Schedules**
```
GET /api/exams/{examId}/schedules
```

**Create Exam Schedule**
```
POST /api/exam-schedules
Body: {
  "exam_id": 1,
  "subject_id": 1,
  "class_id": 1,
  "exam_date": "2026-03-05",
  "start_time": "09:00",
  "end_time": "11:00",
  "room_number": "Room 101",
  "total_marks": 100
}
```

**Update Exam Schedule**
```
PUT /api/exam-schedules/{id}
```

**Delete Exam Schedule**
```
DELETE /api/exam-schedules/{id}
```

### Teacher Endpoints

**Get My Exam Schedules**
```
GET /api/my-exam-schedules
```

**Get Students for Exam Schedule**
```
GET /api/exam-schedules/{scheduleId}/students
```

**Save Exam Result**
```
POST /api/exam-results
Body: {
  "exam_schedule_id": 1,
  "student_id": 1,
  "marks_obtained": 85,
  "remarks": "Good performance"
}
```

### Student Endpoints

**Get My Exam Schedules**
```
GET /api/my-exam-schedules
```

**Get My Exam Results**
```
GET /api/my-exam-results
```

### Parent Endpoints

**Get Child's Exam Schedules**
```
GET /api/child-exam-schedules/{studentId}
```

**Get Child's Exam Results**
```
GET /api/child-exam-results/{studentId}
```

---

## Grading System

The system uses automatic grade calculation based on percentage:

| Grade | Percentage Range |
|-------|-----------------|
| A+    | 90-100%         |
| A     | 80-89%          |
| B+    | 75-79%          |
| B     | 70-74%          |
| C+    | 65-69%          |
| C     | 60-64%          |
| D     | 50-59%          |
| F     | Below 50%       |

**Formula**: `percentage = (marks_obtained / total_marks) × 100`

---

## User Interface

### Admin Interface

**Exams Management** (`/admin/exams`)
- Grid view of all exams
- Create/Edit/Delete exams
- View exam details (type, year, term, dates)
- Access schedule management for each exam

**Exam Schedule Management** (`/admin/exams/[id]/schedule`)
- Table view of all schedules for an exam
- Create/Edit/Delete schedules
- Set class, subject, date, time, room, and marks
- Prevent scheduling conflicts

### Teacher Interface

**My Exams** (`/teacher/exams`)
- View all exam schedules for teacher's subjects
- Grouped by exam name
- See date, time, class, subject, and room
- Access results entry for each schedule

**Enter Results** (`/teacher/exams/[id]/results`)
- Table view of all students in the class
- Input marks for each student
- Auto-calculated grade display
- Add optional remarks
- Save results individually
- Update existing results

### Student Interface

**My Exams** (`/student/exams`)
- Two tabs: Schedule and Results
- **Schedule Tab**: View upcoming exams with details
- **Results Tab**: View marks, grades, and remarks
- Color-coded grade badges

### Parent Interface

**Child's Exams** (`/parent/exams`)
- Select child from dropdown
- Two tabs: Schedule and Results
- **Schedule Tab**: View child's exam timetable
- **Results Tab**: View child's marks and grades
- Monitor academic performance

---

## How to Use

### As an Admin

**Creating an Exam:**
1. Navigate to "Exams" in the sidebar
2. Click "Create Exam" button
3. Fill in exam details:
   - Name (e.g., "Mid-term Exam 2026")
   - Type (Midterm, Final, Quiz, Test)
   - Academic Year (e.g., "2025-2026")
   - Term (1, 2, or 3)
   - Start and End dates
4. Click "Create"

**Creating Exam Schedule:**
1. Click "Manage Schedule" on an exam card
2. Click "Add Schedule" button
3. Fill in schedule details:
   - Select Class
   - Select Subject
   - Set Exam Date
   - Set Start and End Time
   - Enter Room Number (optional)
   - Set Total Marks
4. Click "Create"

### As a Teacher

**Viewing Exam Schedule:**
1. Navigate to "Exams" in the sidebar
2. View all your exam schedules grouped by exam
3. See date, time, class, subject, and room information

**Entering Results:**
1. Click "Enter Results" on an exam schedule
2. For each student:
   - Enter marks obtained (0 to total marks)
   - Grade is calculated automatically
   - Add remarks (optional)
   - Click "Save" button
3. Results are saved individually per student
4. You can update results later if needed

### As a Student

**Viewing Exam Schedule:**
1. Navigate to "Exams" in the sidebar
2. Click "Exam Schedule" tab
3. View all upcoming exams with:
   - Exam name and type
   - Subject
   - Date and time
   - Room number
   - Total marks

**Viewing Results:**
1. Navigate to "Exams" in the sidebar
2. Click "My Results" tab
3. View your results with:
   - Exam name and type
   - Subject
   - Marks obtained
   - Grade (color-coded)
   - Teacher's remarks

### As a Parent

**Viewing Child's Exams:**
1. Navigate to "Exams" in the sidebar
2. Select your child from the dropdown
3. Switch between Schedule and Results tabs
4. Monitor your child's exam performance

---

## Features in Detail

### Exam Types

The system supports four exam types:
- **Midterm**: Mid-semester examinations
- **Final**: End-of-term examinations
- **Quiz**: Short assessments
- **Test**: Regular tests

### Academic Year & Term

- Academic Year: Format "YYYY-YYYY" (e.g., "2025-2026")
- Term: 1, 2, or 3 (representing three terms per year)

### Automatic Grade Calculation

- Grades are calculated automatically when marks are entered
- Based on percentage of marks obtained
- Consistent grading across all subjects
- No manual grade entry required

### Result Updates

- Teachers can update results after initial entry
- Unique constraint prevents duplicate results
- System uses "update or create" logic
- Changes are reflected immediately

### Color-Coded Grades

- **Green**: A+, A (Excellent)
- **Blue**: B+, B (Good)
- **Yellow**: C+, C (Average)
- **Orange**: D (Below Average)
- **Red**: F (Fail)

---

## Testing the Feature

### Test Scenario 1: Admin Creates Exam

1. Login as admin
2. Go to Exams page
3. Click "Create Exam"
4. Fill in details:
   - Name: "Mid-term Exam 2026"
   - Type: Midterm
   - Academic Year: "2025-2026"
   - Term: 1
   - Dates: March 1-15, 2026
5. Verify exam appears in list

### Test Scenario 2: Admin Creates Schedule

1. Click "Manage Schedule" on exam
2. Click "Add Schedule"
3. Select:
   - Class: Grade 9 - A
   - Subject: Mathematics
   - Date: March 5, 2026
   - Time: 09:00 - 11:00
   - Room: Room 101
   - Total Marks: 100
4. Verify schedule appears in table

### Test Scenario 3: Teacher Enters Results

1. Login as teacher
2. Go to Exams page
3. Click "Enter Results" on a schedule
4. For first student:
   - Enter marks: 85
   - Verify grade shows "A"
   - Add remarks: "Good performance"
   - Click "Save"
5. Verify success message

### Test Scenario 4: Student Views Results

1. Login as student
2. Go to Exams page
3. Click "My Results" tab
4. Verify results show:
   - Exam name
   - Subject
   - Marks: 85/100
   - Grade: A (green badge)
   - Remarks

### Test Scenario 5: Parent Views Child's Results

1. Login as parent
2. Go to Exams page
3. Select child from dropdown
4. Click "Results" tab
5. Verify child's results display correctly

---

## Troubleshooting

### Issue: Exams not loading
**Solution**: Check if migrations ran successfully. Run `php artisan migrate` in backend.

### Issue: Cannot create schedule
**Solution**: Verify that classes and subjects exist in the database.

### Issue: Grade not calculating
**Solution**: Ensure marks_obtained and total_marks are valid numbers. Grade is calculated automatically on save.

### Issue: Results not saving
**Solution**: Check that exam_schedule_id and student_id are valid. Unique constraint prevents duplicates.

### Issue: Teacher cannot see exams
**Solution**: Verify teacher is assigned to subjects. Only exams for assigned subjects appear.

### Issue: Student cannot see results
**Solution**: Results only appear after teacher enters them. Check if results have been published.

---

## Future Enhancements

Potential improvements for future versions:

1. **Bulk Result Entry**: Upload results via CSV/Excel
2. **Result Publishing**: Control when results become visible to students
3. **Report Cards**: Generate PDF report cards
4. **Performance Analytics**: Charts and graphs for performance trends
5. **Exam Notifications**: Email/SMS alerts for upcoming exams
6. **Result Comparison**: Compare performance across terms
7. **Class Rankings**: Show class position/rank
8. **Subject-wise Analysis**: Detailed subject performance reports
9. **Attendance Integration**: Link attendance with exam eligibility
10. **Exam Seating Arrangement**: Auto-generate seating plans

---

## Technical Notes

### Frontend
- Built with React and Next.js
- Dynamic routing for exam schedules and results
- Auto-grade calculation in UI
- Color-coded grade badges
- Responsive tables for all screen sizes

### Backend
- Laravel API with Eloquent ORM
- Three-table structure (exams, schedules, results)
- Automatic grade calculation in model
- Unique constraint on results
- Role-based access control

### Security
- Authentication required for all endpoints
- Role-based authorization
- Teachers can only access their subjects
- Students can only see their own results
- Parents can only see their children's data

### Performance
- Indexed columns for faster queries
- Eager loading of relationships
- Efficient database queries
- Pagination support (can be added)

---

## Files Created/Modified

### Backend
- `database/migrations/2026_02_09_120000_create_exams_table.php`
- `database/migrations/2026_02_09_120001_create_exam_schedules_table.php`
- `database/migrations/2026_02_09_120002_create_exam_results_table.php`
- `app/Models/Exam.php`
- `app/Models/ExamSchedule.php`
- `app/Models/ExamResult.php`
- `app/Http/Controllers/Api/ExamController.php`
- `routes/api.php` (added exam routes)

### Frontend
- `src/app/admin/exams/page.jsx`
- `src/app/admin/exams/[id]/schedule/page.jsx`
- `src/app/teacher/exams/page.jsx`
- `src/app/teacher/exams/[id]/results/page.jsx`
- `src/app/student/exams/page.jsx`
- `src/app/parent/exams/page.jsx`
- `src/components/layout/Sidebar.jsx` (added Exams links)

### Documentation
- `EXAMS_FEATURE_GUIDE.md` (this file)
- `MODULES_STATUS.md` (updated)

---

## Support

For issues or questions:
1. Check this guide first
2. Review API endpoint responses
3. Check browser console for errors
4. Verify database migrations
5. Test with different user roles

---

**Last Updated**: February 9, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
