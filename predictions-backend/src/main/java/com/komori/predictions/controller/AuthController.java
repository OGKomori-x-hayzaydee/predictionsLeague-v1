package com.komori.predictions.controller;

import com.komori.predictions.dto.request.*;
import com.komori.predictions.security.JwtUtil;
import com.komori.predictions.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        authService.checkVerifiedStatus(loginRequest.getEmail());
        HttpHeaders cookieHeaders = createCookieHeaders(loginRequest.getEmail());

        return ResponseEntity.ok()
                .headers(cookieHeaders)
                .body("Login successful");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        authService.registerNewUser(request);
        return ResponseEntity.ok("First step successful");
    }

    @PostMapping("/send-verify-otp")
    public ResponseEntity<String> sendVerifyOtp(@RequestBody ResendOtpRequest request) {
        authService.sendVerifyOtp(request.getEmail());
        return ResponseEntity.ok("VerifyOTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        authService.verifyOTP(request.getEmail(), request.getOtpFromUser());
        return ResponseEntity.ok("Account verified successfully");
    }

    @PostMapping("/finish-registration")
    public ResponseEntity<String> finishRegistration(@RequestBody FinishRegistrationRequest request,
                                                     @CookieValue(name = "email") String email) {
        authService.finishRegistration(email, request);
        HttpHeaders cookieHeaders = createCookieHeaders(email);

        return ResponseEntity.ok()
                .headers(cookieHeaders)
                .body("Registration successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie refreshCookie = ResponseCookie.from("refresh")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .domain(".predictionsleague.xyz")
                .build();

        ResponseCookie accessCookie = ResponseCookie.from("jwt")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .domain(".predictionsleague.xyz")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body("Logout successful");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refresh", required = false) String refreshToken) {

        if (refreshToken == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("No refresh token found");
        }
        if (jwtUtil.isTokenExpired(refreshToken)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Refresh token expired");
        }

        String email = jwtUtil.extractEmailFromToken(refreshToken);
        HttpHeaders headers = createCookieHeaders(email);
        return ResponseEntity.ok()
                .headers(headers)
                .body("Refresh successful");
    }

    private HttpHeaders createCookieHeaders(String email) {
        ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(email);
        ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(email);
        HttpHeaders cookieHeaders = new HttpHeaders();
        cookieHeaders.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        cookieHeaders.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return cookieHeaders;
    }
}
