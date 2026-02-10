# Gmail Email Setup Guide

## ✅ I've Updated Your `.env` File

The `.env` file has been configured to use Gmail SMTP. Now you need to complete these steps:

## Step 1: Get Your Gmail App Password

### For Gmail Users:

1. **Enable 2-Factor Authentication** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the steps to enable it

2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Windows Computer" (or Other)
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

3. **Update Your `.env` File**:
   Open `hsms-backend/.env` and replace:
   ```env
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password-here
   ```
   
   With your actual email and app password:
   ```env
   MAIL_USERNAME=yourname@gmail.com
   MAIL_PASSWORD=abcdefghijklmnop
   ```
   
   **Note**: Remove spaces from the app password!

## Step 2: Restart Your Backend Server

After updating the `.env` file:

```bash
cd hsms-backend
php artisan config:clear
php artisan cache:clear
php artisan serve
```

## Step 3: Test Email Sending

Register a new user and check your actual email inbox!

---

## Alternative Email Providers:

### Using Outlook/Hotmail:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=your-email@outlook.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
```

### Using Yahoo Mail:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mail.yahoo.com
MAIL_PORT=587
MAIL_USERNAME=your-email@yahoo.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```

### Using Custom SMTP Server:
```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
```

---

## Troubleshooting:

### Email Not Sending?

1. **Check Gmail Settings**:
   - Make sure 2FA is enabled
   - Make sure you're using an App Password (not your regular password)
   - Remove spaces from the app password

2. **Check `.env` File**:
   - No quotes around values
   - No spaces in the app password
   - Correct email address

3. **Clear Cache**:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

4. **Check Laravel Logs**:
   Open `hsms-backend/storage/logs/laravel.log` for error messages

5. **Test Connection**:
   ```bash
   php artisan tinker
   Mail::raw('Test email', function($msg) {
       $msg->to('your-email@gmail.com')->subject('Test');
   });
   ```

### Common Errors:

**"Invalid credentials"**:
- You're using your regular password instead of an App Password
- 2FA is not enabled

**"Connection timeout"**:
- Check your internet connection
- Your firewall might be blocking port 587
- Try port 465 with `MAIL_ENCRYPTION=ssl`

**"Too many login attempts"**:
- Wait 15 minutes and try again
- Make sure you're using the correct app password

---

## Security Tips:

1. **Never commit `.env` to Git** - It's already in `.gitignore`
2. **Use App Passwords** - Never use your main Gmail password
3. **Rotate passwords regularly** - Generate new app passwords periodically
4. **Monitor usage** - Check Gmail's "Recent security activity"

---

## Production Recommendations:

For production, consider using:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **Amazon SES** (very cheap, pay-as-you-go)
- **Postmark** (reliable, good deliverability)

These services have better deliverability rates than Gmail SMTP.

---

## Quick Reference:

### Your Current Settings:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com  ← Replace this
MAIL_PASSWORD=your-app-password-here  ← Replace this
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@teretahs.edu"
MAIL_FROM_NAME="Tereta High School Management System"
```

### What You Need to Do:
1. ✅ Enable 2FA on your Gmail account
2. ✅ Generate an App Password
3. ✅ Update `MAIL_USERNAME` with your Gmail address
4. ✅ Update `MAIL_PASSWORD` with your App Password (no spaces)
5. ✅ Run `php artisan config:clear`
6. ✅ Restart your server
7. ✅ Test by registering a new user

---

## Need Help?

If you're still having issues:
1. Check the Laravel log: `hsms-backend/storage/logs/laravel.log`
2. Make sure your Gmail account allows "Less secure app access" (if not using App Password)
3. Try using a different email provider
4. Contact me with the specific error message

