package com.komori.predictions.controller;

import com.komori.predictions.dto.request.PasswordChangeRequest;
import com.komori.predictions.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(String email) {
        profileService.resetPassword(email);
        return ResponseEntity.ok("ResetPassword Email sent successfully");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@CurrentSecurityContext(expression = "authentication?.name") String email,
                                            @RequestBody PasswordChangeRequest request) {
        profileService.changePassword(email, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/upload")
    public ResponseEntity<?> setProfilePicture(@CurrentSecurityContext(expression = "authentication?.name") String email,
                                               @RequestParam MultipartFile file) throws IOException {
        String url = profileService.setProfilePicture(file, email);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
