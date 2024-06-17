package it.unimol.tt.controller;

import it.unimol.tt.dto.AllegatoDTO;
import it.unimol.tt.dto.TipologiaDTO;
import it.unimol.tt.oggetti.request.*;
import it.unimol.tt.oggetti.response.TesiResponse;
import it.unimol.tt.service.TesiService;
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
@RequestMapping("/api/v1/tesi")
@RequiredArgsConstructor
public class TesiController {
    private final TesiService tesiService;

    @GetMapping("/home")
    public ResponseEntity<List<TesiResponse>> getTesiByUtente(HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo la home tesi");
        return ResponseEntity.ok(this.tesiService.getTesiByUtente());
    }

    @GetMapping("/{idTesi}")
    public ResponseEntity<TesiResponse> getTesi(
            @PathVariable Long idTesi,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo una tesi");
        return ResponseEntity.ok(this.tesiService.getTesi(idTesi));
    }

    @PutMapping("/stato")
    public ResponseEntity<Void> modificaStatoTesi(
            @RequestBody @Valid StatoTesiRequest statoTesiRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando lo stato tesi");
        this.tesiService.modificaStatoTesi(statoTesiRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{idTesi}")
    public ResponseEntity<Void> eliminaTesi(
            @PathVariable Long idTesi,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta eliminando una tesi");
        this.tesiService.eliminaTesi(idTesi);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/titolo")
    public ResponseEntity<Void> modificaTitoloTesi(
            @RequestBody @Valid TitoloTesiRequest titoloTesiRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando il titolo tesi");
        this.tesiService.modificaTitoloTesi(titoloTesiRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/correlatori")
    public ResponseEntity<Void> modificaCorrelatoriTesi(
            @RequestBody @Valid CorrelatoriTesiRequest correlatoriTesiRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando i correlatori di una tesi");
        this.tesiService.modificaCorrelatoriTesi(correlatoriTesiRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/data")
    public ResponseEntity<Void> modificaDataDiscussioneTesi(
            @RequestBody @Valid DataDiscussioneTesiRequest dataDiscussioneTesiRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando la data discussione tesi");
        this.tesiService.modificaDataDiscussioneTesi(dataDiscussioneTesiRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Void> creaNuovaTesi(
            @RequestBody @Valid NuovaTesiRequest nuovaTesiRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta creando una nuova tesi");
        this.tesiService.creaNuovaTesi(nuovaTesiRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/allegati/elenco/{idTesi}")
    public ResponseEntity<List<AllegatoDTO>> getAllegatiTesi(
            @PathVariable Long idTesi,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo gli allegati di una tesi");
        return ResponseEntity.ok(this.tesiService.getAllegatiTesi(idTesi));
    }

    @GetMapping("/allegati/{idAllegato}")
    public ResponseEntity<AllegatoDTO> getAllegato(
            @PathVariable Long idAllegato,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo un allegato");
        return ResponseEntity.ok(this.tesiService.getAllegato(idAllegato));
    }

    @PutMapping("/allegati")
    public ResponseEntity<Void> modificaAllegatoTesi(
            @RequestBody @Valid ModificaAllegatoRequest modificaAllegatoRequest,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta modificando un allegato");
        this.tesiService.modificaAllegatoTesi(modificaAllegatoRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/allegati/tipologie")
    public ResponseEntity<List<TipologiaDTO>> getTipologieTesi(HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta richiedendo le tipologie allegato tesi");
        return ResponseEntity.ok(this.tesiService.getTipologieTesi());
    }

    @PostMapping("/allegati")
    public ResponseEntity<Void> creaNuovoAllegatoTesi(
            @RequestParam("idTesi") Long idTesi,
            @RequestParam("nome") String nome,
            @RequestParam("idTipologia") Long idTipologia,
            @RequestParam("nota") String nota,
            @RequestPart("file") MultipartFile file,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta creando un nuovo allegato tesi");

        NuovoAllegatoTesiRequest nuovoAllegatoTesiRequest = NuovoAllegatoTesiRequest.builder()
                .idTesi(idTesi)
                .nome(nome)
                .idTipologia(idTipologia)
                .nota(nota)
                .file(file)
                .build();

        this.tesiService.creaNuovoAllegatoTesi(nuovoAllegatoTesiRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/allegati/{idAllegato}")
    public ResponseEntity<Void> eliminaAllegatoTesi(
            @PathVariable Long idAllegato,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta eliminando un allegato");
        this.tesiService.eliminaAllegatoTesi(idAllegato);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/allegati/scarica/{idAllegato}")
    public ResponseEntity<Resource> scaricaAllegatoTesi(
            @PathVariable Long idAllegato,
            HttpServletRequest servletRequest) {
        Logger.getLogger().info(Network.getClientIp(servletRequest) + " sta scaricando un allegato");

        try {
            Resource resource = this.tesiService.scaricaAllegatoTesi(idAllegato);

            String contentType = this.tesiService.getContentType(resource);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
