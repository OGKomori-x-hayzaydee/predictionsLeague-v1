package com.komori.predictions.controller;

import com.komori.predictions.dto.request.PredictionRequest;
import com.komori.predictions.dto.response.UserPrediction;
import com.komori.predictions.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/predictions")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;

    @GetMapping("/user")
    public ResponseEntity<List<UserPrediction>> getPredictionsForUser(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        List<UserPrediction> predictions = predictionService.getPredictionsForUser(email);
        return ResponseEntity.ok(predictions);
    }

    @PostMapping("/make-prediction")
    public ResponseEntity<String> makePrediction(@RequestBody PredictionRequest request, @CurrentSecurityContext(expression = "authentication?.name") String email) {
        predictionService.makePrediction(email, request);
        return ResponseEntity.ok("Prediction made successfully!");
    }
}
