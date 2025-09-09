package com.komori.predictions.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final List<String> PUBLIC_URLS = List.of(
            "/oauth2/login", "/auth/login", "/auth/logout", "/auth/register", "/swagger-ui", "/v3/api-docs"
    );
    private final PathMatcher pathMatcher;

    // Checks for a JWT token and sets CurrentSecurityContext if valid
    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        for (String publicUrl : PUBLIC_URLS) {
            if (pathMatcher.match(publicUrl, path)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        String jwt = null;

        // Check authorization header for the JWT
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Get the text after Bearer
        }

        // If not found in header, check cookies
        if (jwt == null) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("access")) {
                        jwt = cookie.getValue();
                        break;
                    }
                }
            }
        }

        // Validate the JWT, extract email, and set Security Context if user isn't already authenticated
        if (jwt != null) {
            String email = jwtUtil.extractEmailFromToken(jwt);
            if (email != null) {
                if (jwtUtil.validateAccessToken(jwt, email)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            } else {
                SecurityContextHolder.clearContext();
            }
        } else { // If jwt is still null
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
