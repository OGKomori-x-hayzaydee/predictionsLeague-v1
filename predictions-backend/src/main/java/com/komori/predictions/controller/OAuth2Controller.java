package com.komori.predictions.controller;

import com.komori.predictions.config.AppProperties;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.UserRepository;
import com.komori.predictions.security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final AppProperties appProperties;
    private final JwtUtil jwtUtil;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @GetMapping("/login")
    public void login(@RequestHeader(name = "X-Forwarded-Access-Token") String accessToken,
                      @RequestHeader(name = "X-Forwarded-Email") String email,
                      HttpServletResponse response) throws IOException {
        Optional<UserEntity> user = userRepository.findByEmail(email);
        if (user.isEmpty()) { // User Registration
            HttpHeaders header = new HttpHeaders();
            header.setBearerAuth(accessToken);
            HttpEntity<Void> httpEntity = new HttpEntity<>(header);
            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                    "https://openidconnect.googleapis.com/v1/userinfo",
                    HttpMethod.GET,
                    httpEntity,
                    Map.class
            );

            Map<String, Object> userInfo = responseEntity.getBody();
            if (userInfo == null) {
                throw new RuntimeException("Failed to get userInfo");
            }

            String firstName = (String) userInfo.get("given_name");
            String lastName = (String) userInfo.get("family_name");
            String picture = (String) userInfo.get("picture");

            UserEntity newUser = UserEntity.builder()
                    .userID(UUID.randomUUID().toString())
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .profilePictureUrl(picture)
                    .accountVerified(true)
                    .build();
            userRepository.save(newUser);
            response.sendRedirect(appProperties.getFrontendUrl() + "/auth/callback?email=" + email);
        } else if (user.get().getFavouriteTeam() == null || user.get().getUsername() == null) {
            // Incomplete registration
            response.sendRedirect(appProperties.getFrontendUrl() + "/auth/callback?email=" + email);
        } else { // User Login
            ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(email);
            ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(email);
            response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
            response.sendRedirect(appProperties.getFrontendUrl() + "/auth/callback?destination=dashboard");
        }
    }
}
