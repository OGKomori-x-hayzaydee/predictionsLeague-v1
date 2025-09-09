package com.komori.predictions.service;

import com.komori.predictions.dto.response.DashboardDetails;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;

    public DashboardDetails getDashboardDetails(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return userEntityToDashboardDetails(user);
    }

    private DashboardDetails userEntityToDashboardDetails(UserEntity user) {
        return DashboardDetails.builder()
                .email(user.getEmail())
                .favouriteTeam(user.getFavouriteTeam())
                .lastName(user.getLastName())
                .firstName(user.getFirstName())
                .username(user.getUsername())
                .profilePicture(user.getProfilePictureUrl())
                .build();
    }
}
