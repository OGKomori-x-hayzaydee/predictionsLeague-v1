package com.komori.predictions.service;

import com.komori.predictions.dto.request.RegistrationCallbackRequest;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuth2Service {
    private final UserRepository userRepository;

    public void finishRegistration(String email, RegistrationCallbackRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));

        user.setFavouriteTeam(request.getFavouriteTeam());
        user.setUsername(request.getUsername());
        userRepository.save(user);
    }
}
