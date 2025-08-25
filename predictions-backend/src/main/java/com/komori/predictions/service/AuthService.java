package com.komori.predictions.service;

import com.komori.predictions.entity.OtpEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.exception.*;
import com.komori.predictions.dto.request.RegistrationRequest;
import com.komori.predictions.dto.response.RegistrationResponse;
import com.komori.predictions.repository.OtpRepository;
import com.komori.predictions.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public RegistrationResponse registerNewUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }
        UserEntity newUser = convertToUserEntity(request);
        userRepository.save(newUser);
        RegistrationResponse response = convertToRegistrationResponse(newUser);
        emailService.sendWelcomeEmail(response.getEmail(), response.getName());
        return response;
    }

    public void sendVerifyOtp(String email) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000,1000000));
        long otpExpiry = System.currentTimeMillis() + (15 * 60 * 1000); // 15 minute expiry

        Optional<OtpEntity> otpEntityOptional = otpRepository.findByUserId(currentUser.getId());
        OtpEntity otpEntity;
        if (otpEntityOptional.isEmpty()) {
            otpEntity = OtpEntity.builder().userId(currentUser.getId()).value(otp).expiration(otpExpiry).build();
        }
        else {
            otpEntity = otpEntityOptional.get();
            // Check how recently OTP was generated
            otpEntity.setValue(otp);
            otpEntity.setExpiration(otpExpiry);
        }

        otpRepository.save(otpEntity);
        emailService.sendVerifyOtpEmail(email, currentUser.getFirstName(), otp);
    }

    @Transactional
    public void verifyOTP(String email, String otp) {
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        OtpEntity otpEntity = otpRepository.findByUserId(currentUser.getId())
                .orElseThrow(OtpNotFoundException::new);

        if (System.currentTimeMillis() > otpEntity.getExpiration()) {
            throw new OtpExpiredException();
        }
        if (otp.equals(otpEntity.getValue())) {
            currentUser.setAccountVerified(true);
            otpRepository.deleteByUserId(currentUser.getId());
            userRepository.save(currentUser);
            emailService.sendAccountVerifiedEmail(email, currentUser.getFirstName());
        }
        else {
            throw new OtpIncorrectException();
        }
    }

    public void checkVerifiedStatus(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        if (!user.getAccountVerified()) {
            throw new AccountNotVerifiedException();
        }
    }

    private UserEntity convertToUserEntity(RegistrationRequest request) {
        return UserEntity.builder()
                .userID(UUID.randomUUID().toString())
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountVerified(false)
                .favouriteTeam(request.getFavouriteTeam())
                .build();
    }

    private RegistrationResponse convertToRegistrationResponse(UserEntity entity) {
        return RegistrationResponse.builder()
                .name(entity.getFirstName())
                .email(entity.getEmail())
                .build();
    }
}
