package com.komori.predictions.controller;

import com.komori.predictions.dto.response.DashboardDetails;
import com.komori.predictions.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/me")
    public ResponseEntity<DashboardDetails> getCurrentUser(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        DashboardDetails details = dashboardService.getDashboardDetails(email);
        return ResponseEntity.ok(details);
    }
}
