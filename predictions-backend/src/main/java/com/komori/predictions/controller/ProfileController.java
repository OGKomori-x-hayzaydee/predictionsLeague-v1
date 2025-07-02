package com.komori.predictions.controller;

import com.komori.predictions.io.ProfileRequest;
import com.komori.predictions.io.ProfileResponse;
import com.komori.predictions.service.EmailService;
import com.komori.predictions.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody ProfileRequest profileRequest) {
        ProfileResponse response = profileService.createProfile(profileRequest);
        emailService.sendWelcomeEmail(response.getEmail(), response.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/profile")
    // This annotation injects the currently authenticated user's name into the email parameter
    // The question mark after authentication makes it null-safe
    // If name parameter is null then user is (ideally) prompted to log in
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return profileService.getProfile(email);
    }
}
