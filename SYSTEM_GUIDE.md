# Tereta High School Management System - Complete Guide

## Quick Start

### Starting the System

Run this batch file to start both servers:
```bash
START_SYSTEM.bat
```

Or manually:
```bash
# Terminal 1 - Backend (in hsms-backend folder)
php artisan serve --host=127.0.0.1 --port=9000

# Terminal 2 - Frontend (in hsms-frontend folder)
npm run dev
```

Access the system at: **http://localhost:3000**

### Default Login Credentials

**Admin:**
- Email: admin@tereta.edu.et
- Password: admin123

**Teacher:**
- Email: teacher@tereta.edu.et
- Password: teacher123

**Student:**
- Name: [Student Name]
- Student ID: [From database]

**Parent:**
- Email: parent@tereta.edu.et
- Password: parent123

## System Architecture

### Frontend (Next.js)
- Location: `hsms-frontend/`
- Port: 3000
- Framework: Next.js 14 with App Router
- Styling: Tailwind CSS

### Backend (Laravel)
- Location: `hsms-backend/`
- Port: 9000
- Framework: Laravel 11
- Database: MySQL via XAMPP

## Key Features

### Admin Dashboard
- Manage students, teachers, parents
- Create and manage classes
- Assign teachers to classes
- View system statistics
- Approve user registrations

### Teacher Dashboard
- View assigned classes
- Create and manage assignments
- Mark attendance
- Enter student results
- View class performance

### Student Dashboard
- View assignments and submit work
- Check attendance records
- View results by exam type
- Track academic performance

### Parent Dashboard
- View multiple children
- Monitor attendance
- Check results and performance
- Receive notifications

## Adding Your School Logo

1. Place your logo in: `hsms-frontend/public/logo.png`
2. Recommended size: 200x200 pixels (square)
3. Format: PNG with transparent background
4. Refresh browser - logo appears automatically

## Database Structure

### Main Tables
- `users` - All system users
- `students` - Student profiles
- `teachers` - Teacher profiles
- `parents` - Parent profiles
- `class_rooms` - Classes
- `subjects` - Subjects
- `teacher_subjects` - Teacher-class-subject assignments
- `assignments` - Assignments
- `assignment_submissions` - Student submissions
- `attendance` - Attendance records
- `results` - Student results

## API Endpoints

### Authentication
- POST `/api/login` - User login
- POST `/api/register` - User registration
- POST `/api/logout` - User logout
- GET `/api/me` - Get current user

### Admin Routes
- GET `/api/students` - List all students
- POST `/api/students` - Create student
- GET `/api/teachers` - List all teachers
- GET `/api/classes` - List all classes

### Teacher Routes
- GET `/api/teacher/my-classes` - Get assigned classes
- GET `/api/teacher/my-assignments` - Get created assignments
- POST `/api/assignments` - Create assignment
- POST `/api/attendance` - Mark attendance
- POST `/api/results` - Enter results

### Student Routes
- GET `/api/my-assignments` - Get assignments
- POST `/api/assignments/{id}/submit` - Submit assignment
- GET `/api/my-attendance` - Get attendance
- GET `/api/my-results` - Get results

### Parent Routes
- GET `/api/parent/children` - Get children
- GET `/api/child-attendance` - Get child attendance
- GET `/api/child-results` - Get child results

## Troubleshooting

### Server Won't Start
1. Check if MySQL is running in XAMPP
2. Check if ports 3000 and 9000 are free
3. Run `npm install` in hsms-frontend
4. Run `composer install` in hsms-backend

### Database Connection Error
1. Start MySQL in XAMPP Control Panel
2. Check `.env` file in hsms-backend:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hsms_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Run migrations: `php artisan migrate`

### Login Issues
1. Clear browser cache (Ctrl + Shift + Delete)
2. Check user exists in database
3. Verify user is approved (`is_approved = 1`)
4. Check console for errors (F12)

### Page Not Loading
1. Hard refresh: Ctrl + Shift + R
2. Clear browser cache
3. Restart dev server
4. Check console for errors

## File Structure

```
High_School_Management/
├── hsms-backend/           # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env
├── hsms-frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages
│   │   ├── components/    # Reusable components
│   │   └── lib/          # API and utilities
│   ├── public/           # Static files (put logo here)
│   └── .env.local
├── START_SYSTEM.bat       # Start both servers
├── START_MYSQL.bat        # Start MySQL only
└── SYSTEM_GUIDE.md        # This file
```

## Development Workflow

### Adding a New Feature
1. Create backend API endpoint in `hsms-backend/routes/api.php`
2. Create controller method in `hsms-backend/app/Http/Controllers/Api/`
3. Add API method in `hsms-frontend/src/lib/api.js`
4. Create/update page in `hsms-frontend/src/app/`
5. Test functionality

### Database Changes
1. Create migration: `php artisan make:migration create_table_name`
2. Edit migration file in `database/migrations/`
3. Run migration: `php artisan migrate`
4. Update model if needed

## Security Notes

- Change default passwords in production
- Set strong `APP_KEY` in `.env`
- Enable HTTPS in production
- Regularly backup database
- Keep dependencies updated

## Support

For issues or questions:
1. Check this guide first
2. Check browser console (F12) for errors
3. Check Laravel logs: `hsms-backend/storage/logs/`
4. Check server output in terminal

## System Requirements

- PHP 8.1 or higher
- Node.js 18 or higher
- MySQL 5.7 or higher
- XAMPP (for Windows)
- 2GB RAM minimum
- Modern web browser

## Backup

### Database Backup
```bash
# Export database
mysqldump -u root hsms_db > backup.sql

# Import database
mysql -u root hsms_db < backup.sql
```

### File Backup
Backup these folders:
- `hsms-backend/storage/app/` (uploaded files)
- `hsms-backend/.env` (configuration)
- `hsms-frontend/.env.local` (configuration)

## Version Information

- Laravel: 11.x
- Next.js: 14.x
- PHP: 8.1+
- Node.js: 18+
- MySQL: 5.7+

## Customization

### Adding a School Logo

To add your school logo:

1. Place your logo image file in `hsms-frontend/public/` folder
2. Name it `logo.png` (or update the code to match your filename)
3. The logo will automatically appear in:
   - Dashboard header (for logged-in users)
   - Public navbar (for visitors)
   - Login/Register pages

**Note:** Currently, the system uses a text-based "T" logo as a placeholder. Once you add `logo.png`, it will be displayed instead.

**Recommended logo specifications:**
- Format: PNG with transparent background
- Size: 200x200 pixels (square)
- File size: Under 100KB for fast loading


## System Architecture & Relationships

### Core Entity Relationships

**User → Role Assignment:**
- User table has role field: 'admin', 'teacher', 'student', 'parent'
- Each role links to respective table (teachers, students, parent_models)

**Teacher → Class → Subject:**
- Teachers are assigned to teach specific subjects to specific classes via `teacher_subjects` table
- A teacher can teach multiple subjects to multiple classes
- Teachers can only interact with students in their assigned classes

**Student → Class:**
- Every student must be assigned to a class (class_id field)
- Students can only see data for their own class

**Parent → Student:**
- Parents can have multiple children via `parent_student` pivot table
- Parents can only see data for their own children

### Access Control Rules

**Attendance:**
- Teachers can only mark attendance for students in their assigned classes
- Students can only view their own attendance
- Parents can only view their children's attendance

**Assignments:**
- Teachers can only create assignments for classes/subjects they teach
- Students can only see assignments for their class
- Parents can only see their children's assignments

**Results:**
- Teachers can only record results for students in their assigned classes
- Students can only see their own results
- Parents can only see their children's results

### Database Tables Overview

**Core Tables:**
- `users` - All system users with role field
- `teachers` - Teacher-specific data
- `students` - Student-specific data (includes class_id, student_code)
- `parent_models` - Parent-specific data
- `class_rooms` - Class information
- `subjects` - Subject information

**Relationship Tables:**
- `teacher_subjects` - Links teachers to subjects and classes
- `parent_student` - Links parents to their children

**Activity Tables:**
- `attendances` - Student attendance records (includes teacher_id, subject_id)
- `assignments` - Teacher assignments (includes class_id, subject_id, teacher_id)
- `assignment_submissions` - Student assignment submissions
- `results` - Student exam/test results (includes class_id, teacher_id, exam_type)
