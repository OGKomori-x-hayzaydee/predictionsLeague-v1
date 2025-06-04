package com.komori.predictions.controller;

import com.komori.predictions.io.ProfileRequest;
import com.komori.predictions.io.ProfileResponse;
import com.komori.predictions.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest profileRequest) {
        // extra functionality
        return profileService.createProfile(profileRequest);
    }
}
