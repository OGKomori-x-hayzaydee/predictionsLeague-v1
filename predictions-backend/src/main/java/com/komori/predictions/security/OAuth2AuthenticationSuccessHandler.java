package com.komori.predictions.security;

import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.UserRepository;
import com.komori.predictions.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");
        String email = oAuth2User.getAttribute("email");

        ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(email);
        ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(email);

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        // send appropriate redirect
        Optional<UserEntity> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            // if registering
            UserEntity newUser = UserEntity.builder()
                    .userID(UUID.randomUUID().toString())
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .build();
            userRepository.save(newUser);
            emailService.sendWelcomeEmail(email, firstName);
            response.sendRedirect("http://localhost:5173/auth/oauth/callback");
        } else {
            // if logging in
            response.sendRedirect("http://localhost:5173/home/dashboard");
        }
    }
}
