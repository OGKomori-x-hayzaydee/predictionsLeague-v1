package com.komori.predictions.service;

import com.komori.predictions.io.RegistrationRequest;
import com.komori.predictions.io.RegistrationResponse;

public interface AuthService {
    RegistrationResponse registerNewUser(RegistrationRequest request);

    void sendVerifyOtp(String email);

    void verifyOTP(String email, String otp);

    void checkVerifiedStatus(String email);
}
