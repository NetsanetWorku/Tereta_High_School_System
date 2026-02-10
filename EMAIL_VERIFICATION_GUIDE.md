# Email Verification & Student ID Guide

## ✅ System is Working!

The email system is successfully sending registration confirmations with Student IDs.

## How to Check Your Email

Since we're in development mode, emails are logged to a file instead of being sent to real email addresses.

### Method 1: View in Browser
Visit: **http://localhost:8000/test-email**

This will show you the last email that was sent, formatted as HTML.

### Method 2: Check Log File
Open: `hsms-backend/storage/logs/laravel.log`

Scroll to the bottom to see the most recent email.

## Example Email Content

From the log, here's what a student registration email contains:

```
Hello Netsanet Worku!

Your registration was successful!

Your Student ID: STU20260034

You can use your Name and Student ID to login to the system.

Your verification code: 275309

This code will expire in 24 hours.

[Login Now Button]

Thank you for joining us!
```

## How to Login as a Student

1. Go to **http://localhost:3000/login**
2. Click the **"Student Login"** tab
3. Enter:
   - **Name**: Netsanet Worku (exact name from registration)
   - **Student ID**: STU20260034 (from email)
4. Click **"Sign in"**

## Student ID Format

- Format: `STU{YEAR}{USER_ID}`
- Example: `STU20260034`
  - `STU` = Student prefix
  - `2026` = Current year
  - `0034` = User ID (padded to 4 digits)

## Registration Success Screen

After registration, you should see:
- ✅ Green checkmark icon
- ✅ "Registration Successful!" message
- ✅ Email confirmation notice
- ✅ Student ID displayed prominently (for students)
- ✅ Copy button for Student ID
- ✅ Login instructions
- ✅ "Go to Login Page" button

## Troubleshooting

### Student ID Not Showing on Success Screen?

1. Open browser console (F12)
2. Look for: `Registration result:` log
3. Check if `student_id` is in the response
4. If missing, check backend response

### Email Not in Log File?

1. Check if `storage/logs/laravel.log` exists
2. Verify `.env` has: `MAIL_MAILER=log`
3. Check for errors in Laravel log
4. Restart backend server: `php artisan serve`

### Can't Login with Student ID?

1. Verify you're using the **exact name** from registration
2. Check Student ID matches the one in email
3. Make sure you're on the "Student Login" tab
4. Names are case-insensitive but must match exactly

## Testing the System

### Register a New Student:
1. Go to `/register`
2. Select "Student" role
3. Fill in:
   - Name: Test Student
   - Email: test@example.com
   - Grade: 10
   - Password: password123
4. Submit form
5. Note the Student ID on success screen
6. Check email at: http://localhost:8000/test-email

### Login with Student ID:
1. Go to `/login`
2. Click "Student Login" tab
3. Enter Name and Student ID
4. Login successfully

## Production Setup

To send real emails in production:

1. Update `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourschool.edu"
MAIL_FROM_NAME="Your School Name"
```

2. For Gmail:
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use App Password in MAIL_PASSWORD

3. Restart server:
```bash
php artisan config:clear
php artisan serve
```

## Email Contains:

✅ Welcome message with user's name
✅ Student ID (for students only)
✅ Verification code (6 digits)
✅ Login instructions
✅ Direct link to login page
✅ Code expiration notice (24 hours)

## Database Fields:

- `verification_code`: 6-digit code
- `verification_code_expires_at`: Expiration timestamp
- `is_verified`: Boolean (currently not enforced)

## Future Enhancements:

1. **Require Email Verification**: Block login until email is verified
2. **SMS Notifications**: Send Student ID via SMS
3. **Resend Code**: Allow users to request new verification code
4. **Password Reset**: Use verification code for password reset
5. **Real-time Email**: Switch to queue for faster response

## Support

If you encounter issues:
1. Check `storage/logs/laravel.log` for errors
2. Verify database migrations ran: `php artisan migrate:status`
3. Clear cache: `php artisan config:clear`
4. Restart servers (backend and frontend)
