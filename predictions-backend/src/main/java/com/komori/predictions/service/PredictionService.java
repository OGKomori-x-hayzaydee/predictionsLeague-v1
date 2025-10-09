package com.komori.predictions.service;

import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final PredictionRepository predictionRepository;

    @Transactional(readOnly = true)
    public Set<PredictionEntity> getPredictionsForUser(String email) {
        return predictionRepository.findAllByUser_Email(email);
    }
}
