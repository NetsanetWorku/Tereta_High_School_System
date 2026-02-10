# Timetable 404 Error - Complete Troubleshooting Guide

## Current Status: ⚠️ BACKEND SERVER NEEDS RESTART

The fix has been applied to the code, but **you must restart the backend server** for it to take effect.

---

## Step 1: RESTART BACKEND SERVER (REQUIRED)

### Quick Restart:
```bash
# Stop the server (Ctrl+C in the terminal where it's running)
# Then run:
cd hsms-backend
php artisan serve
```

### Full Restart with Cache Clear:
```bash
cd hsms-backend
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan serve
```

---

## Step 2: Verify Routes Are Loaded

After restarting, check if routes are correct:

```bash
cd hsms-backend
php artisan route:list | findstr timetable
```

**Expected Output:**
```
GET|HEAD   api/timetables/class/{classId} .... TimetableController@getByClass
GET|HEAD   api/timetables ................... TimetableController@index
POST       api/timetables ................... TimetableController@store
GET|HEAD   api/timetables/{timetable} ....... TimetableController@show
PUT|PATCH  api/timetables/{timetable} ....... TimetableController@update
DELETE     api/timetables/{timetable} ....... TimetableController@destroy
GET|HEAD   api/teacher/my-timetable ......... TimetableController@getMyTimetable
GET|HEAD   api/my-timetable ................. TimetableController@getStudentTimetable
```

**Important**: `/timetables/class/{classId}` must appear BEFORE `/timetables/{timetable}`

---

## Step 3: Test Each Role

### For Students:
1. Login as a student
2. Go to Timetable page
3. Should call: `GET /api/my-timetable`
4. **Possible Issue**: Student not assigned to a class
   - Check: Admin → Students → Make sure student has a class assigned

### For Teachers:
1. Login as a teacher
2. Go to Timetable page
3. Should call: `GET /api/teacher/my-timetable`
4. **Possible Issue**: Teacher profile not found
   - Check: Admin → Teachers → Make sure teacher exists

### For Parents:
1. Login as a parent
2. Go to Timetable page
3. Select a child
4. Should call: `GET /api/timetables/class/{classId}`
5. **Possible Issue**: Child not assigned to a class
   - Check: Admin → Students → Make sure child has a class assigned

### For Admin:
1. Login as admin
2. Go to Timetables page
3. Should call: `GET /api/timetables`
4. Should work without issues

---

## Step 4: Check Browser Console

Open browser console (F12) and look for the exact error:

### If you see:
```
GET http://localhost:8000/api/my-timetable 404
```
**Solution**: Student not assigned to a class OR server not restarted

### If you see:
```
GET http://localhost:8000/api/timetables/class/1 404
```
**Solution**: Server not restarted (route order issue)

### If you see:
```
GET http://localhost:8000/api/teacher/my-timetable 404
```
**Solution**: Teacher profile not found OR server not restarted

---

## Step 5: Check Laravel Logs

Open: `hsms-backend/storage/logs/laravel.log`

Look for recent errors. Common issues:

### Error: "Student not assigned to any class"
**Solution**: 
```sql
-- Check student's class assignment
SELECT id, name, class_id FROM students WHERE user_id = YOUR_USER_ID;

-- If class_id is NULL, assign a class:
UPDATE students SET class_id = 1 WHERE user_id = YOUR_USER_ID;
```

### Error: "Teacher profile not found"
**Solution**:
```sql
-- Check if teacher exists
SELECT id, user_id FROM teachers WHERE user_id = YOUR_USER_ID;

-- If not found, create teacher profile via Admin panel
```

---

## Step 6: Database Checks

### Check if timetables exist:
```sql
SELECT * FROM timetables LIMIT 5;
```

If empty, you need to create timetables via Admin panel.

### Check if student has class:
```sql
SELECT s.id, s.name, s.class_id, c.name as class_name 
FROM students s 
LEFT JOIN class_rooms c ON s.class_id = c.id 
WHERE s.user_id = YOUR_USER_ID;
```

### Check if class has timetables:
```sql
SELECT t.*, s.name as subject_name 
FROM timetables t 
JOIN subjects s ON t.subject_id = s.id 
WHERE t.class_id = YOUR_CLASS_ID;
```

---

## Common Scenarios

### Scenario 1: "I restarted but still getting 404"
**Checklist**:
- [ ] Did you actually stop the server (Ctrl+C)?
- [ ] Did you see "Laravel development server started" message?
- [ ] Did you refresh the browser page (not just F5, try Ctrl+Shift+R)?
- [ ] Are you on the correct port (8000 for backend, 3000 for frontend)?

### Scenario 2: "Student timetable shows 'not assigned to class'"
**Solution**:
1. Login as Admin
2. Go to Students page
3. Edit the student
4. Assign them to a class
5. Save
6. Refresh student's timetable page

### Scenario 3: "Timetable is empty"
**Solution**:
1. Login as Admin
2. Go to Timetables page
3. Create timetable entries for the class
4. Refresh the timetable page

### Scenario 4: "Parent can't see child's timetable"
**Solution**:
1. Make sure child is assigned to a class
2. Make sure timetables exist for that class
3. Make sure parent-child relationship is set up

---

## Quick Fix Commands

Run these if you're still having issues:

```bash
cd hsms-backend

# Clear everything
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Restart server
php artisan serve
```

---

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Check the exact URL** being called in browser console
2. **Check Laravel logs** for the exact error message
3. **Verify database** has the required data
4. **Tell me**:
   - Which role you're logged in as
   - The exact URL showing 404
   - Any error messages from Laravel logs

---

## Files Modified (For Reference)

1. `hsms-backend/routes/api.php` - Reordered routes
2. `hsms-backend/app/Http/Controllers/Api/TimetableController.php` - Added `show()` method

---

## Bottom Line

**99% of the time, the issue is that the backend server wasn't restarted.**

Just restart it and you're good to go! 🚀
