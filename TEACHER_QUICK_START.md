# Teacher Quick Start Guide

## 🚀 Getting Started

### Login
1. Go to http://localhost:3000/login
2. Email: `teacher@tereta.edu.et`
3. Password: `teacher123`
4. Click "Login"

---

## 📋 Daily Tasks

### 1️⃣ Mark Attendance (5 minutes)
```
Dashboard → Mark Attendance
    ↓
Select Class: "Grade 9A - Mathematics"
    ↓
Select Date: Today
    ↓
Mark absent students (all default to Present)
    ↓
Click "Mark Attendance"
    ↓
✅ Done!
```

### 2️⃣ Create Assignment (10 minutes)
```
Dashboard → Create Assignment
    ↓
Title: "Chapter 5 Homework"
Description: "Complete exercises 1-10"
Class: "Grade 9A - Mathematics"
Due Date: March 20, 2026
Due Time: 23:59
Total Marks: 50
    ↓
Click "Create"
    ↓
✅ Done!
```

### 3️⃣ Grade Submissions (15 minutes)
```
Dashboard → My Assignments
    ↓
Click "Grade" on assignment
    ↓
View student submissions
    ↓
Enter marks for each submission
Add feedback (optional)
    ↓
Click "Save Grade"
    ↓
✅ Done!
```

### 4️⃣ Enter Test Results (20 minutes)
```
Dashboard → Enter Results
    ↓
Assessment Name: "Chapter 5 Test"
Assessment Type: "Test"
Class: "Grade 9A - Mathematics"
Date: Today
Total Marks: 100
    ↓
Enter marks for each student
(Grades calculated automatically)
    ↓
Click "Save Results"
    ↓
✅ Done!
```

---

## 🎯 Quick Actions from Dashboard

| Action | What It Does | Time |
|--------|-------------|------|
| 📝 Create Assignment | Add new homework/project | 10 min |
| 📅 Mark Attendance | Take class attendance | 5 min |
| 📊 Enter Results | Record test/exam scores | 20 min |
| 🏫 View Classes | See all your classes | 1 min |

---

## 📊 Understanding Your Dashboard

### Statistics Cards
- **My Classes**: Total classes you teach
- **Total Students**: All students across your classes
- **My Assignments**: Total assignments created
- **Pending Submissions**: Submissions waiting for grading

### My Classes Section
- Shows your first 5 classes
- Click any class to view students
- See student count per class

### Recent Assignments Section
- Shows last 5 assignments
- Status: Active (green) or Overdue (red)
- Submission count: "15/30" means 15 out of 30 submitted

---

## 🔍 Finding Things

### View All Classes
`Dashboard → View Classes` or click "View All →" in My Classes section

### View All Assignments
`Dashboard → My Assignments` or click "View All →" in Recent Assignments

### View All Attendance Records
`Dashboard → Mark Attendance` (shows list first)

### View All Results
`Dashboard → Enter Results` (shows list first)

---

## ⚡ Keyboard Shortcuts

| Page | Shortcut | Action |
|------|----------|--------|
| Any | `Ctrl + /` | Search |
| Dashboard | `Alt + A` | Create Assignment |
| Dashboard | `Alt + T` | Mark Attendance |
| Dashboard | `Alt + R` | Enter Results |

---

## 🎨 Status Colors

### Assignments
- 🟢 **Green (Active)**: Due date is more than 3 days away
- 🟡 **Yellow (Due Soon)**: Due within 3 days
- 🔴 **Red (Overdue)**: Past due date

### Attendance
- 🟢 **Green**: Present
- 🔴 **Red**: Absent
- 🟡 **Yellow**: Late

### Grades
- 🟢 **Green (A)**: 90-100%
- 🔵 **Blue (B)**: 80-89%
- 🟡 **Yellow (C)**: 70-79%
- 🟠 **Orange (D)**: 60-69%
- 🔴 **Red (F)**: Below 60%

---

## 📱 Mobile Tips

### On Phone/Tablet:
1. Dashboard cards stack vertically
2. Tables scroll horizontally
3. Forms are single column
4. All features work the same

### Best Practices:
- Use landscape mode for tables
- Mark attendance on desktop (easier)
- View dashboard on mobile (quick check)

---

## 🆘 Common Issues

### "No classes assigned"
**Fix:** Contact admin to assign you to classes

### "Failed to load classes"
**Fix:** 
1. Check if backend is running (port 9000)
2. Verify database connection
3. Check teacher_subjects table has your assignments

### "Cannot create assignment"
**Fix:**
1. Ensure all required fields are filled
2. Due date must be in the future
3. You must be assigned to the class

### "Attendance already marked"
**Fix:** You can only mark attendance once per class per day

---

## 📞 Need Help?

### Check These First:
1. ✅ Backend running? (http://127.0.0.1:9000/api)
2. ✅ Frontend running? (http://localhost:3000)
3. ✅ Logged in correctly?
4. ✅ Classes assigned to you?

### Still Stuck?
- Check browser console (F12) for errors
- Check backend logs in `hsms-backend/storage/logs/`
- Contact system administrator
- Read full guide: `TEACHER_WORKFLOW_GUIDE.md`

---

## 🎓 Pro Tips

### Efficiency
- Mark attendance at start of class
- Create assignments in batches
- Grade submissions within 48 hours
- Enter results same day as assessment

### Organization
- Use clear assignment titles
- Add detailed instructions
- Set realistic due dates
- Keep assessment records

### Communication
- Respond to messages promptly
- Update profile regularly
- Report issues to admin
- Keep parents informed

---

## 📈 Weekly Checklist

### Monday
- [ ] Mark attendance for all classes
- [ ] Check pending submissions
- [ ] Review upcoming assignments

### Tuesday-Thursday
- [ ] Mark daily attendance
- [ ] Grade new submissions
- [ ] Create new assignments (if needed)

### Friday
- [ ] Mark attendance
- [ ] Enter weekly test results
- [ ] Review week's progress
- [ ] Plan next week's assignments

---

## 🎯 Success Metrics

### Good Teacher Dashboard:
- ✅ Attendance marked daily
- ✅ Assignments graded within 2 days
- ✅ Results entered within 1 week
- ✅ All classes have active assignments
- ✅ No overdue submissions

### Red Flags:
- ❌ Attendance not marked for 3+ days
- ❌ Submissions pending for 1+ week
- ❌ No assignments in 2+ weeks
- ❌ Results not entered for 2+ weeks

---

**Last Updated:** March 13, 2026
**Version:** 1.0
**For detailed workflows, see:** `TEACHER_WORKFLOW_GUIDE.md`
