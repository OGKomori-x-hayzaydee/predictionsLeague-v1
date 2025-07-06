package com.komori.predictions.service;

import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.io.RegistrationRequest;
import com.komori.predictions.io.RegistrationResponse;
import com.komori.predictions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public RegistrationResponse registerNewUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        UserEntity newUser = convertToUserEntity(request);
        userRepository.save(newUser);
        RegistrationResponse response = convertToRegistrationResponse(newUser);
        emailService.sendWelcomeEmail(response.getEmail(), response.getName());
        return response;
    }

    @Override
    public void sendVerifyOtp(String email) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000,1000000));
        long otpExpiry = System.currentTimeMillis() + (15 * 60 * 1000); // 15 minute expiry

        currentUser.setVerifyOTP(otp);
        currentUser.setVerifyOTPExpireAt(otpExpiry);
        userRepository.save(currentUser);
        emailService.sendVerifyOtpEmail(email, currentUser.getName(), otp);
    }

    @Override
    public void verifyOTP(String email, String otp) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
        if (System.currentTimeMillis() > currentUser.getVerifyOTPExpireAt()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired");
        }
        if (otp.equalsIgnoreCase(currentUser.getVerifyOTP())) {
            currentUser.setAccountVerified(true);
            currentUser.setVerifyOTP(null);
            currentUser.setVerifyOTPExpireAt(null);
            userRepository.save(currentUser);
            emailService.sendAccountVerifiedEmail(email, currentUser.getName());
        }
        else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "OTP is incorrect");
        }
    }

    @Override
    public void checkVerifiedStatus(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        if (!user.getAccountVerified()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not verified");
        }
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
                .name(entity.getName())
                .email(entity.getEmail())
                .build();
    }
}
