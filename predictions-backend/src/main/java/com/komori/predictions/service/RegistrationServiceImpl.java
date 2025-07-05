package com.komori.predictions.service;

import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.io.RegistrationRequest;
import com.komori.predictions.io.RegistrationResponse;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public RegistrationResponse registerNewUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        UserEntity newUser = convertToUserEntity(request);
        userRepository.save(newUser);
        return convertToRegistrationResponse(newUser);
    }

    private UserEntity convertToUserEntity(RegistrationRequest request) {
        return UserEntity.builder()
                .userID(UUID.randomUUID().toString())
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountVerified(false)
                .build();
    }

    private RegistrationResponse convertToRegistrationResponse(UserEntity entity) {
        return RegistrationResponse.builder()
                .userID(entity.getUserID())
                .name(entity.getName())
                .email(entity.getEmail())
                .accountVerified(entity.getAccountVerified())
                .build();
    }
}
