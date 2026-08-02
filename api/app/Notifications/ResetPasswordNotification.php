<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    public function __construct(string $token, protected string $baseUrl)
    {
        parent::__construct($token);
    }

    public function toMail($notifiable): MailMessage
    {
        $url = sprintf(
            '%s/reset-password?token=%s&email=%s',
            rtrim($this->baseUrl, '/'),
            $this->token,
            urlencode($notifiable->getEmailForPasswordReset())
        );

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $url)
            ->line('This password reset link will expire in '.config('auth.passwords.users.expire').' minutes.')
            ->line('If you did not request a password reset, no further action is required.');
    }
}
