package it.unimol.tt.strumenti;

import jakarta.servlet.http.HttpServletRequest;
import org.jetbrains.annotations.NotNull;

import java.util.Objects;

public class Network {
    public static String getClientIp(@NotNull HttpServletRequest request) {
        return Objects.nonNull(request.getHeader("X-Forwarded-For")) ?
                request.getHeader("X-Forwarded-For") :
                request.getRemoteAddr();
    }
}
