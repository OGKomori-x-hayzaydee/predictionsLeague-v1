package com.komori.predictions.controller;

import com.komori.predictions.dto.request.PasswordChangeRequest;
import com.komori.predictions.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/home")
    public ResponseEntity<String> viewHomepage(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        // Testing CurrentSecurityContext
        return ResponseEntity.ok("Viewing the HomePage of " + email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(String email) {
        profileService.resetPassword(email);
        return ResponseEntity.ok("ResetPassword Email sent successfully");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@CurrentSecurityContext(expression = "authentication?.name") String email, @RequestBody PasswordChangeRequest request) {
        profileService.changePassword(email, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }
}
