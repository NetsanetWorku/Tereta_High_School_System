<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RegistrationSuccess extends Notification
{
    use Queueable;

    protected $studentId;
    protected $verificationCode;

    /**
     * Create a new notification instance.
     */
    public function __construct($studentId = null, $verificationCode = null)
    {
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
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Welcome to Tereta High School Management System!')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your registration was successful!');

        // Add student-specific information
        if ($this->studentId) {
            $message->line('Your Student ID: ' . $this->studentId)
                    ->line('You can use your Name and Student ID to login to the system.');
        } else {
            $message->line('You can now login using your email and password.');
        }

        // Add verification code if provided
        if ($this->verificationCode) {
            $message->line('Your verification code: ' . $this->verificationCode)
                    ->line('This code will expire in 24 hours.');
        }

        $message->action('Login Now', url(env('FRONTEND_URL', 'http://localhost:3000') . '/login'))
                ->line('Thank you for joining us!');

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
