package com.komori.predictions.controller;

import com.komori.predictions.dto.*;
import com.komori.predictions.service.AuthService;
import com.komori.predictions.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        authService.checkVerifiedStatus(loginRequest.getEmail());
        final String jwtToken = jwtUtil.generateToken(loginRequest.getEmail());
        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .path("/") // Cookie is sent on all requests to the domain
                .maxAge(Duration.ofDays(1))
                .sameSite("Strict") // Protects against CSRF
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(loginRequest.getEmail(), jwtToken));
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = authService.registerNewUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/send-verify-otp")
    public ResponseEntity<String> sendVerifyOtp(@RequestBody RegistrationResponse response) {
        authService.sendVerifyOtp(response.getEmail());
        return ResponseEntity.ok("VerifyOTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpResponse response) {
        authService.verifyOTP(response.getEmail(), response.getOtpFromUser());
        return ResponseEntity.ok("Account verified successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt")
                .httpOnly(true)
                .path("/")
                .maxAge(0) // To delete the cookie
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }
}
