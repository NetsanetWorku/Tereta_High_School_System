# Tereta High School Management System

A comprehensive school management system built with Laravel (Backend) and Next.js (Frontend).

## Features

- **User Management**: Admin, Teacher, Student, and Parent roles
- **Student Registration**: Separate forms for new students and transfer students
- **Attendance Tracking**: Real-time attendance management
- **Grade Management**: Academic performance tracking and reporting
- **Class Management**: Class and subject organization
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Backend
- Laravel 11
- PHP 8.2+
- SQLite Database
- Laravel Sanctum (Authentication)

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Axios

## Quick Start

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- XAMPP (for PHP)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd High_School_Management
   ```

2. **Backend Setup**
   ```bash
   cd hsms-backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   ```

3. **Frontend Setup**
   ```bash
   cd hsms-frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd hsms-backend
   C:\xampp\php\php.exe artisan serve
   ```
   Backend will run on: http://127.0.0.1:8000

2. **Start Frontend Server**
   ```bash
   cd hsms-frontend
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

## Project Structure

```
High_School_Management/
├── hsms-backend/          # Laravel Backend
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── .env
├── hsms-frontend/         # Next.js Frontend
│   ├── src/
│   │   ├── app/          # Pages
│   │   ├── components/   # Reusable components
│   │   └── lib/          # Utilities
│   └── .env.local
└── README.md
```

## Key Pages

### Public Pages
- `/` - Home page
- `/login` - Login page
- `/register` - Registration hub
- `/about` - About page
- `/contact` - Contact page

### Admin Dashboard
- `/admin` - Dashboard
- `/admin/students` - Student management
- `/admin/teachers` - Teacher management
- `/admin/classes` - Class management
- `/admin/subjects` - Subject management
- `/admin/parents` - Parent management

### Teacher Dashboard
- `/teacher` - Dashboard
- `/teacher/classes` - My classes
- `/teacher/attendance` - Attendance management
- `/teacher/results` - Grade management

### Student Dashboard
- `/student` - Dashboard
- `/student/attendance` - View attendance
- `/student/results` - View grades

### Parent Dashboard
- `/parent` - Dashboard
- `/parent/children` - Children information
- `/parent/attendance` - Children's attendance
- `/parent/results` - Children's grades

## Configuration

### Backend (.env)
```env
APP_NAME="Tereta High School Management System"
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=sqlite
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## License

This project is open-source and available for educational purposes.
