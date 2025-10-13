package com.komori.predictions.service;

import com.komori.predictions.dto.request.PredictionRequest;
import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.PredictionRepository;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;

    public Set<PredictionEntity> getPredictionsForUser(String email) {
        return predictionRepository.findAllByUser_Email(email);
    }

    public void makePrediction(String email, PredictionRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
        predictionRepository.save(new PredictionEntity(user, request));
    }
}
