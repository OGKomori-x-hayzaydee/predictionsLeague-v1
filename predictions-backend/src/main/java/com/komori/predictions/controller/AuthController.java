package com.komori.predictions.controller;

import com.komori.predictions.dto.request.LoginRequest;
import com.komori.predictions.dto.request.RegistrationRequest;
import com.komori.predictions.dto.response.OtpResponse;
import com.komori.predictions.dto.response.RegistrationResponse;
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

        ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(loginRequest.getEmail());
        ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(loginRequest.getEmail());

        HttpHeaders cookieHeaders = new HttpHeaders();
        cookieHeaders.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        cookieHeaders.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok()
                .headers(cookieHeaders)
                .body("Login successful");
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
    public ResponseEntity<?> logout() {
        ResponseCookie refreshCookie = ResponseCookie.from("refresh")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .build();

        ResponseCookie accessCookie = ResponseCookie.from("jwt")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
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
        ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(email);
        ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(email);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body("Refresh successful");
    }
}
