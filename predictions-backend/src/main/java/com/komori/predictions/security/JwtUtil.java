package com.komori.predictions.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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

    private String generateAccessToken(String uuid) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(uuid)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 5 min expiration
                .signWith(Keys.hmacShaKeyFor(STORED_SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    private String generateRefreshToken(String uuid) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(uuid)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 14)) // 14 day expiration
                .signWith(Keys.hmacShaKeyFor(STORED_SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    public ResponseCookie createAccessTokenCookie(String uuid) {
        return ResponseCookie.from("access", generateAccessToken(uuid))
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(Duration.ofMinutes(15))
                .sameSite("None")
                .domain(".predictionsleague.xyz")
                .build();
    }

    public ResponseCookie createRefreshTokenCookie(String uuid) {
        return ResponseCookie.from("refresh", generateRefreshToken(uuid))
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(Duration.ofDays(14))
                .sameSite("None")
                .domain(".predictionsleague.xyz")
                .build();
    }

    public HttpHeaders createCookieHeaders(String uuid) {
        ResponseCookie accessCookie = createAccessTokenCookie(uuid);
        ResponseCookie refreshCookie = createRefreshTokenCookie(uuid);
        HttpHeaders cookieHeaders = new HttpHeaders();
        cookieHeaders.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        cookieHeaders.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return cookieHeaders;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(STORED_SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUUIDFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    public Boolean isTokenExpired(String token) {
        Claims claims = extractAllClaims(token);
        Date expiration = claims.getExpiration();
        return expiration.before(new Date());
    }

    public Boolean validateAccessToken(String token, String uuid) {
        final String tokenUUID = extractUUIDFromToken(token);
        return uuid.equals(tokenUUID) && !isTokenExpired(token);
    }
}
