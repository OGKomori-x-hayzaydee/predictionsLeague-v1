package com.komori.predictions.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;
    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("👋🏾 Welcome to the Predictions League!");
        mailMessage.setText("Hello " + name + ",\n\n" +
                "Welcome to the Predictions League (took you long enough to join lol)! We know you'll love your time here!\n\n" +
                "Regards,\nTega from the Predictions Team");
        mailSender.send(mailMessage);
    }

    public void sendVerifyOtpEmail(String toEmail, String name, String otp) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("🔒 Verify your Account");
        mailMessage.setText("Hello " + name + ",\n\n" +
                "Welcome (again)! To login, verify your account with the following 6-digit code:\n\n" +
                "Code: " + otp + "\n\n" +
                "This code expires in 15 minutes.\nBe quick! You don't have much time...\n\n" +
                "Regards,\nTega from the Predictions Team");
        mailSender.send(mailMessage);
    }

    public void sendAccountVerifiedEmail(String toEmail, String name) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("🔓 Account Verified Successfully!");
        mailMessage.setText("Hello " + name + ",\n\n" +
                "Your account has been verified successfully! That was fast btw.\n\n" +
                "Regards,\nTega from the Predictions Team");
        mailSender.send(mailMessage);
    }

    public void sendResetPasswordEmail(String toEmail, String name) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("🗝️ Reset your password");
        mailMessage.setText("Hello " + name + ",\n\n" +
                "We've received a request to reset your password. Click the link to verify:\n\n" +
                "If you didn't request this, you can safely ignore this email. Or archive it. Or delete it. The choice is yours tbh.\n" +
                "You should be more concerned that someone's trying to reset your password anyway so...\n\n" +
                "Regards,\nTega from the Predictions Team");
        mailSender.send(mailMessage);
    }

    public void sendChangedPasswordEmail(String toEmail, String name) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("✅ Your password has been changed");
        mailMessage.setText("Hello " + name + ",\n\n" +
                "Your password has just been changed successfully.\n\n" +
                "If you didn't do this yourself, you can safely assume that you're cooked.😂😂\n\n" +
                "Regards,\nTega from the Predictions Team");
        mailSender.send(mailMessage);
    }
}
