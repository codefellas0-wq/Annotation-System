package com.annotation.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Generate JWT token.
     */
    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Returns signing key.
     */
    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }
    public String extractUsername(String token) {

    return extractClaim(
            token,
            Claims::getSubject
    );
}
public <T> T extractClaim(
        String token,
        Function<Claims, T> claimsResolver) {

    final Claims claims =
            extractAllClaims(token);

    return claimsResolver.apply(claims);
}

public Date extractExpiration(String token) {

    return extractClaim(
            token,
            Claims::getExpiration
    );
}
private boolean isTokenExpired(String token) {

    return extractExpiration(token)
            .before(new Date());
}
public boolean isTokenValid(
        String token,
        String email) {

    final String username =
            extractUsername(token);

    return username.equals(email)
            &&
            !isTokenExpired(token);
}
private Claims extractAllClaims(String token) {

    return Jwts
            .parser()

            .verifyWith(
                    (javax.crypto.SecretKey)
                            getSigningKey())

            .build()

            .parseSignedClaims(token)

            .getPayload();
}
}