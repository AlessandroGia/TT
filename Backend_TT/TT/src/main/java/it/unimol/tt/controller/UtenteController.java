package it.unimol.tt.controller;

import it.unimol.tt.dto.UtenteDTO;
import it.unimol.tt.oggetti.request.NuovoUtenteRequest;
import it.unimol.tt.service.UtenteService;
import it.unimol.tt.strumenti.Logger;
import it.unimol.tt.strumenti.Network;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/utente")
@RequiredArgsConstructor
public class UtenteController {
    private final UtenteService utenteService;

    @GetMapping
    public ResponseEntity<UtenteDTO> getUtente(HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo i dati utente");
        return ResponseEntity.ok(this.utenteService.getUtente());
    }

    @GetMapping("/interni")
    public ResponseEntity<List<UtenteDTO>> getInterni(HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo gli interni");
        return ResponseEntity.ok(this.utenteService.getInterni());
    }

    @GetMapping("/ricerca/{stringaRicerca}")
    public ResponseEntity<List<UtenteDTO>> getRicerca(
            @PathVariable String stringaRicerca,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta effettuando una ricerca utenti");
        return ResponseEntity.ok(this.utenteService.getRicerca(stringaRicerca));
    }

    @GetMapping("/docenti")
    public ResponseEntity<List<UtenteDTO>> getDocenti(HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo i docenti");
        return ResponseEntity.ok(this.utenteService.getDocenti());
    }

    @PostMapping("/admin/nuovo")
    public ResponseEntity<Void> nuovoUtente(
            @RequestBody @Valid NuovoUtenteRequest nuovoUtenteRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta aggiungendo un nuovo utente");
        this.utenteService.nuovoUtente(nuovoUtenteRequest);
        return ResponseEntity.ok().build();
    }
}
