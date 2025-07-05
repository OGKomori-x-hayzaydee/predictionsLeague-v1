package com.komori.predictions.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    @GetMapping("/home")
    public ResponseEntity<?> viewHomepage(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return ResponseEntity.ok("Viewing the HomePage of " + email);
    }
}
