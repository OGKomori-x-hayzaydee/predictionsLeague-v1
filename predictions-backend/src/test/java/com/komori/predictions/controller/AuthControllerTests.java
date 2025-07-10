package com.komori.predictions.controller;

import com.komori.predictions.dto.*;
import com.komori.predictions.service.AuthService;
import com.komori.predictions.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTests {
    @Mock
    private AuthService authService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtUtil jwtUtil;
    @InjectMocks
    private AuthController authController;

    @Test
    void loginTest1() {
        // Everything works
        LoginRequest request = LoginRequest.builder().email("test@example.com").password("password").build();
        Authentication fakeAuth = mock(Authentication.class);

        when(authenticationManager.authenticate(any())).thenReturn(fakeAuth);
        doNothing().when(authService).checkVerifiedStatus(request.getEmail());
        when(jwtUtil.generateToken(request.getEmail())).thenReturn("jwtToken");

        ResponseEntity<LoginResponse> responseEntity = assertDoesNotThrow(() -> authController.login(request));

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("jwtToken", Objects.requireNonNull(responseEntity.getBody()).getJwtToken());
        assertNotNull(responseEntity.getBody());
        assertInstanceOf(LoginResponse.class, responseEntity.getBody());
        assertTrue(responseEntity.getHeaders().containsKey(HttpHeaders.SET_COOKIE));

        verify(jwtUtil).generateToken(request.getEmail());
    }

    @Test
    void registerTest1() {
        // Works fine
        RegistrationRequest request  = RegistrationRequest.builder().email("test@example.com").firstName("Username").password("password").build();

        ResponseEntity<RegistrationResponse> responseEntity = assertDoesNotThrow(() -> authController.register(request));

        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
    }

    @Test
    void sendVerifyOtpTest() {
        RegistrationResponse response = RegistrationResponse.builder().name("Username").email("test@example.com").build();

        ResponseEntity<String> responseEntity = assertDoesNotThrow(() -> authController.sendVerifyOtp(response));

        assertEquals("VerifyOTP sent successfully", responseEntity.getBody());
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }
}
