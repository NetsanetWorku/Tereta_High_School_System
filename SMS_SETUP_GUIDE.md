# SMS Notification Setup Guide

## Overview
The system now supports SMS notifications for registration confirmations. SMS messages include Student ID and verification codes.

## Current Setup (Development)

SMS messages are logged to `storage/logs/laravel.log` for testing, similar to emails.

### What's Included in SMS:
- Welcome message
- Student ID (for students)
- Verification code
- Login link

### Example SMS Message:
```
Welcome to HSMS! Your registration was successful. Student ID: STU20260037. Verification code: 275309. Login at: http://localhost:3000/login
```

## How to Test

### 1. Register with Phone Number:
1. Go to `/register`
2. Fill in the form
3. **Add your phone number** in the "Phone Number" field
4. Submit registration

### 2. Check SMS Log:
Open `hsms-backend/storage/logs/laravel.log` and look for:
```
=== SMS NOTIFICATION ===
To: +1234567890
Message: Welcome to HSMS! Your registration was successful...
========================
```

## Production Setup with Twilio

To send real SMS messages in production, follow these steps:

### Step 1: Install Twilio SDK
```bash
cd hsms-backend
composer require twilio/sdk
```

### Step 2: Get Twilio Credentials
1. Sign up at https://www.twilio.com
2. Get your Account SID
3. Get your Auth Token
4. Get a Twilio phone number

### Step 3: Update `.env`
```env
TWILIO_SID=your_account_sid
TWILIO_TOKEN=your_auth_token
TWILIO_FROM=+1234567890
```

### Step 4: Update `config/services.php`
Add Twilio configuration:
```php
'twilio' => [
    'sid' => env('TWILIO_SID'),
    'token' => env('TWILIO_TOKEN'),
    'from' => env('TWILIO_FROM'),
],
```

### Step 5: Enable Twilio in SmsChannel
Edit `app/Channels/SmsChannel.php`:

Uncomment the Twilio integration:
```php
public function send(object $notifiable, Notification $notification): void
{
    $message = $notification->toSms($notifiable);

    // For production: Send via Twilio
    $this->sendViaTwilio($message);
    
    // Keep logging for debugging
    Log::channel('single')->info('SMS sent to: ' . $message['to']);
}

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

### Step 6: Test
```bash
php artisan config:clear
php artisan serve
```

Register a new user with a real phone number and you'll receive an SMS!

## Alternative SMS Services

### Nexmo (Vonage)
```bash
composer require nexmo/laravel
```

### AWS SNS
```bash
composer require aws/aws-sdk-php
```

### Africa's Talking (for African countries)
```bash
composer require africastalking/africastalking
```

## Phone Number Format

The system accepts phone numbers in any format, but for best results:
- Use international format: `+1234567890`
- Include country code
- No spaces or special characters

### Examples:
- ✅ `+251912345678` (Ethiopia)
- ✅ `+1234567890` (USA)
- ✅ `+447123456789` (UK)
- ❌ `(123) 456-7890` (formatted)
- ❌ `123-456-7890` (no country code)

## Features

### 1. Optional Phone Number
- Phone number is optional during registration
- If provided, SMS is sent
- If not provided, only email is sent

### 2. Dual Notifications
- Email notification (always sent)
- SMS notification (sent if phone provided)
- Both contain same information

### 3. Verification Code
- 6-digit code
- Valid for 24 hours
- Sent via both email and SMS

## Database Schema

### Users Table - New Field:
- `phone` (string, 20 chars, nullable)

## Cost Considerations

### Twilio Pricing (approximate):
- SMS: $0.0075 per message (USA)
- Varies by country
- Free trial credits available

### Tips to Reduce Costs:
1. Make SMS optional
2. Use SMS only for critical notifications
3. Batch notifications
4. Use email as primary channel

## Security Best Practices

1. **Validate Phone Numbers**: Use a library like `libphonenumber`
2. **Rate Limiting**: Prevent SMS spam
3. **Secure Credentials**: Never commit Twilio credentials
4. **Use Environment Variables**: Store in `.env`
5. **Monitor Usage**: Set up Twilio alerts

## Troubleshooting

### SMS Not Sending?
1. Check `storage/logs/laravel.log` for errors
2. Verify Twilio credentials
3. Check phone number format
4. Verify Twilio account balance
5. Check Twilio dashboard for delivery status

### Phone Number Invalid?
1. Ensure international format
2. Include country code
3. Remove spaces and special characters
4. Use Twilio's phone number lookup API

### SMS Not Received?
1. Check spam/blocked messages
2. Verify phone number is correct
3. Check carrier restrictions
4. Try different phone number
5. Check Twilio logs

## Testing Without Real SMS

### Option 1: Log Channel (Current)
SMS messages logged to file

### Option 2: Mailtrap for SMS
Some services offer SMS testing endpoints

### Option 3: Twilio Test Credentials
Twilio provides test credentials that don't send real SMS

## Future Enhancements

1. **SMS Templates**: Create reusable SMS templates
2. **Delivery Status**: Track SMS delivery
3. **Retry Logic**: Retry failed SMS
4. **Multiple Languages**: Support SMS in different languages
5. **SMS Verification**: Require SMS verification before login
6. **Two-Factor Auth**: Use SMS for 2FA

## Support

For issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check Twilio logs: https://www.twilio.com/console/sms/logs
3. Verify phone number format
4. Test with Twilio's API explorer

## Example Registration Flow

1. User fills registration form
2. User provides phone number (optional)
3. Backend creates account
4. Backend generates verification code
5. Backend sends email notification
6. Backend sends SMS notification (if phone provided)
7. User receives both email and SMS
8. User can login with credentials from either channel

## SMS Message Customization

To customize SMS messages, edit `app/Notifications/RegistrationSMS.php`:

```php
public function toSms(object $notifiable): array
{
    $message = "Your custom message here";
    
    if ($this->studentId) {
        $message .= " ID: {$this->studentId}";
    }
    
    return [
        'to' => $this->phone,
        'message' => $message
    ];
}
```

## Compliance

### GDPR Considerations:
- Get consent before sending SMS
- Allow users to opt-out
- Store phone numbers securely
- Provide data deletion option

### TCPA (USA):
- Get explicit consent
- Provide opt-out mechanism
- Don't send marketing SMS without consent

## Monitoring

### Metrics to Track:
- SMS delivery rate
- SMS cost per user
- Failed deliveries
- User opt-out rate
- Response time

### Twilio Dashboard:
- View all sent messages
- Check delivery status
- Monitor costs
- Set up alerts
