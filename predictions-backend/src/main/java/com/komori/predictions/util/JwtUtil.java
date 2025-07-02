package com.komori.predictions.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secret.key}")
    private String STORED_SECRET_KEY;
    private final SecretKey secretKey = Keys.hmacShaKeyFor(STORED_SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hour expiration
                .signWith(secretKey)
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmailFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    public Date extractExpirationFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getExpiration();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpirationFromToken(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String email = extractEmailFromToken(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
