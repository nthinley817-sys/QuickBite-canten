package com.quickbite.auth;

import com.quickbite.exception.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

/**
 * Issues and checks the token a staff member gets at login. The token is
 * "staffId|canteenId|expiry" plus an HMAC-SHA256 signature, so the server
 * can trust it without storing sessions, and a client cannot edit it to
 * claim another canteen.
 *
 * Set STAFF_TOKEN_SECRET in production. Without it a random secret is
 * generated at startup, which works but signs everyone out on each restart.
 */
@Service
public class StaffTokenService {

    private static final Logger log = LoggerFactory.getLogger(StaffTokenService.class);
    private static final Duration TOKEN_LIFETIME = Duration.ofHours(12);
    private static final String BEARER = "Bearer ";
    private static final String INVALID = "Invalid staff session. Please log in again.";

    private final byte[] secret;

    public StaffTokenService(@Value("${STAFF_TOKEN_SECRET:}") String configuredSecret) {
        if (configuredSecret == null || configuredSecret.isBlank()) {
            log.warn("STAFF_TOKEN_SECRET is not set; staff will be signed out whenever the server restarts.");
            byte[] random = new byte[32];
            new SecureRandom().nextBytes(random);
            this.secret = random;
        } else {
            this.secret = configuredSecret.getBytes(StandardCharsets.UTF_8);
        }
    }

    public String issue(String staffId, String canteenId) {
        long expiresAt = Instant.now().plus(TOKEN_LIFETIME).getEpochSecond();
        String payload = staffId + "|" + canteenId + "|" + expiresAt;
        return encode(payload.getBytes(StandardCharsets.UTF_8)) + "." + encode(sign(payload));
    }

    /** Returns the staff member behind an Authorization header, or throws 401. */
    public StaffPrincipal requireStaff(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER)) {
            throw new UnauthorizedException("Staff login required.");
        }
        String[] parts = authorizationHeader.substring(BEARER.length()).trim().split("\\.");
        if (parts.length != 2) {
            throw new UnauthorizedException(INVALID);
        }
        String payload;
        try {
            payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            byte[] given = Base64.getUrlDecoder().decode(parts[1]);
            if (!MessageDigest.isEqual(given, sign(payload))) {
                throw new UnauthorizedException(INVALID);
            }
        } catch (IllegalArgumentException e) {
            throw new UnauthorizedException(INVALID);
        }
        String[] fields = payload.split("\\|");
        if (fields.length != 3) {
            throw new UnauthorizedException(INVALID);
        }
        if (Instant.now().getEpochSecond() > Long.parseLong(fields[2])) {
            throw new UnauthorizedException("Your staff session has expired. Please log in again.");
        }
        return new StaffPrincipal(fields[0], fields[1]);
    }

    private byte[] sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            return mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("HmacSHA256 unavailable", e);
        }
    }

    private static String encode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
