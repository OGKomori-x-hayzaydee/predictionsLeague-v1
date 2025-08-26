package com.komori.predictions.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    @Value("${jwt.secret.key}")
    private String STORED_SECRET_KEY;

    private String generateAccessToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 5)) // 5 min expiration
                .signWith(Keys.hmacShaKeyFor(STORED_SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    private String generateRefreshToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 14)) // 14 day expiration
                .signWith(Keys.hmacShaKeyFor(STORED_SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    public ResponseCookie createAccessTokenCookie(String email) {
        return ResponseCookie.from("access", generateAccessToken(email))
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(Duration.ofMinutes(5))
                .sameSite("None")
                .build();
    }

    public ResponseCookie createRefreshTokenCookie(String email) {
        return ResponseCookie.from("refresh", generateRefreshToken(email))
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(Duration.ofDays(14))
                .sameSite("None")
                .build();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(STORED_SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmailFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    public Boolean isTokenExpired(String token) {
        Claims claims = extractAllClaims(token);
        Date expiration = claims.getExpiration();
        return expiration.before(new Date());
    }

    public Boolean validateAccessToken(String token, UserDetails userDetails) {
        final String email = extractEmailFromToken(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
