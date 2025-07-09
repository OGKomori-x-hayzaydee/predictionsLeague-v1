package com.komori.predictions.service;

import com.komori.predictions.entity.OtpEntity;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.exception.AccountNotVerifiedException;
import com.komori.predictions.exception.EmailAlreadyExistsException;
import com.komori.predictions.exception.OtpExpiredException;
import com.komori.predictions.exception.OtpIncorrectException;
import com.komori.predictions.io.RegistrationRequest;
import com.komori.predictions.io.RegistrationResponse;
import com.komori.predictions.repository.OtpRepository;
import com.komori.predictions.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTests {
    @Mock
    private UserRepository userRepository;
    @Mock
    private OtpRepository otpRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private EmailService emailService;
    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void registerNewUserTest1() {
        // Everything working
        RegistrationRequest request = RegistrationRequest.builder().email("test@example.com").name("Username").password("password").build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false); // Assume that the email is available

        RegistrationResponse response = assertDoesNotThrow(() -> authService.registerNewUser(request));

        assertEquals("test@example.com", response.getEmail());
        assertEquals("Username", response.getName());

        verify(passwordEncoder).encode("password");
        verify(userRepository).save(any(UserEntity.class));
        verify(emailService).sendWelcomeEmail(request.getEmail(), request.getName());
    }

    @Test
    void registerNewUserTest2() {
        // Assume email is taken already
        RegistrationRequest request = RegistrationRequest.builder().email("test@example.com").name("Username").password("password").build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true); // Assume that the email is NOT available

        assertThrows(EmailAlreadyExistsException.class, () -> authService.registerNewUser(request));
    }

    @Test
    void sendVerifyOtpTest1() {
        // Everything working
        String email = "test@example.com";

        UserEntity currentUser = UserEntity.builder()
                .id(1L)
                .name("Test")
                .email(email)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(currentUser));
        when(otpRepository.findByUserId(currentUser.getId())).thenReturn(Optional.empty());

        ArgumentCaptor<OtpEntity> otpEntityArgumentCaptor = ArgumentCaptor.forClass(OtpEntity.class);

        assertDoesNotThrow(() -> authService.sendVerifyOtp(email));
        verify(otpRepository).save(otpEntityArgumentCaptor.capture());

        OtpEntity savedOtp = otpEntityArgumentCaptor.getValue();
        assertNotNull(savedOtp);
        assertNotNull(savedOtp.getExpiration());
        assertNotNull(savedOtp.getValue());
        assertEquals(currentUser.getId(), savedOtp.getUserId());

        int otp = Integer.parseInt(savedOtp.getValue());
        assertTrue(otp < 1000000 && otp >= 100000);

        verify(emailService).sendVerifyOtpEmail(currentUser.getEmail(), currentUser.getName(), savedOtp.getValue());
    }

    @Test
    void sendVerifyOtpTest2() {
        // User not found
        String email = "test@example.com";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> authService.sendVerifyOtp(email));
    }

    @Test
    void verifyOtpTest1() {
        // Everything working
        String email = "test@example.com";
        String otp = "123456";

        UserEntity currentUser = UserEntity.builder()
                .id(1L)
                .name("Test")
                .email(email)
                .build();

        OtpEntity currentOtp = OtpEntity.builder()
                .userId(currentUser.getId())
                .value(otp)
                .expiration(System.currentTimeMillis() + 60000)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(currentUser));
        when(otpRepository.findByUserId(currentUser.getId())).thenReturn(Optional.of(currentOtp));

        assertDoesNotThrow(() -> authService.verifyOTP(email, otp));

        assertTrue(currentUser.getAccountVerified());

        verify(otpRepository).deleteByUserId(currentUser.getId());
        verify(userRepository).save(currentUser);
        verify(emailService).sendAccountVerifiedEmail(currentUser.getEmail(), currentUser.getName());
    }

    @Test
    void verifyOtpTest2() {
        // OTP expired
        String email = "test@example.com";
        String otp = "123456";

        UserEntity currentUser = UserEntity.builder()
                .name("Test")
                .email(email)
                .build();

        OtpEntity currentOtp = OtpEntity.builder()
                .userId(currentUser.getId())
                .value(otp)
                .expiration(System.currentTimeMillis())
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(currentUser));
        when(otpRepository.findByUserId(currentUser.getId())).thenReturn(Optional.of(currentOtp));

        assertThrows(OtpExpiredException.class, () -> authService.verifyOTP(email, otp));
    }

    @Test
    void verifyOtpTest3() {
        // OTP incorrect
        String email = "test@example.com";
        String otp = "123456";

        UserEntity currentUser = UserEntity.builder()
                .name("Test")
                .email(email)
                .build();

        OtpEntity currentOtp = OtpEntity.builder()
                .userId(currentUser.getId())
                .value("123455")
                .expiration(System.currentTimeMillis() + 60000)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(currentUser));
        when(otpRepository.findByUserId(currentUser.getId())).thenReturn(Optional.of(currentOtp));

        assertThrows(OtpIncorrectException.class, () -> authService.verifyOTP(email, otp));
    }

    @Test
    void checkVerifiedStatus1() {
        // Everything works
        String email = "test@example.com";

        UserEntity currentUser = UserEntity.builder()
                .email(email)
                .accountVerified(true)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(currentUser));

        assertDoesNotThrow(() -> authService.checkVerifiedStatus(email));
    }

    @Test
    void checkVerifiedStatus2() {
        // User found but not verified
        String email = "test@example.com";

        UserEntity currentUser = UserEntity.builder()
                .email(email)
                .accountVerified(false)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(currentUser));

        assertThrows(AccountNotVerifiedException.class, () -> authService.checkVerifiedStatus(email));
    }

}
