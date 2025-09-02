package com.komori.predictions.controller;

import com.komori.predictions.config.AppProperties;
import com.komori.predictions.dto.request.RegistrationCallbackRequest;
import com.komori.predictions.entity.UserEntity;
import com.komori.predictions.repository.UserRepository;
import com.komori.predictions.security.JwtUtil;
import com.komori.predictions.service.OAuth2Service;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.security.core.annotation.CurrentSecurityContext;
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
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RestTemplateBuilder restTemplateBuilder;
    private final AppProperties appProperties;
    private final OAuth2Service oAuth2Service;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @GetMapping("/login")
    public void login(@RequestHeader(name = "X-Forwarded-Access-Token") String accessToken,
                      @RequestHeader(name = "X-Forwarded-Email") String email,
                      HttpServletResponse response) throws IOException {
        ResponseCookie access = jwtUtil.createAccessTokenCookie(email);
        ResponseCookie refresh = jwtUtil.createRefreshTokenCookie(email);
        response.addHeader(HttpHeaders.SET_COOKIE, access.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refresh.toString());

        Optional<UserEntity> user = userRepository.findByEmail(email);
        if (user.isEmpty()) { // User Registration
            HttpHeaders header = new HttpHeaders();
            header.setBearerAuth(accessToken);
            HttpEntity<Void> httpEntity = new HttpEntity<>(header);
            RestTemplate restTemplate = restTemplateBuilder.build();
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

            UserEntity newUser = UserEntity.builder()
                    .userID(UUID.randomUUID().toString())
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .accountVerified(true)
                    .build();
            userRepository.save(newUser);
            response.sendRedirect(appProperties.getFrontendUrl() + "/auth/oauth/callback");
        } else { // User Login
            response.sendRedirect(appProperties.getFrontendUrl() + "/dashboard");
        }
    }

    @PostMapping("/finish-registration")
    public ResponseEntity<String> finishRegistration(
            @CurrentSecurityContext(expression = "authentication?.name") String email,
            @RequestBody RegistrationCallbackRequest request) {
        oAuth2Service.finishRegistration(email, request);
        return ResponseEntity.ok("Registration successful");
    }
}
