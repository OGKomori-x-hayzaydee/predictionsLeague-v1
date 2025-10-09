package com.komori.predictions.controller;

import com.komori.predictions.dto.request.PasswordChangeRequest;
import com.komori.predictions.dto.response.ProfileOverview;
import com.komori.predictions.dto.response.StatsHighlights;
import com.komori.predictions.dto.response.StatsMonthlyPerformance;
import com.komori.predictions.dto.response.StatsTeamPerformance;
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

    @GetMapping
    public ResponseEntity<ProfileOverview> viewProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        ProfileOverview overview = profileService.viewProfile(email);
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/statistics/highlights")
    public ResponseEntity<StatsHighlights> getStatsHighlights(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        StatsHighlights highlights = profileService.getStatsHighlights(email);
        return ResponseEntity.ok(highlights);
    }

    @GetMapping("/statistics/team-performance")
    public ResponseEntity<StatsTeamPerformance> getTeamPerformance(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        StatsTeamPerformance performance = profileService.getTeamPerformance(email);
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/statistics/monthly-performance")
    public ResponseEntity<StatsMonthlyPerformance> getMonthlyPerformance(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        StatsMonthlyPerformance performance = profileService.getMonthlyPerformance(email);
        return ResponseEntity.ok(performance);
    }

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
