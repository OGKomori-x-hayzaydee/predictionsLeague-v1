package com.komori.predictions.service;

import com.komori.predictions.entity.PredictionEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final UserRepository userRepository;

    public Set<PredictionEntity> getPredictionsForUser(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return user.getPredictions();
    }
}
