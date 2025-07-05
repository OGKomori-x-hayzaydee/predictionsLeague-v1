package com.komori.predictions.controller;

import com.komori.predictions.io.LoginRequest;
import com.komori.predictions.io.LoginResponse;
import com.komori.predictions.io.RegistrationRequest;
import com.komori.predictions.io.RegistrationResponse;
import com.komori.predictions.service.CustomUserDetailsService;
import com.komori.predictions.service.EmailService;
import com.komori.predictions.service.RegistrationService;
import com.komori.predictions.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final RegistrationService registrationService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            final UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getEmail());
            final String jwtToken = jwtUtil.generateToken(userDetails);
            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                    .httpOnly(true)
                    .path("/") // Cookie is sent on all requests to the domain
                    .maxAge(Duration.ofDays(1))
                    .sameSite("Strict") // Protects against CSRF
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new LoginResponse(loginRequest.getEmail(), jwtToken));
        } catch (BadCredentialsException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Email or password is incorrect");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (DisabledException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Account disabled");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Login failed");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request) {
        try {
            RegistrationResponse response = registrationService.registerNewUser(request);
            emailService.sendWelcomeEmail(response.getEmail(), response.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResponseStatusException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(error);
        } catch (MailException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Error sending welcome mail");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
