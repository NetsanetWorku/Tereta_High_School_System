# ⚠️ Backend Server Not Running - 404 Error is Back

## The Problem

You're getting a 404 error again, which means:

**The backend server is not running OR it crashed OR it wasn't restarted properly.**

---

## Quick Fix - Restart Backend Server NOW

### Step 1: Check if Server is Running

Open your terminal and look for a window that shows:
```
Laravel development server started: http://127.0.0.1:8000
```

**If you DON'T see this**, the server is not running.

### Step 2: Start/Restart the Server

```bash
cd hsms-backend
php artisan serve
```

**Wait for this message:**
```
Laravel development server started: http://127.0.0.1:8000
```

### Step 3: Verify Server is Working

Open your browser and go to:
```
http://localhost:8000/api/me
```

**Expected**: You should see JSON response (might be unauthorized, that's OK)
**If you see**: "This site can't be reached" = Server is NOT running

---

## Common Issues

### Issue 1: "Port 8000 is already in use"

**Solution**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Then restart
cd hsms-backend
php artisan serve
```

### Issue 2: Server Keeps Crashing

Check for errors:
```bash
cd hsms-backend
php artisan serve
```

Look for error messages. Common causes:
- Database connection error
- PHP syntax error
- Missing dependencies

### Issue 3: "php: command not found"

**Solution**: PHP is not installed or not in PATH
- Check: `php --version`
- If not found, install PHP or add to PATH

---

## Permanent Solution - Keep Server Running

### Option 1: Use a Separate Terminal Window
1. Open a NEW terminal window
2. Run: `cd hsms-backend && php artisan serve`
3. **Leave this window open** - don't close it
4. Use other terminal windows for other commands

### Option 2: Run in Background (Windows)
```bash
cd hsms-backend
start /B php artisan serve
```

### Option 3: Use Process Manager
- Install: `npm install -g pm2`
- Run: `pm2 start "php artisan serve" --name laravel`
- Stop: `pm2 stop laravel`

---

## Verification Checklist

After starting the server:

- [ ] Terminal shows: "Laravel development server started"
- [ ] Browser can access: http://localhost:8000
- [ ] Frontend can make API calls without 404 errors
- [ ] No error messages in terminal

---

## What to Do Right Now

1. **Find your terminal** where backend should be running
2. **If you see the Laravel server message**: Good! Server is running. The issue might be something else.
3. **If you DON'T see the message**: Run `cd hsms-backend && php artisan serve`
4. **Wait for "Laravel development server started"**
5. **Refresh your browser** (Ctrl+Shift+R)

---

## Still Getting 404?

If server is running but you still get 404:

1. **Check the exact URL** in browser console (F12)
2. **Verify routes** are loaded:
   ```bash
   cd hsms-backend
   php artisan route:list | findstr timetable
   ```
3. **Clear Laravel cache**:
   ```bash
   cd hsms-backend
   php artisan route:clear
   php artisan config:clear
   php artisan cache:clear
   ```
4. **Restart server** after clearing cache

---

## Bottom Line

**The backend server MUST be running for the system to work.**

If you close the terminal or stop the server, you'll get 404 errors.

Just run `php artisan serve` and keep that terminal window open! 🚀
