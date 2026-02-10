<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class SmsChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        $message = $notification->toSms($notifiable);

        // For development: Log SMS to file
        // For production: Integrate with Twilio, Nexmo, etc.
        
        Log::channel('single')->info('=== SMS NOTIFICATION ===');
        Log::channel('single')->info('To: ' . $message['to']);
        Log::channel('single')->info('Message: ' . $message['message']);
        Log::channel('single')->info('========================');
        
        // Uncomment below for production with Twilio
        // $this->sendViaTwilio($message);
    }

    /**
     * Send SMS via Twilio (for production)
     */
    protected function sendViaTwilio(array $message): void
    {
        // Example Twilio integration
        // $twilio = new \Twilio\Rest\Client(
        //     config('services.twilio.sid'),
        //     config('services.twilio.token')
        // );
        // 
        // $twilio->messages->create(
        //     $message['to'],
        //     [
        //         'from' => config('services.twilio.from'),
        //         'body' => $message['message']
        //     ]
        // );
    }
}
