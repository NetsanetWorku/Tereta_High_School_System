# High School Management System - User Guide

## 🚀 Quick Start Guide

### How to Access the System

The HSMS requires authentication before accessing any dashboard. Follow these simple steps:

#### Option 1: Quick Login Demo (Recommended for Testing)
1. Open your browser and go to: `http://localhost:3000`
2. Click the **"Quick Login Demo"** button on the home page
3. Choose one of the pre-configured test accounts:
   - **Admin**: Full system access
   - **Teacher**: Manage classes, attendance, and results
   - **Student**: View attendance and results
   - **Parent**: Monitor children's academic progress
4. You'll be automatically logged in and redirected to the appropriate dashboard

#### Option 2: Regular Login
1. Go to: `http://localhost:3000/login`
2. Enter your credentials:
   - Email: `admin@hsms.com` (or any other test account)
   - Password: `password`
3. Click "Sign In"

#### Option 3: Create New Account
1. Go to: `http://localhost:3000/register`
2. Fill in your details:
   - Name
   - Email
   - Password
   - Role (Student, Teacher, or Parent)
3. Click "Register"

---

## 📋 Test Accounts

### Pre-configured Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@hsms.com | password | Full system access |
| Teacher | teacher@hsms.com | password | Classes, Attendance, Results |
| Student | student@hsms.com | password | View own attendance & results |
| Student (Test) | teststudent@test.com | password123 | View own attendance & results |
| Parent | parent@hsms.com | password | View children's data |

---

## 🎯 Dashboard Features by Role

### Admin Dashboard
- **Students Management**: Add, edit, delete students
- **Teachers Management**: Manage teacher profiles
- **Classes Management**: Create and manage classes
- **Subjects Management**: Add and manage subjects
- **Parents Management**: Manage parent accounts and assign students

### Teacher Dashboard
- **My Classes**: View assigned classes
- **Attendance**: Record and manage student attendance
- **Results**: Enter and update student grades
- **Statistics**: View class performance metrics

### Student Dashboard
- **My Attendance**: View attendance records
- **My Results**: View grades and academic performance
- **Academic Summary**: Overview of subjects and performance

### Parent Dashboard
- **My Children**: View list of assigned children
- **Attendance**: Monitor children's attendance
- **Results**: Track children's academic performance

---

## ⚠️ Important Notes

### Authentication Required
- **All dashboards require authentication**
- If you try to access a dashboard directly (e.g., `/student`), you'll be redirected to login
- The system uses JWT tokens stored in browser localStorage
- Tokens persist across browser sessions until you logout

### Common Issues

#### Issue: "Continuous Loading" or "Page Not Displaying"
**Solution**: You need to login first!
1. Go to `http://localhost:3000/quick-login`
2. Click any role button to login
3. Then access the dashboard

#### Issue: "404 Error" or "Network Error"
**Solution**: Check if both servers are running:
- Backend: `http://localhost:8000` (Laravel)
- Frontend: `http://localhost:3000` (Next.js)

#### Issue: "401 Unauthorized"
**Solution**: Your session expired or token is invalid
1. Logout (if possible)
2. Clear browser localStorage
3. Login again

---

## 🔧 Technical Details

### API Endpoints

#### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user info

#### Student Endpoints (Requires Student Role)
- `GET /api/my-attendance` - Get own attendance records
- `GET /api/my-results` - Get own results

#### Teacher Endpoints (Requires Teacher Role)
- `GET /api/my-classes` - Get assigned classes
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Record attendance
- `GET /api/results` - Get all results
- `POST /api/results` - Enter results

#### Admin Endpoints (Requires Admin Role)
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `GET /api/teachers` - List all teachers
- `GET /api/classes` - List all classes
- `GET /api/subjects` - List all subjects
- `GET /api/parents` - List all parents

### Authentication Flow
1. User submits credentials to `/api/login`
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. All subsequent API requests include token in Authorization header
5. Backend validates token on each request
6. If token is invalid/expired, user is redirected to login

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **API Client**: Axios with interceptors
- **Authentication**: Custom useAuth hook
- **Route Protection**: AuthGuard component

### Backend Architecture
- **Framework**: Laravel 12
- **Authentication**: Laravel Sanctum (JWT tokens)
- **Database**: SQLite
- **API**: RESTful JSON API
- **Middleware**: Role-based access control

---

## 🐛 Debugging

### Check Backend Status
```powershell
# Check if Laravel server is running
netstat -an | findstr ":8000"

# Test login endpoint
$body = @{email="admin@hsms.com"; password="password"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8000/api/login" -Method POST -Body $body -ContentType "application/json"
```

### Check Frontend Status
```powershell
# Check if Next.js server is running
netstat -an | findstr ":3000"
```

### Clear Authentication Data
Open browser console and run:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
location.reload();
```

---

## 📞 Support

If you encounter any issues:
1. Check that both servers are running
2. Try the Quick Login Demo first
3. Clear browser cache and localStorage
4. Check browser console for error messages
5. Verify API endpoints are responding correctly

---

## ✅ System Status Checklist

Before reporting issues, verify:
- [ ] Backend server is running on port 8000
- [ ] Frontend server is running on port 3000
- [ ] You have logged in using Quick Login or regular login
- [ ] Browser localStorage contains 'token' and 'user' items
- [ ] No console errors in browser developer tools
- [ ] API endpoints respond correctly (test with PowerShell)

---

**Last Updated**: February 5, 2026
**Version**: 1.0.0
