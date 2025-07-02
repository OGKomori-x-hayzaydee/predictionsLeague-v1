package com.komori.predictions.service;

import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.io.ProfileRequest;
import com.komori.predictions.io.ProfileResponse;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ProfileResponse createProfile(ProfileRequest profileRequest) {
        if (userRepository.existsByEmail(profileRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        UserEntity newProfile = profileRequestToUserEntity(profileRequest); // Convert request to user entity
        newProfile = userRepository.save(newProfile);
        return userEntityToProfileResponse(newProfile);
    }

    @Override
    public ProfileResponse getProfile(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return userEntityToProfileResponse(existingUser);
    }

    private UserEntity profileRequestToUserEntity(ProfileRequest profileRequest) {
        return UserEntity.builder()
                .email(profileRequest.getEmail())
                .userID(UUID.randomUUID().toString())
                .name(profileRequest.getName())
                .password(passwordEncoder.encode(profileRequest.getPassword()))
                .accountVerified(false)
                .resetOTPExpireAt(0L)
                .verifyOTP(null)
                .verifyOTPExpireAt(0L)
                .resetOTP(null)
                .build();
    }

    private ProfileResponse userEntityToProfileResponse(UserEntity userEntity) {
        return ProfileResponse.builder()
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .userID(userEntity.getUserID())
                .accountVerified(userEntity.getAccountVerified())
                .build();
    }
}
