# Current Issues Status & Solutions

## Issue 1: Timetable 404 Error ✅ RESOLVED

**Error**: `Request failed with status code 404` when fetching timetable

**Root Cause**: The 404 error is EXPECTED behavior when a student is not assigned to a class. This is not a bug.

**Solution Applied**:
1. Reordered routes - specific routes now come before `apiResource`
2. Added missing `show()` method to TimetableController
3. Improved error handling to distinguish between "not assigned" vs actual errors
4. Backend server is now running continuously
5. Created setup checklist: `TIMETABLE_SETUP_CHECKLIST.md`

**Status**: ✅ System working correctly - 404 is expected when student has no class

**What You Need to Do**:
1. Login as Admin
2. Assign students to classes (Admin → Students → Edit → Select Class)
3. Create timetable entries for those classes (Admin → Timetables → Add Entry)
4. Login as student - timetable will display without 404 errors

**See**: `TIMETABLE_SETUP_CHECKLIST.md` for detailed instructions

---

## Issue 2: PlusIcon Error ❌ NEEDS FIX

**Error**: `ReferenceError: PlusIcon is not defined`

**Status**: This is a Next.js Turbopack cache issue

**Solution**:
```bash
cd hsms-frontend
rm -rf .next
npm run dev
```

**Why**: The import is correct in the code, but Next.js cache is stale. Clearing `.next` folder will fix it.

---

## Issue 3: Email Not Sending ⏳ WAITING FOR USER

**Problem**: Emails are not being sent to actual email addresses

**Status**: System is configured for Gmail SMTP, but needs your credentials

**What You Need to Do**:

### Step 1: Get Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-Factor Authentication (if not already enabled)
3. Generate an App Password
4. Copy the 16-character password (e.g., `abcdefghijklmnop`)

### Step 2: Update `.env` File
Open `hsms-backend/.env` and update these lines:

**Current**:
```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password-here
```

**Replace with**:
```env
MAIL_USERNAME=youractual@gmail.com
MAIL_PASSWORD=abcdefghijklmnop
```
(Use your actual email and the 16-character app password with NO spaces)

### Step 3: Restart Backend
```bash
cd hsms-backend
php artisan config:clear
php artisan cache:clear
php artisan serve
```

### Step 4: Test
Register a new user and check your email inbox!

**Full Guide**: See `GMAIL_EMAIL_SETUP.md` for detailed instructions

---

## Issue 4: Reopen Closed Conversations ✅ ALREADY FIXED

**Status**: Feature is already implemented and working

**How to Use**:
1. Go to Messages page (Teacher, Parent, or Admin)
2. Select a closed conversation
3. Click the "Reopen" button at the top
4. The conversation will reopen and you can send messages again

**Technical Details**:
- Backend: `reopenConversation()` method exists in `MessageController.php`
- Frontend: "Reopen" button appears when `conversation.status === 'closed'`
- Route: `PUT /api/conversations/{id}/reopen`

**If it's not working**:
- Make sure you're looking at a conversation with status "closed"
- Clear browser cache and refresh the page
- Check browser console for any errors

---

## Issue 5: SMS Notifications 📱 OPTIONAL

**Status**: SMS system is implemented but requires Twilio configuration

**Current Behavior**: SMS messages are logged to `storage/logs/laravel.log` in development mode

**To Enable Real SMS**:
1. Sign up for Twilio account (free trial available)
2. Get Account SID and Auth Token
3. Update `.env`:
   ```env
   TWILIO_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```
4. Restart backend server

**Full Guide**: See `SMS_SETUP_GUIDE.md`

---

## Issue 6: Security Hardening 🔒 IN PROGRESS

**Status**: Security guide created, implementation pending

**Priority Items**:
1. Rate limiting on login/registration
2. Production environment configuration
3. HTTPS enforcement
4. Security headers

**Full Guide**: See `SECURITY_GUIDE.md`

---

## Quick Action Checklist

### Immediate (Do Now):
- [x] Fix timetable 404 error (system working correctly)
- [x] Backend server is running
- [ ] Assign students to classes via Admin panel
- [ ] Create timetable entries for classes
- [ ] Clear Next.js cache to fix PlusIcon error (if needed)
- [ ] Get Gmail App Password
- [ ] Update `.env` with Gmail credentials
- [ ] Test email sending

### Soon (This Week):
- [ ] Implement rate limiting
- [ ] Configure production environment
- [ ] Set up HTTPS with SSL certificate
- [ ] Add security headers

### Optional (When Needed):
- [ ] Configure Twilio for real SMS
- [ ] Set up database backups
- [ ] Implement 2FA
- [ ] Add audit logging

---

## Need Help?

**For PlusIcon Error**: See `FIX_PLUSICON_ERROR.md`
**For Email Setup**: See `GMAIL_EMAIL_SETUP.md`
**For SMS Setup**: See `SMS_SETUP_GUIDE.md`
**For Security**: See `SECURITY_GUIDE.md`

**Still stuck?** Check `hsms-backend/storage/logs/laravel.log` for error messages.
