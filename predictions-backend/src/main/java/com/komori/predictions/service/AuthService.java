package com.komori.predictions.service;

import com.komori.predictions.dto.RegistrationRequest;
import com.komori.predictions.dto.RegistrationResponse;

public interface AuthService {
    RegistrationResponse registerNewUser(RegistrationRequest request);

    void sendVerifyOtp(String email);

    void verifyOTP(String email, String otp);

    void checkVerifiedStatus(String email);
}
