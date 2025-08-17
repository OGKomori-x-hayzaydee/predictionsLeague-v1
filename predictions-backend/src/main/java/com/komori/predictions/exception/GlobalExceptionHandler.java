package com.komori.predictions.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AccountNotVerifiedException.class)
    public ResponseEntity<?> handleAccountNotVerified(AccountNotVerifiedException e) {
        return buildResponse(e, HttpStatus.BAD_REQUEST, "Account not verified");
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<?> handleEmailAlreadyExists(EmailAlreadyExistsException e) {
        return buildResponse(e, HttpStatus.CONFLICT, "Email already exists");
    }

    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<?> handleOtpExpired(OtpExpiredException e) {
        return buildResponse(e, HttpStatus.BAD_REQUEST, "OTP expired");
    }

    @ExceptionHandler(OtpIncorrectException.class)
    public ResponseEntity<?> handleOtpIncorrect(OtpIncorrectException e) {
        return buildResponse(e, HttpStatus.BAD_REQUEST, "OTP incorrect");
    }

    @ExceptionHandler(OtpNotFoundException.class)
    public ResponseEntity<?> handleOtpNotFound(OtpNotFoundException e) {
        return buildResponse(e, HttpStatus.NOT_FOUND, "OTP not found for user");
    }

    @ExceptionHandler(MailException.class)
    public ResponseEntity<?> handleMailException(MailException e) {
        return buildResponse(e, HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCreds(BadCredentialsException e) {
        return buildResponse(e, HttpStatus.BAD_REQUEST, "Email or password incorrect");
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> handleUsernameNotFound(UsernameNotFoundException e) {
        return buildResponse(e, HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<?> handlePasswordMismatch(PasswordMismatchException e) {
        return buildResponse(e, HttpStatus.BAD_REQUEST, "Password is incorrect");
    }

    @ExceptionHandler(LeagueNotFoundException.class)
    public ResponseEntity<?> handleLeagueNotFound(LeagueNotFoundException e) {
        return buildResponse(e, HttpStatus.NOT_FOUND, "League not found");
    }

    @ExceptionHandler(IncorrectLeagueCodeException.class)
    public ResponseEntity<?> handleIncorrectLeague(IncorrectLeagueCodeException e) {
        return buildResponse(e, HttpStatus.BAD_REQUEST, "Incorrect league code");
    }

    @ExceptionHandler(PublicityMismatchException.class)
    public ResponseEntity<?> handlePublicityMismatch(PublicityMismatchException e) {
        return buildResponse(e, HttpStatus.BAD_REQUEST, "Publicity mismatch");
    }

    @ExceptionHandler(LeagueAlreadyJoinedException.class)
    public ResponseEntity<?> handleLeagueAlreadyJoined(LeagueAlreadyJoinedException e) {
        return buildResponse(e, HttpStatus.CONFLICT, "League already joined");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception e) {
        return buildResponse(e, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    private ResponseEntity<?> buildResponse(Exception e, HttpStatus status, String message) {
        log.error("Error occurred: ", e);
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
