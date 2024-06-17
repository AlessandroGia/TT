package it.unimol.tt.controller;

import it.unimol.tt.oggetti.request.LoginRequest;
import it.unimol.tt.oggetti.response.LoginResponse;
import it.unimol.tt.service.LoginService;
import it.unimol.tt.strumenti.Logger;
import it.unimol.tt.strumenti.Network;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/login")
@RequiredArgsConstructor
public class LoginController {
    private final LoginService loginService;

    @PostMapping
    public ResponseEntity<LoginResponse> login(
            @RequestBody @Valid LoginRequest loginRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo il login");
        return ResponseEntity.ok(this.loginService.login(loginRequest));
    }

    @PostMapping("/admin")
    public ResponseEntity<String> loginAdmin(
            @RequestBody @Valid LoginRequest loginRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo il login admin");
        return ResponseEntity.ok(this.loginService.loginAdmin(loginRequest));
    }
}
