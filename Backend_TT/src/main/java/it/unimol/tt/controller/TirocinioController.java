package it.unimol.tt.controller;

import it.unimol.tt.dto.AllegatoDTO;
import it.unimol.tt.dto.AttivitaDTO;
import it.unimol.tt.dto.TipologiaDTO;
import it.unimol.tt.oggetti.request.*;
import it.unimol.tt.oggetti.response.CompletamentoTirocinioResponse;
import it.unimol.tt.oggetti.response.ElencoAttivitaResponse;
import it.unimol.tt.oggetti.response.TirocinioResponse;
import it.unimol.tt.service.TirocinioService;
import it.unimol.tt.strumenti.Logger;
import it.unimol.tt.strumenti.Network;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/tirocinio")
@RequiredArgsConstructor
public class TirocinioController {
    private final TirocinioService tirocinioService;

    @GetMapping("/home")
    public ResponseEntity<List<TirocinioResponse>> getTirociniByUtente(HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo la home tirocinio");
        return ResponseEntity.ok(this.tirocinioService.getTirociniByUtente());
    }

    @GetMapping("/{idTirocinio}")
    public ResponseEntity<TirocinioResponse> getTirocinio(
            @PathVariable Long idTirocinio,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo un tirocinio");
        return ResponseEntity.ok(this.tirocinioService.getTirocinio(idTirocinio));
    }

    @PutMapping("/stato")
    public ResponseEntity<Void> modificaStatoTirocinio(
            @RequestBody @Valid StatoTirocinioRequest statoTirocinioRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando lo stato tirocinio");
        this.tirocinioService.modificaStatoTirocinio(statoTirocinioRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{idTirocinio}")
    public ResponseEntity<Void> eliminaTirocinio(
            @PathVariable Long idTirocinio,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta eliminando un tirocinio");
        this.tirocinioService.eliminaTirocinio(idTirocinio);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/collaboratori")
    public ResponseEntity<Void> modificaCollaboratoriTirocinio(
            @RequestBody @Valid CollaboratoriTirocinioRequest collaboratoriTirocinioRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando i collaboratori di un tirocinio");
        this.tirocinioService.modificaCollaboratoriTirocinio(collaboratoriTirocinioRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Void> creaNuovoTirocinio(
            @RequestBody @Valid NuovoTirocinioRequest nuovoTirocinioRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta creando un nuovo tirocinio");
        this.tirocinioService.creaNuovoTirocinio(nuovoTirocinioRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/attivita/elenco/{idTirocinio}")
    public ResponseEntity<ElencoAttivitaResponse> getElencoAttivita(
            @PathVariable Long idTirocinio,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo l'elenco attivita");
        return ResponseEntity.ok(this.tirocinioService.getElencoAttivita(idTirocinio));
    }

    @GetMapping("attivita/{idAttivita}")
    public ResponseEntity<AttivitaDTO> getAttivita(
            @PathVariable Long idAttivita,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo un'attivita");
        return ResponseEntity.ok(this.tirocinioService.getAttivita(idAttivita));
    }

    @PutMapping("/attivita")
    public ResponseEntity<Void> modificaAttivita(
            @RequestBody @Valid ModificaAttivitaRequest modificaAttivitaRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando un'attivita");
        this.tirocinioService.modificaAttivita(modificaAttivitaRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/attivita/{idAttivita}")
    public ResponseEntity<Void> eliminaAttivita(
            @PathVariable Long idAttivita,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta eliminando un'attivita");
        this.tirocinioService.eliminaAttivita(idAttivita);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/attivita")
    public ResponseEntity<Void> creaNuovaAttivita(
            @RequestBody @Valid NuovaAttivitaRequest nuovaAttivitaRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta creando una nuova attivita");
        this.tirocinioService.creaNuovaAttivita(nuovaAttivitaRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/allegati/elenco/{idTirocinio}")
    public ResponseEntity<List<AllegatoDTO>> getAllegatiTirocinio(
            @PathVariable Long idTirocinio,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo gli allegati di un tirocinio");
        return ResponseEntity.ok(this.tirocinioService.getAllegatiTirocinio(idTirocinio));
    }

    @GetMapping("/allegati/{idAllegato}")
    public ResponseEntity<AllegatoDTO> getAllegato(
            @PathVariable Long idAllegato,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo un allegato");
        return ResponseEntity.ok(this.tirocinioService.getAllegato(idAllegato));
    }

    @PutMapping("/allegati")
    public ResponseEntity<Void> modificaAllegatoTirocinio(
            @RequestBody @Valid ModificaAllegatoRequest modificaAllegatoRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando un allegato");
        this.tirocinioService.modificaAllegatoTirocinio(modificaAllegatoRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/allegati/tipologie")
    public ResponseEntity<List<TipologiaDTO>> getTipologieTirocinio(HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo le tipologie allegato tirocinio");
        return ResponseEntity.ok(this.tirocinioService.getTipologieTirocinio());
    }

    @PostMapping("/allegati")
    public ResponseEntity<Void> creaNuovoAllegatoTirocinio(
            @RequestParam("idTirocinio") Long idTirocinio,
            @RequestParam("nome") String nome,
            @RequestParam("idTipologia") Long idTipologia,
            @RequestParam("nota") String nota,
            @RequestPart("file") MultipartFile file,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta creando un nuovo allegato tirocinio");

        NuovoAllegatoTirocinioRequest nuovoAllegatoTirocinioRequest = NuovoAllegatoTirocinioRequest.builder()
                .idTirocinio(idTirocinio)
                .nome(nome)
                .idTipologia(idTipologia)
                .nota(nota)
                .file(file)
                .build();

        this.tirocinioService.creaNuovoAllegatoTirocinio(nuovoAllegatoTirocinioRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/allegati/{idAllegato}")
    public ResponseEntity<Void> eliminaAllegatoTirocinio(
            @PathVariable Long idAllegato,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta eliminando un allegato");
        this.tirocinioService.eliminaAllegatotirocinio(idAllegato);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/completamento/{idTirocinio}")
    public ResponseEntity<CompletamentoTirocinioResponse> getCompletamentoTirocinio(
            @PathVariable Long idTirocinio,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo il completamento tirocinio");
        return ResponseEntity.ok(this.tirocinioService.getCompletamentoTirocinio(idTirocinio));
    }

    @GetMapping("/allegati/scarica/{idAllegato}")
    public ResponseEntity<Resource> scaricaAllegatoTirocinio(
            @PathVariable Long idAllegato,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta scaricando un allegato");

        try {
            Resource resource = this.tirocinioService.scaricaAllegatoTirocinio(idAllegato);

            String contentType = this.tirocinioService.getContentType(resource);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/generalibd")
    public ResponseEntity<Resource> generaLibrettoDiario(
            @RequestBody @Valid LibrettoDiarioRequest librettoDiarioRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta generando il libretto diario");

        try {
            Resource resource = this.tirocinioService.generaLibrettoDiario(librettoDiarioRequest);

            String contentType = this.tirocinioService.getContentType(resource);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .body(resource);
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
