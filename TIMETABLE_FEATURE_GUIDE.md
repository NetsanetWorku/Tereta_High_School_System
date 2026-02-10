# Timetable Feature - Implementation Guide

**Date**: February 9, 2026  
**Status**: ✅ FULLY IMPLEMENTED

---

## Overview

The Timetable feature allows schools to manage class schedules for all classes, teachers, students, and parents. It provides a weekly view of all scheduled classes with time slots, subjects, teachers, and room assignments.

---

## Features Implemented

### 1. Database Schema
- **Table**: `timetables`
- **Fields**:
  - `id`: Primary key
  - `class_id`: Foreign key to classes
  - `subject_id`: Foreign key to subjects
  - `teacher_id`: Foreign key to teachers
  - `day`: Enum (Monday-Sunday)
  - `start_time`: Time
  - `end_time`: Time
  - `room_number`: Optional room/location
  - `timestamps`: Created/updated timestamps

- **Constraints**:
  - Unique constraint on `[class_id, day, start_time]` to prevent overlapping schedules
  - Validation to ensure end_time is after start_time
  - Cascade delete when class, subject, or teacher is deleted

---

### 2. Backend API Endpoints

#### Admin Endpoints (Full CRUD)
- `GET /api/timetables` - Get all timetable entries
- `POST /api/timetables` - Create new timetable entry
- `PUT /api/timetables/{id}` - Update timetable entry
- `DELETE /api/timetables/{id}` - Delete timetable entry
- `GET /api/timetables/class/{classId}` - Get timetable for specific class

#### Teacher Endpoints
- `GET /api/my-timetable` - Get logged-in teacher's teaching schedule

#### Student Endpoints
- `GET /api/my-timetable` - Get logged-in student's class schedule

#### Parent Endpoints
- `GET /api/timetables/class/{classId}` - Get timetable for child's class

---

### 3. Frontend Pages

#### Admin - Timetable Management (`/admin/timetables`)
**Features**:
- View all timetables grouped by day
- Filter by class
- Add new schedule entries
- Edit existing entries
- Delete entries
- Validation for overlapping time slots
- Modal form for create/edit

**Fields in Form**:
- Class (dropdown)
- Subject (dropdown)
- Teacher (dropdown)
- Day (dropdown: Monday-Saturday)
- Start Time (time picker)
- End Time (time picker)
- Room Number (optional text)

#### Teacher - My Timetable (`/teacher/timetable`)
**Features**:
- View personal teaching schedule
- Grouped by day (Monday-Saturday)
- Shows: Time, Subject, Class, Room
- Color-coded cards for easy reading

#### Student - My Timetable (`/student/timetable`)
**Features**:
- View class schedule
- Grouped by day (Monday-Saturday)
- Shows: Time, Subject, Teacher, Room
- Displays class name at top

#### Parent - Class Timetable (`/parent/timetable`)
**Features**:
- Select child from dropdown
- View selected child's class schedule
- Grouped by day (Monday-Saturday)
- Shows: Time, Subject, Teacher, Room

---

## How to Use

### For Admins:

1. **Navigate to Timetables**:
   - Login as admin
   - Go to Admin Dashboard → Timetables

2. **Add a Schedule Entry**:
   - Click "Add Schedule" button
   - Select Class, Subject, Teacher
   - Choose Day
   - Set Start Time and End Time
   - Optionally add Room Number
   - Click "Create"

3. **Edit an Entry**:
   - Click the edit icon (pencil) next to any entry
   - Modify the fields
   - Click "Update"

4. **Delete an Entry**:
   - Click the delete icon (trash) next to any entry
   - Confirm deletion

5. **Filter by Class**:
   - Use the "Filter by Class" dropdown
   - Select a specific class to view only its schedule

### For Teachers:

1. **View Your Schedule**:
   - Login as teacher
   - Go to Teacher Dashboard → My Timetable
   - View your weekly teaching schedule

### For Students:

1. **View Class Schedule**:
   - Login as student
   - Go to Student Dashboard → My Timetable
   - View your class's weekly schedule

### For Parents:

1. **View Child's Schedule**:
   - Login as parent
   - Go to Parent Dashboard → Class Timetable
   - Select your child from the dropdown
   - View their class schedule

---

## Validation Rules

1. **Time Validation**:
   - End time must be after start time
   - Times are in 24-hour format (HH:MM)

2. **Overlap Prevention**:
   - System checks for overlapping schedules
   - Cannot create two entries for the same class at overlapping times on the same day
   - Error message shown if overlap detected

3. **Required Fields**:
   - Class, Subject, Teacher, Day, Start Time, End Time are required
   - Room Number is optional

---

## Database Migration

To apply the timetable feature to your database:

```bash
cd hsms-backend
php artisan migrate
```

This will create the `timetables` table with all necessary fields and constraints.

---

## API Examples

### Create Timetable Entry
```http
POST /api/timetables
Authorization: Bearer {token}
Content-Type: application/json

{
  "class_id": 1,
  "subject_id": 2,
  "teacher_id": 1,
  "day": "Monday",
  "start_time": "08:00",
  "end_time": "09:00",
  "room_number": "Room 101"
}
```

### Get Teacher's Timetable
```http
GET /api/my-timetable
Authorization: Bearer {token}
```

### Get Student's Timetable
```http
GET /api/my-timetable
Authorization: Bearer {token}
```

### Get Class Timetable (Parent/Admin)
```http
GET /api/timetables/class/1
Authorization: Bearer {token}
```

---

## UI Features

### Admin Page
- **Layout**: Day-by-day cards
- **Actions**: Add, Edit, Delete buttons
- **Filter**: Class dropdown filter
- **Modal**: Popup form for create/edit
- **Table**: Organized table view per day

### Teacher/Student/Parent Pages
- **Layout**: Day-by-day cards
- **Design**: Color-coded gradient cards
- **Icons**: Clock, Subject, Teacher/Class icons
- **Responsive**: Works on mobile and desktop

---

## Access Control

| Role | Permissions |
|------|-------------|
| **Admin** | Full CRUD - Create, Read, Update, Delete all timetables |
| **Teacher** | Read-only - View personal teaching schedule |
| **Student** | Read-only - View class schedule |
| **Parent** | Read-only - View children's class schedules |

---

## Technical Details

### Models
- **Timetable Model**: `app/Models/Timetable.php`
  - Relationships: belongsTo ClassRoom, Subject, Teacher
  - Casts: start_time and end_time as datetime

### Controllers
- **TimetableController**: `app/Http/Controllers/Api/TimetableController.php`
  - Methods: index, store, update, destroy, getByClass, getMyTimetable, getStudentTimetable

### Routes
- Defined in `routes/api.php`
- Protected by `auth:sanctum` middleware
- Role-based access control

### Frontend Components
- Admin: `/app/admin/timetables/page.jsx`
- Teacher: `/app/teacher/timetable/page.jsx`
- Student: `/app/student/timetable/page.jsx`
- Parent: `/app/parent/timetable/page.jsx`

---

## Sample Data

To test the feature, you can create sample timetable entries:

**Example Schedule for Grade 10-C**:
- Monday 08:00-09:00: Mathematics (Teacher: John Teacher, Room: 101)
- Monday 09:00-10:00: English (Teacher: John Teacher, Room: 102)
- Tuesday 08:00-09:00: Science (Teacher: John Teacher, Room: Lab 1)
- Wednesday 08:00-09:00: ICT (Teacher: John Teacher, Room: Computer Lab)

---

## Troubleshooting

### Issue: "Time slot overlaps with existing schedule"
**Solution**: Check if there's already a class scheduled for that time slot. Edit or delete the existing entry first.

### Issue: "Teacher profile not found"
**Solution**: Ensure the teacher has a complete profile linked to their user account.

### Issue: "Student not assigned to any class"
**Solution**: Admin must assign the student to a class first in the Students management page.

### Issue: Timetable not showing
**Solution**: 
1. Check if timetable entries exist for that class/teacher
2. Verify the user is logged in with correct role
3. Check browser console for API errors

---

## Future Enhancements

Potential improvements for the timetable feature:

1. **Bulk Import**: Import timetables from Excel/CSV
2. **Conflict Detection**: Warn if teacher has overlapping classes
3. **Print View**: Printable timetable format
4. **Color Coding**: Different colors for different subjects
5. **Notifications**: Remind students/teachers of upcoming classes
6. **Break Times**: Add break/lunch periods
7. **Recurring Events**: Set up recurring schedules easily
8. **Room Availability**: Check room availability before scheduling

---

## Status

✅ **FULLY IMPLEMENTED AND WORKING**

All features are implemented and tested:
- Database migration created
- Backend API endpoints working
- Frontend pages created for all roles
- Navigation links added to sidebar
- Access control implemented
- Validation and error handling in place

---

**Ready to Use!** The timetable feature is now live and accessible to all users based on their roles.
