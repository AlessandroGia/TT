package it.unimol.tt.controller;

import it.unimol.tt.dto.LaboratorioDTO;
import it.unimol.tt.service.LaboratorioService;
import it.unimol.tt.strumenti.Logger;
import it.unimol.tt.strumenti.Network;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/laboratorio")
@RequiredArgsConstructor
public class LaboratorioController {
    private final LaboratorioService laboratorioService;

    @GetMapping
    public ResponseEntity<List<LaboratorioDTO>> getLaboratori(HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo i laboratori");
        return ResponseEntity.ok(this.laboratorioService.getLaboratori());
    }
}
