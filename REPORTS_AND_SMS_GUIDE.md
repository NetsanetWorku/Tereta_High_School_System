# Reports & Analytics and SMS Notifications Guide

## Overview
This guide covers the Reports & Analytics system and SMS Notifications feature in the HSMS (High School Management System).

## Reports & Analytics

### Backend Implementation

#### API Endpoints (Admin Only)

All report endpoints are protected and only accessible by admin users:

```
GET /api/reports/dashboard-stats
GET /api/reports/student/{studentId}
GET /api/reports/class/{classId}
GET /api/reports/attendance?start_date=&end_date=&class_id=
GET /api/reports/results?class_id=&subject_id=
GET /api/reports/teacher/{teacherId}
```

### Available Reports

#### 1. Dashboard Statistics
**Endpoint:** `GET /api/reports/dashboard-stats`

Returns overall system statistics:
- Total students, teachers, classes, subjects
- Today's attendance statistics
- Recent results (last 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_students": 150,
    "total_teachers": 25,
    "total_classes": 12,
    "total_subjects": 15,
    "attendance_today": 145,
    "present_today": 138,
    "recent_results": [...]
  }
}
```

#### 2. Student Performance Report
**Endpoint:** `GET /api/reports/student/{studentId}`

Provides comprehensive student performance analysis:
- Average marks across all subjects
- Attendance percentage
- Subject-wise performance breakdown
- All results with grades

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {...},
    "average_marks": 85.5,
    "attendance_percentage": 92.3,
    "total_subjects": 8,
    "subject_performance": [
      {
        "subject": "Mathematics",
        "marks": 90,
        "grade": "A"
      }
    ],
    "results": [...]
  }
}
```

#### 3. Class Performance Report
**Endpoint:** `GET /api/reports/class/{classId}`

Analyzes entire class performance:
- Class average marks
- Class attendance percentage
- Top 5 performers
- Subject-wise class averages with highest/lowest marks

**Response:**
```json
{
  "success": true,
  "data": {
    "class": {...},
    "total_students": 30,
    "class_average": 78.5,
    "class_attendance": 88.7,
    "top_performers": [
      {
        "student_id": 1,
        "student_name": "John Doe",
        "average_marks": 95.5
      }
    ],
    "subject_averages": [...]
  }
}
```

#### 4. Attendance Report
**Endpoint:** `GET /api/reports/attendance`

**Query Parameters:**
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)
- `class_id` (optional): Filter by class

**Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "total": 500,
      "present": 450,
      "absent": 40,
      "late": 10,
      "present_percentage": 90.0
    },
    "records": [...]
  }
}
```

#### 5. Results Report
**Endpoint:** `GET /api/reports/results`

**Query Parameters:**
- `class_id` (optional): Filter by class
- `subject_id` (optional): Filter by subject

**Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "total_students": 30,
      "average_marks": 75.5,
      "highest_marks": 98,
      "lowest_marks": 45,
      "pass_count": 28,
      "fail_count": 2
    },
    "grade_distribution": [
      { "grade": "A", "count": 10 },
      { "grade": "B", "count": 12 }
    ],
    "results": [...]
  }
}
```

#### 6. Teacher Performance Report
**Endpoint:** `GET /api/reports/teacher/{teacherId}`

Shows teacher's workload and assignments:
- Assigned subjects and classes
- Total number of classes taught
- Total students taught

**Response:**
```json
{
  "success": true,
  "data": {
    "teacher": {...},
    "assignments": [
      {
        "subject": "Mathematics",
        "class": "Grade 10",
        "section": "A"
      }
    ],
    "total_classes": 5,
    "total_students": 150
  }
}
```

### Frontend Implementation (To Be Created)

Create admin dashboard pages to visualize these reports:

1. **Admin Reports Dashboard** (`/admin/reports`)
   - Overview cards with key metrics
   - Charts for attendance trends
   - Grade distribution graphs
   - Top performers list

2. **Student Report Page** (`/admin/reports/student/[id]`)
   - Individual student performance
   - Subject-wise breakdown
   - Attendance history chart

3. **Class Report Page** (`/admin/reports/class/[id]`)
   - Class performance overview
   - Subject comparisons
   - Student rankings

Recommended libraries for charts:
- `recharts` - Simple and responsive charts
- `chart.js` with `react-chartjs-2` - More customization options

## SMS Notifications

### Current Implementation

The SMS notification system is already configured with a custom channel:

**File:** `hsms-backend/app/Channels/SmsChannel.php`

### How It Works

1. **Development Mode:** SMS messages are logged to `storage/logs/laravel.log`
2. **Production Mode:** Ready for integration with SMS providers (Twilio, Nexmo, etc.)

### Existing SMS Notifications

#### 1. Registration SMS
**File:** `hsms-backend/app/Notifications/RegistrationSMS.php`

Sent when a new user registers:
```php
$user->notify(new RegistrationSMS());
```

### Adding New SMS Notifications

#### Example: Attendance Alert

Create a new notification:

```php
<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class AttendanceAlert extends Notification
{
    protected $student;
    protected $date;
    protected $status;

    public function __construct($student, $date, $status)
    {
        $this->student = $student;
        $this->date = $date;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['sms'];
    }

    public function toSms($notifiable)
    {
        return [
            'to' => $notifiable->phone,
            'message' => "Alert: {$this->student->name} was marked {$this->status} on {$this->date}. - HSMS"
        ];
    }
}
```

Use in AttendanceController:

```php
// After marking attendance
if ($attendance->status === 'absent') {
    $parent = $student->parents()->first();
    if ($parent && $parent->user->phone) {
        $parent->user->notify(new AttendanceAlert($student, $attendance->date, 'absent'));
    }
}
```

### Recommended SMS Triggers

1. **Attendance Alerts**
   - Student marked absent
   - Student marked late
   - Low attendance warning (below threshold)

2. **Result Notifications**
   - New results published
   - Failing grade alert
   - Excellent performance recognition

3. **Exam Notifications**
   - Exam schedule published
   - Exam reminder (1 day before)
   - Results available

4. **Fee Reminders** (when implemented)
   - Fee due reminder
   - Payment confirmation
   - Overdue notice

5. **General Announcements**
   - School closure
   - Important events
   - Emergency notifications

### Production SMS Setup (Twilio Example)

1. Install Twilio SDK:
```bash
composer require twilio/sdk
```

2. Add to `.env`:
```env
TWILIO_SID=your_account_sid
TWILIO_TOKEN=your_auth_token
TWILIO_FROM=+1234567890
```

3. Add to `config/services.php`:
```php
'twilio' => [
    'sid' => env('TWILIO_SID'),
    'token' => env('TWILIO_TOKEN'),
    'from' => env('TWILIO_FROM'),
],
```

4. Uncomment Twilio code in `SmsChannel.php`:
```php
protected function sendViaTwilio(array $message): void
{
    $twilio = new \Twilio\Rest\Client(
        config('services.twilio.sid'),
        config('services.twilio.token')
    );
    
    $twilio->messages->create(
        $message['to'],
        [
            'from' => config('services.twilio.from'),
            'body' => $message['message']
        ]
    );
}
```

### Testing SMS in Development

Check the log file to see SMS messages:

```bash
# Windows
type hsms-backend\storage\logs\laravel.log | findstr "SMS NOTIFICATION"

# Or open the file directly
notepad hsms-backend\storage\logs\laravel.log
```

Look for entries like:
```
=== SMS NOTIFICATION ===
To: +1234567890
Message: Welcome to HSMS! Your account has been created successfully.
========================
```

## Next Steps

### For Reports & Analytics:
1. Create admin reports dashboard page
2. Add chart visualizations
3. Implement export to PDF/Excel functionality
4. Add date range filters
5. Create printable report templates

### For SMS Notifications:
1. Add attendance alert notifications
2. Add result notification system
3. Add exam reminder notifications
4. Implement SMS preferences (allow users to opt-in/out)
5. Add SMS delivery status tracking
6. Set up production SMS provider (Twilio/Nexmo)

## Status

✅ **Completed:**
- ReportController with all report methods
- API routes for all reports
- SMS channel infrastructure
- Basic SMS notification system

⏳ **Pending:**
- Frontend reports dashboard
- Chart visualizations
- Additional SMS notification triggers
- Production SMS provider integration
- SMS preferences management

## Related Files

### Backend:
- `hsms-backend/app/Http/Controllers/Api/ReportController.php`
- `hsms-backend/app/Channels/SmsChannel.php`
- `hsms-backend/app/Notifications/RegistrationSMS.php`
- `hsms-backend/routes/api.php`

### Frontend (To Be Created):
- `hsms-frontend/src/app/admin/reports/page.jsx`
- `hsms-frontend/src/app/admin/reports/student/[id]/page.jsx`
- `hsms-frontend/src/app/admin/reports/class/[id]/page.jsx`
