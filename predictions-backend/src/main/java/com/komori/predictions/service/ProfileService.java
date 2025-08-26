package com.komori.predictions.service;

import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.exception.PasswordMismatchException;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void resetPassword(String email) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        emailService.sendResetPasswordEmail(email, currentUser.getFirstName());
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            throw new PasswordMismatchException();
        }

        currentUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);
        emailService.sendChangedPasswordEmail(email, currentUser.getFirstName());
    }
}
