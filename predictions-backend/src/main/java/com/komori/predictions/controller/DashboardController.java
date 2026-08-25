package com.komori.predictions.controller;

import com.komori.predictions.dto.response.DashboardEssentials;
import com.komori.predictions.dto.response.DashboardLeagueSummary;
import com.komori.predictions.dto.response.DashboardPredictionSummary;
import com.komori.predictions.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/me")
    public ResponseEntity<DashboardEssentials> getCurrentUser(@CurrentSecurityContext(expression = "authentication?.name") String uuid) {
        DashboardEssentials details = dashboardService.getDashboardDetails(uuid);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/predictions/recent")
    public ResponseEntity<Set<DashboardPredictionSummary>> getPredictions(@CurrentSecurityContext(expression = "authentication?.name") String uuid) {
        Set<DashboardPredictionSummary> predictions = dashboardService.getPredictions(uuid);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/leagues/user")
    public ResponseEntity<Set<DashboardLeagueSummary>> getLeagues(@CurrentSecurityContext(expression = "authentication?.name") String uuid) {
        Set<DashboardLeagueSummary> leagues = dashboardService.getLeagues(uuid);
        return ResponseEntity.ok(leagues);
    }
}
