package com.komori.predictions.controller;

import com.komori.predictions.dto.response.DashboardEssentials;
import com.komori.predictions.dto.response.DashboardLeagueSummary;
import com.komori.predictions.dto.response.DashboardPredictionSummary;
import com.komori.predictions.dto.response.Match;
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
    public ResponseEntity<DashboardEssentials> getCurrentUser(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        DashboardEssentials details = dashboardService.getDashboardDetails(email);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/predictions/recent")
    public ResponseEntity<Set<DashboardPredictionSummary>> getPredictions(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        Set<DashboardPredictionSummary> predictions = dashboardService.getPredictions(email);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/leagues/user")
    public ResponseEntity<Set<DashboardLeagueSummary>> getLeagues(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        Set<DashboardLeagueSummary> leagues = dashboardService.getLeagues(email);
        return ResponseEntity.ok(leagues);
    }

    @GetMapping("/matches/upcoming")
    public ResponseEntity<Set<Match>> getMatches(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        Set<Match> matches = dashboardService.getMatches(email);
        return ResponseEntity.ok(matches);
    }
}
