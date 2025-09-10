package com.komori.predictions.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.komori.predictions.dto.request.EmailRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final RestTemplate restTemplate;
    @Value("${brevo.from-email}")
    private String fromEmail;
    @Value("${brevo.api-key}")
    private String apiKey;
    private final String fromName = "The Predictions League";

    public void sendWelcomeEmail(String toEmail, String name) {
        String htmlContent = """
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <p>Hello <b>%s</b>,</p>
            <p>Welcome to the <b>Predictions League</b>\s
            We know you'll love your time here!</p>
            <p>Regards,<br>
            Tega from the Predictions Team</p>
          </body>
        </html>
       """.formatted(name);
        EmailRequest request = EmailRequest.builder()
                .to(List.of(new EmailRequest.NameAndEmail(toEmail, name)))
                .sender(new EmailRequest.NameAndEmail(fromEmail, fromName))
                .subject("👋🏾 Welcome to the Predictions League!")
                .htmlContent(htmlContent)
                .build();

        try {
            log.info("Request:\n\n\n{}", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(request));
        } catch (JsonProcessingException e) {
            log.error("Json Exception.");
        }

        sendEmail(request);
    }

    public void sendVerifyOtpEmail(String toEmail, String name, String otp) {
        String htmlContent = """
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <p>Hello <b>%s</b>,</p>
            <p>Welcome (again)! To login, verify your account with the following 6-digit code:</p>
            <p style="font-size: 20px; font-weight: bold; color: #2c3e50; margin: 16px 0;">
            Code: <span style="color: #e74c3c;">%s</span></p>
            <p>This code expires in <b>15 minutes</b>.<br></p>
            <p>Regards,<br>
            Tega from the Predictions Team</p>
          </body>
        </html>
        """.formatted(name, otp);
        EmailRequest request = EmailRequest.builder()
                .to(List.of(new EmailRequest.NameAndEmail(toEmail, name)))
                .sender(new EmailRequest.NameAndEmail(fromEmail, fromName))
                .subject("🔒 Verify your Account")
                .htmlContent(htmlContent)
                .build();

        sendEmail(request);
    }

    public void sendAccountVerifiedEmail(String toEmail, String name) {
        String htmlContent = """
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <p>Hello <b>%s</b>,</p>
            <p>Your account has been <b style="color: #27ae60;">verified successfully</b>!
            That was fast btw.</p>
            <p>Regards,<br>
            Tega from the Predictions Team</p>
          </body>
        </html>
        """.formatted(name);

        EmailRequest request = EmailRequest.builder()
                .to(List.of(new EmailRequest.NameAndEmail(toEmail, name)))
                .sender(new EmailRequest.NameAndEmail(fromEmail, fromName))
                .subject("🔓 Account Verified Successfully!")
                .htmlContent(htmlContent)
                .build();

        sendEmail(request);
    }

    public void sendResetPasswordEmail(String toEmail, String name) {
        String htmlContent = """
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <p>Hello <b>%s</b>,</p>

    <p>We've received a request to reset your password. Click the link below to verify:</p>

    <p style="margin: 20px 0;">
      <a href="#" style="background-color: #3498db; color: #fff; padding: 10px 16px;
         text-decoration: none; border-radius: 6px; font-weight: bold;">
        Reset Password
      </a>
    </p>

    <p>If you didn't request this, you can safely ignore this email. Or archive it. Or delete it.
    The choice is yours tbh.</p>

    <p>You should be more concerned that someone's trying to reset your password anyway so...</p>

    <p>Regards,<br>
    Tega from the Predictions Team</p>
  </body>
</html>
""".formatted(name);

        EmailRequest request = EmailRequest.builder()
                .to(List.of(new EmailRequest.NameAndEmail(toEmail, name)))
                .sender(new EmailRequest.NameAndEmail(fromEmail, fromName))
                .subject("🗝️ Reset your password")
                .htmlContent(htmlContent)
                .build();

        sendEmail(request);
    }

    public void sendChangedPasswordEmail(String toEmail, String name) {
        String htmlContent = """
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <p>Hello <b>%s</b>,</p>

    <p>Your password has just been <b style="color: #27ae60;">changed successfully</b>.</p>

    <p>Regards,<br>
    Tega from the Predictions Team</p>
  </body>
</html>
""".formatted(name);

        EmailRequest request = EmailRequest.builder()
                .to(List.of(new EmailRequest.NameAndEmail(toEmail, name)))
                .sender(new EmailRequest.NameAndEmail(fromEmail, fromName))
                .subject("✅ Your password has been changed")
                .htmlContent(htmlContent)
                .build();

        sendEmail(request);
    }

    private void sendEmail(EmailRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        HttpEntity<EmailRequest> httpEntity = new HttpEntity<>(request, headers);

        ResponseEntity<?> response = restTemplate.postForEntity(
                "https://api.brevo.com/v3/smtp/email",
                httpEntity,
                Object.class
        );

        if (response.getStatusCode().isError()) {
            throw new MailSendException("Welcome mail not sent: " + response.getBody());
        }
    }
}
