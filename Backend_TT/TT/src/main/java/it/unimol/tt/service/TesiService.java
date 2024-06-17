package it.unimol.tt.service;

import it.unimol.tt.dto.AllegatoDTO;
import it.unimol.tt.dto.TesiDTO;
import it.unimol.tt.dto.TipologiaDTO;
import it.unimol.tt.dto.mapper.AllegatoTesiDTOMapper;
import it.unimol.tt.dto.mapper.TesiDTOMapper;
import it.unimol.tt.dto.mapper.TipologiaDTOMapper;
import it.unimol.tt.eccezioni.FileGiaPresenteException;
import it.unimol.tt.eccezioni.FileNonTrovatoException;
import it.unimol.tt.eccezioni.UtenteNonTrovatoException;
import it.unimol.tt.oggetti.entita.AllegatoTesi;
import it.unimol.tt.oggetti.entita.CorrelatoreTesi;
import it.unimol.tt.oggetti.entita.Tesi;
import it.unimol.tt.oggetti.entita.Utente;
import it.unimol.tt.oggetti.enums.Ruolo;
import it.unimol.tt.oggetti.enums.StatoTesi;
import it.unimol.tt.oggetti.request.*;
import it.unimol.tt.oggetti.response.TesiResponse;
import it.unimol.tt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TesiService {
    private final TesiRepository tesiRepository;
    private final UtenteRepository utenteRepository;
    private final CorrelatoreTesiRepository correlatoreTesiRepository;
    private final TesiDTOMapper tesiDTOMapper;
    private final AllegatoTesiRepository allegatoTesiRepository;
    private final AllegatoTesiDTOMapper allegatoTesiDTOMapper;
    private final TipologiaAllegatoRepository tipologiaAllegatoRepository;
    private final TipologiaDTOMapper tipologiaDTOMapper;

    public List<TesiResponse> getTesiByUtente() {
        Utente utente = (this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UtenteNonTrovatoException("Errore!")));

        List<TesiDTO> tesiEstratte;
        List<TesiResponse> tesiResponseEstratte = new ArrayList<>();

        if (utente.getRuolo().equals(Ruolo.STUDENTE)) {
            tesiEstratte = this.tesiRepository.findAllByStudente(utente).stream().map(this.tesiDTOMapper).toList();

            for (TesiDTO tDTO : tesiEstratte)
                tesiResponseEstratte.add(TesiResponse.builder()
                        .tesi(tDTO)
                        .ruoloUtente("STUDENTE")
                        .build());

            tesiEstratte = new ArrayList<>();

            for (CorrelatoreTesi ct : this.correlatoreTesiRepository.findAllByCorrelatore(utente))
                tesiEstratte.add(this.tesiDTOMapper.apply(ct.getTesi()));

            for (TesiDTO tDTO : tesiEstratte)
                tesiResponseEstratte.add(TesiResponse.builder()
                        .tesi(tDTO)
                        .ruoloUtente("CORRELATORE")
                        .build());
        } else if (utente.getRuolo().equals(Ruolo.DOCENTE)) {
            tesiEstratte = this.tesiRepository.findAllByRelatore(utente).stream().map(this.tesiDTOMapper).toList();

            for (TesiDTO tDTO : tesiEstratte)
                tesiResponseEstratte.add(TesiResponse.builder()
                        .tesi(tDTO)
                        .ruoloUtente("RELATORE")
                        .build());

            tesiEstratte = new ArrayList<>();

            for (CorrelatoreTesi ct : this.correlatoreTesiRepository.findAllByCorrelatore(utente))
                tesiEstratte.add(this.tesiDTOMapper.apply(ct.getTesi()));

            for (TesiDTO tDTO : tesiEstratte)
                tesiResponseEstratte.add(TesiResponse.builder()
                        .tesi(tDTO)
                        .ruoloUtente("CORRELATORE")
                        .build());
        } else {
            tesiEstratte = new ArrayList<>();

            for (CorrelatoreTesi ct : this.correlatoreTesiRepository.findAllByCorrelatore(utente))
                tesiEstratte.add(this.tesiDTOMapper.apply(ct.getTesi()));

            for (TesiDTO tDTO : tesiEstratte)
                tesiResponseEstratte.add(TesiResponse.builder()
                        .tesi(tDTO)
                        .ruoloUtente("CORRELATORE")
                        .build());
        }

        return tesiResponseEstratte;
    }

    public TesiResponse getTesi(Long idTesi) {
        String ruoloUtente;

        Tesi tesi = this.tesiRepository.findTesiById(idTesi);

        Utente utente = this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName()).get();

        if (tesi.getStudente().equals(utente))
            ruoloUtente = "STUDENTE";
        else if (tesi.getRelatore().equals(utente))
            ruoloUtente = "RELATORE";
        else {
            Optional<CorrelatoreTesi> correlatoreTesi = this.correlatoreTesiRepository.findByCorrelatoreAndTesi(utente, tesi);

            if (correlatoreTesi.isPresent())
                ruoloUtente = "CORRELATORE";
            else
                ruoloUtente = "";
        }

        return TesiResponse.builder()
                .tesi(this.tesiDTOMapper.apply(tesi))
                .ruoloUtente(ruoloUtente)
                .build();
    }

    public void modificaStatoTesi(StatoTesiRequest statoTesiRequest) {
        Tesi tesi = this.tesiRepository.findTesiById(statoTesiRequest.getId());

        tesi.setStatoTesi(StatoTesi.valueOf(statoTesiRequest.getStatoTesi()));

        this.tesiRepository.save(tesi);
    }

    public void eliminaTesi(Long idTesi) {
        this.correlatoreTesiRepository.deleteAll(this.correlatoreTesiRepository.findAllByTesi(this.tesiRepository.findTesiById(idTesi)));

        this.tesiRepository.deleteById(idTesi);
    }

    public void modificaTitoloTesi(TitoloTesiRequest titoloTesiRequest) {
        Tesi tesi = this.tesiRepository.findTesiById(titoloTesiRequest.getId());

        tesi.setTitolo(titoloTesiRequest.getTitolo());

        this.tesiRepository.save(tesi);
    }

    public void modificaCorrelatoriTesi(CorrelatoriTesiRequest correlatoriTesiRequest) {
        Tesi tesi = this.tesiRepository.findTesiById(correlatoriTesiRequest.getId());

        List<CorrelatoreTesi> correlatoriTesi = this.correlatoreTesiRepository.findAllByTesi(tesi);

        this.correlatoreTesiRepository.deleteAll(correlatoriTesi);

        List<Utente> nuoviCorrelatori = new ArrayList<>();

        for (Long idCorrelatore : correlatoriTesiRequest.getIdCorrelatori())
            nuoviCorrelatori.add(this.utenteRepository.findById(idCorrelatore).get());

        List<CorrelatoreTesi> nuoviCorrelatoriTesi = new ArrayList<>();

        for (Utente correlatore : nuoviCorrelatori) {
            CorrelatoreTesi nuovo = CorrelatoreTesi.builder()
                    .tesi(tesi)
                    .correlatore(correlatore)
                    .build();

            nuoviCorrelatoriTesi.add(nuovo);
        }

        this.correlatoreTesiRepository.saveAll(nuoviCorrelatoriTesi);
    }

    public void modificaDataDiscussioneTesi(DataDiscussioneTesiRequest dataDiscussioneTesiRequest) {
        Tesi tesi = this.tesiRepository.findTesiById(dataDiscussioneTesiRequest.getId());

        tesi.setDataDiscussione(dataDiscussioneTesiRequest.getDataDiscussione());

        this.tesiRepository.save(tesi);
    }

    public void creaNuovaTesi(NuovaTesiRequest nuovaTesiRequest) {
        Utente studente = (this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UtenteNonTrovatoException("Errore!")));

        Utente relatore = this.utenteRepository.findById(nuovaTesiRequest.getIdRelatore()).get();

        Tesi tesi = Tesi.builder()
                .titolo(nuovaTesiRequest.getTitolo())
                .insegnamento(nuovaTesiRequest.getInsegnamento())
                .corsoDiStudi(nuovaTesiRequest.getNomeCDS())
                .relatore(relatore)
                .studente(studente)
                .statoTesi(StatoTesi.DA_APPROVARE)
                .build();

        this.tesiRepository.save(tesi);

        List<Utente> correlatori = new ArrayList<>();

        for (Long idCorrelatore : nuovaTesiRequest.getIdCorrelatori())
            correlatori.add(this.utenteRepository.findById(idCorrelatore).get());

        List<CorrelatoreTesi> correlatoriTesi = new ArrayList<>();

        for (Utente correlatore : correlatori) {
            CorrelatoreTesi nuovo = CorrelatoreTesi.builder()
                    .tesi(tesi)
                    .correlatore(correlatore)
                    .build();

            correlatoriTesi.add(nuovo);
        }

        this.correlatoreTesiRepository.saveAll(correlatoriTesi);
    }

    public List<AllegatoDTO> getAllegatiTesi(Long idTesi) {
        return this.allegatoTesiRepository.findAllByTesi(this.tesiRepository.findTesiById(idTesi)).stream().map(this.allegatoTesiDTOMapper).toList();
    }

    public AllegatoDTO getAllegato(Long idAllegato) {
        return this.allegatoTesiDTOMapper.apply(this.allegatoTesiRepository.findById(idAllegato).get());
    }

    public void modificaAllegatoTesi(ModificaAllegatoRequest modificaAllegatoRequest) {
        AllegatoTesi allegatoTesi = this.allegatoTesiRepository.findById(modificaAllegatoRequest.getId()).get();

        allegatoTesi.setNome(modificaAllegatoRequest.getNome());
        allegatoTesi.setTipologiaAllegato(this.tipologiaAllegatoRepository.findById(modificaAllegatoRequest.getIdTipologia()).get());
        allegatoTesi.setNota(modificaAllegatoRequest.getNota());

        this.allegatoTesiRepository.save(allegatoTesi);
    }

    public List<TipologiaDTO> getTipologieTesi() {
        return this.tipologiaAllegatoRepository.findAllByIsTesiTrue().stream().map(this.tipologiaDTOMapper).toList();
    }

    public void creaNuovoAllegatoTesi(NuovoAllegatoTesiRequest nuovoAllegatoTesiRequest) {
        AllegatoTesi allegatoTesi = AllegatoTesi.builder()
                .nome(nuovoAllegatoTesiRequest.getNome())
                .nota(nuovoAllegatoTesiRequest.getNota())
                .percorso("")
                .tipologiaAllegato(this.tipologiaAllegatoRepository.findById(nuovoAllegatoTesiRequest.getIdTipologia()).get())
                .tesi(this.tesiRepository.findTesiById(nuovoAllegatoTesiRequest.getIdTesi()))
                .build();

        allegatoTesi = this.allegatoTesiRepository.save(allegatoTesi);

        Path percorso = Paths.get("allegati/tesi/" + nuovoAllegatoTesiRequest.getIdTesi() + "/" + allegatoTesi.getId() + "/" + nuovoAllegatoTesiRequest.getFile().getOriginalFilename());

        File cartella = new File("allegati/tesi/" + nuovoAllegatoTesiRequest.getIdTesi() + "/" + allegatoTesi.getId());
        if (!cartella.exists()) {
            cartella.mkdirs();
        }

        try {
            if (!(Files.exists(percorso)))
                Files.write(percorso, nuovoAllegatoTesiRequest.getFile().getBytes());
            else
                throw new FileGiaPresenteException("Hai già allegato un file con questo nome!");
        } catch (IOException ignored) {}

        allegatoTesi.setPercorso(percorso.toString());

        this.allegatoTesiRepository.save(allegatoTesi);
    }

    public void eliminaAllegatoTesi(Long idAllegato) {
        AllegatoTesi allegatoTesi = this.allegatoTesiRepository.findById(idAllegato).get();

        Path percorso = Paths.get(allegatoTesi.getPercorso());

        if (Files.exists(percorso)) {
            try {
                Files.delete(percorso);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        percorso = percorso.getParent();

        if (Files.exists(percorso)) {
            try {
                Files.delete(percorso);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        this.allegatoTesiRepository.delete(allegatoTesi);
    }

    public Resource scaricaAllegatoTesi(Long idAllegato) throws MalformedURLException {
        AllegatoTesi allegatoTesi = this.allegatoTesiRepository.findById(idAllegato).get();

        Path percorso = Paths.get(allegatoTesi.getPercorso());

        Resource resource = new UrlResource(percorso.toUri());

        if (resource.exists() && resource.isReadable())
            return resource;
        else
            throw new FileNonTrovatoException("Impossibile leggere il file!");
    }

    public String getContentType(Resource resource) throws IOException {
        Path percorso = Paths.get(resource.getURI());
        String contentType = Files.probeContentType(percorso);

        if (contentType == null)
            contentType = "application/octet-stream";

        return contentType;
    }
}
