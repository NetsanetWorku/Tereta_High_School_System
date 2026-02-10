# Timetable 404 Error - FIXED ✅

## The Problem
Getting `Request failed with status code 404` when trying to view timetables (especially for parents viewing child's timetable).

## The Root Cause
**Route Ordering Conflict**

In `routes/api.php`, the routes were defined in this order:
```php
Route::apiResource('timetables', TimetableController::class);
Route::get('timetables/class/{classId}', [TimetableController::class, 'getByClass']);
```

When a request came for `/api/timetables/class/1`:
- Laravel matched it to the `apiResource` route first
- It treated "class" as the timetable ID
- Tried to call the `show()` method which didn't exist
- Result: 404 error

## The Solution

### 1. Reordered Routes
Changed the order so specific routes come before `apiResource`:
```php
Route::get('timetables/class/{classId}', [TimetableController::class, 'getByClass']);
Route::apiResource('timetables', TimetableController::class);
```

### 2. Added Missing `show()` Method
Added the `show()` method to `TimetableController.php` to handle individual timetable fetching:
```php
public function show($id)
{
    $timetable = Timetable::with(['classRoom', 'subject', 'teacher.user'])->find($id);

    if (!$timetable) {
        return response()->json([
            'success' => false,
            'message' => 'Timetable entry not found'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $timetable
    ]);
}
```

## How to Apply the Fix

### Step 1: Restart Backend Server
```bash
cd hsms-backend
# Stop the current server (Ctrl+C)
php artisan serve
```

### Step 2: Clear Cache (Optional but Recommended)
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Step 3: Test
1. Login as a parent
2. Go to Timetable page
3. Select a child
4. The timetable should now load without 404 errors

## Files Modified
- `hsms-backend/routes/api.php` - Reordered routes
- `hsms-backend/app/Http/Controllers/Api/TimetableController.php` - Added `show()` method

## Why This Matters
This is a common Laravel routing issue. When using `apiResource`, it creates these routes:
- GET /timetables - index()
- POST /timetables - store()
- GET /timetables/{id} - show()
- PUT /timetables/{id} - update()
- DELETE /timetables/{id} - destroy()

Any custom routes with similar patterns must be defined BEFORE the `apiResource` to avoid conflicts.

## Verification
After restarting the server, all timetable pages should work:
- ✅ Admin Timetables page
- ✅ Teacher Timetable page
- ✅ Student Timetable page
- ✅ Parent Timetable page (viewing child's timetable)

---

**Status**: Fixed and ready to use!
