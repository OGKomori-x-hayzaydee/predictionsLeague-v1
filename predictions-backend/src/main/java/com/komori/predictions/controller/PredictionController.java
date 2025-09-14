package com.komori.predictions.controller;

import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/predictions")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;

    @GetMapping("/user")
    public ResponseEntity<Set<PredictionEntity>> getPredictionsForUser(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        Set<PredictionEntity> predictions = predictionService.getPredictionsForUser(email);
        return ResponseEntity.ok(predictions);
    }
}
