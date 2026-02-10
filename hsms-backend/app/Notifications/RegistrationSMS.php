<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Channels\SmsChannel;

class RegistrationSMS extends Notification
{
    use Queueable;

    protected $studentId;
    protected $verificationCode;
    protected $phone;

    /**
     * Create a new notification instance.
     */
    public function __construct($phone, $studentId = null, $verificationCode = null)
    {
        $this->phone = $phone;
        $this->studentId = $studentId;
        $this->verificationCode = $verificationCode;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [SmsChannel::class];
    }

    /**
     * Get the SMS representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toSms(object $notifiable): array
    {
        $message = "Welcome to Tereta High School! Your registration was successful.";
        
        if ($this->studentId) {
            $message .= " Student ID: {$this->studentId}.";
        }
        
        if ($this->verificationCode) {
            $message .= " Verification code: {$this->verificationCode}.";
        }
        
        $message .= " Login at: " . env('FRONTEND_URL', 'http://localhost:3000') . "/login";

        return [
            'to' => $this->phone,
            'message' => $message
        ];
    }
}
