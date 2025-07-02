package com.komori.predictions.controller;

import com.komori.predictions.io.ProfileRequest;
import com.komori.predictions.io.ProfileResponse;
import com.komori.predictions.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest profileRequest) {
        // extra functionality
        return profileService.createProfile(profileRequest);
    }

    @GetMapping("/profile")
    // Annotation checks that user is still logged in before viewing profile
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return profileService.getProfile(email);
    }
}
