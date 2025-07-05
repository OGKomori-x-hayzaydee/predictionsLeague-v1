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
        mailMessage.setSubject("Welcome to the Predictions League!");
        mailMessage.setText("Hello " + name + ",\n\n" +
                "Welcome to the Predictions League! We hope you love your time here!\n\n" +
                "Regards,\nTega from the Predictions Team");
        mailSender.send(mailMessage);
    }

    public void sendVerifyOtpEmail(String toEmail, String name, String otp) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("Verify your Account");
        mailMessage.setText("Hello " + name + ",\n\n" +
                "Welcome again! Verify your account with the following 6-digit code:\n\n" +
                "Code: " + otp + "\n\n" +
                "Regards,\nTega from the Predictions Team");
        mailSender.send(mailMessage);
    }

    public void sendAccountVerifiedEmail(String toEmail, String name) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("Account Verified Successfully!");
        mailMessage.setText("Hello " + name + ",\n\n" +
                "Your account has been verified successfully.\n\n" +
                "Regards,\nTega from the Predictions Team");
        mailSender.send(mailMessage);
    }

}
