package it.unimol.tt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.unimol.tt.dto.AllegatoDTO;
import it.unimol.tt.dto.AttivitaDTO;
import it.unimol.tt.dto.TipologiaDTO;
import it.unimol.tt.dto.TirocinioDTO;
import it.unimol.tt.dto.mapper.AllegatoTirocinioDTOMapper;
import it.unimol.tt.dto.mapper.AttivitaDTOMapper;
import it.unimol.tt.dto.mapper.TipologiaDTOMapper;
import it.unimol.tt.dto.mapper.TirocinioDTOMapper;
import it.unimol.tt.eccezioni.AttivitaGiaCompletateException;
import it.unimol.tt.eccezioni.FileGiaPresenteException;
import it.unimol.tt.eccezioni.FileNonTrovatoException;
import it.unimol.tt.eccezioni.UtenteNonTrovatoException;
import it.unimol.tt.oggetti.entita.*;
import it.unimol.tt.oggetti.enums.Ruolo;
import it.unimol.tt.oggetti.enums.StatoTirocinio;
import it.unimol.tt.oggetti.request.*;
import it.unimol.tt.oggetti.response.CompletamentoTirocinioResponse;
import it.unimol.tt.oggetti.response.ElencoAttivitaResponse;
import it.unimol.tt.oggetti.response.TirocinioResponse;
import it.unimol.tt.oggetti.script_input.LibrettoDiarioInput;
import it.unimol.tt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TirocinioService {
    private final TirocinioRepository tirocinioRepository;
    private final UtenteRepository utenteRepository;
    private final CollaboratoreTirocinioRepository collaboratoreTirocinioRepository;
    private final TirocinioDTOMapper tirocinioDTOMapper;
    private final LaboratorioRepository laboratorioRepository;
    private final AttivitaRepository attivitaRepository;
    private final AttivitaDTOMapper attivitaDTOMapper;
    private final AllegatoTirocinioRepository allegatoTirocinioRepository;
    private final AllegatoTirocinioDTOMapper allegatoTirocinioDTOMapper;
    private final TipologiaAllegatoRepository tipologiaAllegatoRepository;
    private final TipologiaDTOMapper tipologiaDTOMapper;

    public List<TirocinioResponse> getTirociniByUtente() {
        Utente utente = (this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName()))
                .orElseThrow(() -> new UtenteNonTrovatoException("Errore!"));

        List<TirocinioDTO> tirociniEstratti;
        List<TirocinioResponse> tirociniResponseEstratti = new ArrayList<>();

        if (utente.getRuolo().equals(Ruolo.STUDENTE)) {
            tirociniEstratti = this.tirocinioRepository.findAllByStudente(utente).stream().map(this.tirocinioDTOMapper).toList();

            for (TirocinioDTO tDTO : tirociniEstratti)
                tirociniResponseEstratti.add(TirocinioResponse.builder()
                        .tirocinio(tDTO)
                        .ruoloUtente("STUDENTE")
                        .build());

            tirociniEstratti = new ArrayList<>();

            for (CollaboratoreTirocinio ct : this.collaboratoreTirocinioRepository.findAllByCollaboratore(utente))
                tirociniEstratti.add(this.tirocinioDTOMapper.apply(ct.getTirocinio()));

            for (TirocinioDTO tDTO : tirociniEstratti)
                tirociniResponseEstratti.add(TirocinioResponse.builder()
                        .tirocinio(tDTO)
                        .ruoloUtente("COLLABORATORE")
                        .build());
        } else if (utente.getRuolo().equals(Ruolo.DOCENTE)) {
            tirociniEstratti = this.tirocinioRepository.findAllByTutor(utente).stream().map(this.tirocinioDTOMapper).toList();

            for (TirocinioDTO tDTO : tirociniEstratti)
                tirociniResponseEstratti.add(TirocinioResponse.builder()
                        .tirocinio(tDTO)
                        .ruoloUtente("TUTOR")
                        .build());

            tirociniEstratti = new ArrayList<>();

            for (CollaboratoreTirocinio ct : this.collaboratoreTirocinioRepository.findAllByCollaboratore(utente))
                tirociniEstratti.add(this.tirocinioDTOMapper.apply(ct.getTirocinio()));

            for (TirocinioDTO tDTO : tirociniEstratti)
                tirociniResponseEstratti.add(TirocinioResponse.builder()
                        .tirocinio(tDTO)
                        .ruoloUtente("COLLABORATORE")
                        .build());
        } else {
            tirociniEstratti = new ArrayList<>();

            for (CollaboratoreTirocinio ct : this.collaboratoreTirocinioRepository.findAllByCollaboratore(utente))
                tirociniEstratti.add(this.tirocinioDTOMapper.apply(ct.getTirocinio()));

            for (TirocinioDTO tDTO : tirociniEstratti)
                tirociniResponseEstratti.add(TirocinioResponse.builder()
                        .tirocinio(tDTO)
                        .ruoloUtente("COLLABORATORE")
                        .build());
        }

        return tirociniResponseEstratti;
    }

    public TirocinioResponse getTirocinio(Long idTirocinio) {
        String ruoloUtente;

        Tirocinio tirocinio = tirocinioRepository.findTirocinioById(idTirocinio);

        Utente utente = this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName()).get();

        if (tirocinio.getStudente().equals(utente))
            ruoloUtente = "STUDENTE";
        else if (tirocinio.getTutor().equals(utente))
            ruoloUtente = "TUTOR";
        else {
            Optional<CollaboratoreTirocinio> collaboratoreTirocinio = this.collaboratoreTirocinioRepository.findByCollaboratoreAndTirocinio(utente, tirocinio);

            if (collaboratoreTirocinio.isPresent())
                ruoloUtente = "COLLABORATORE";
            else
                ruoloUtente = "";
        }

        return TirocinioResponse.builder()
                .tirocinio(this.tirocinioDTOMapper.apply(tirocinio))
                .ruoloUtente(ruoloUtente)
                .build();
    }

    public void modificaStatoTirocinio(StatoTirocinioRequest statoTirocinioRequest) {
        Tirocinio tirocinio = this.tirocinioRepository.findTirocinioById(statoTirocinioRequest.getId());

        tirocinio.setStatoTirocinio(StatoTirocinio.valueOf(statoTirocinioRequest.getStatoTirocinio()));

        this.tirocinioRepository.save(tirocinio);
    }

    public void eliminaTirocinio(Long idTirocinio) {
        this.collaboratoreTirocinioRepository.deleteAll(this.collaboratoreTirocinioRepository.findAllByTirocinio(this.tirocinioRepository.findTirocinioById(idTirocinio)));

        this.tirocinioRepository.deleteById(idTirocinio);
    }

    public void modificaCollaboratoriTirocinio(CollaboratoriTirocinioRequest collaboratoriTirocinioRequest) {
        Tirocinio tirocinio = this.tirocinioRepository.findTirocinioById(collaboratoriTirocinioRequest.getId());

        List<CollaboratoreTirocinio> collaboratoriTirocinio = this.collaboratoreTirocinioRepository.findAllByTirocinio(tirocinio);

        this.collaboratoreTirocinioRepository.deleteAll(collaboratoriTirocinio);

        List<Utente> nuoviCollaboratori = new ArrayList<>();

        for (Long idCollaboratore : collaboratoriTirocinioRequest.getIdCollaboratori())
            nuoviCollaboratori.add(this.utenteRepository.findById(idCollaboratore).get());

        List<CollaboratoreTirocinio> nuoviCollaboratoriTirocinio = new ArrayList<>();

        for (Utente collaboratore : nuoviCollaboratori) {
            CollaboratoreTirocinio nuovo = CollaboratoreTirocinio.builder()
                    .tirocinio(tirocinio)
                    .collaboratore(collaboratore)
                    .build();

            nuoviCollaboratoriTirocinio.add(nuovo);
        }

        this.collaboratoreTirocinioRepository.saveAll(nuoviCollaboratoriTirocinio);
    }

    public void creaNuovoTirocinio(NuovoTirocinioRequest nuovoTirocinioRequest) {
        Utente studente = (this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UtenteNonTrovatoException("Errore!")));

        Utente tutor = this.utenteRepository.findById(nuovoTirocinioRequest.getIdTutor()).get();

        Laboratorio laboratorio = this.laboratorioRepository.findById(nuovoTirocinioRequest.getIdLaboratorio()).get();

        Tirocinio tirocinio = Tirocinio.builder()
                .statoTirocinio(StatoTirocinio.DA_APPROVARE)
                .durata(nuovoTirocinioRequest.getDurata())
                .oreSvolte(0)
                .minutiSvolti(0)
                .cfu(nuovoTirocinioRequest.getCfu())
                .corsoDiStudi(nuovoTirocinioRequest.getNomeCDS())
                .studente(studente)
                .tutor(tutor)
                .laboratorio(laboratorio)
                .build();

        this.tirocinioRepository.save(tirocinio);

        List<Utente> collaboratori = new ArrayList<>();

        for (Long idCollaboratore : nuovoTirocinioRequest.getIdCollaboratori())
            collaboratori.add(this.utenteRepository.findById(idCollaboratore).get());

        List<CollaboratoreTirocinio> collaboratoriTirocinio = new ArrayList<>();

        for (Utente collaboratore : collaboratori) {
            CollaboratoreTirocinio nuovo = CollaboratoreTirocinio.builder()
                    .tirocinio(tirocinio)
                    .collaboratore(collaboratore)
                    .build();

            collaboratoriTirocinio.add(nuovo);
        }

        this.collaboratoreTirocinioRepository.saveAll(collaboratoriTirocinio);
    }

    public ElencoAttivitaResponse getElencoAttivita(Long idTirocinio) {
        Tirocinio tirocinio = this.tirocinioRepository.findTirocinioById(idTirocinio);

        List<AttivitaDTO> elencoAttivita = this.attivitaRepository.findAllByTirocinio(tirocinio).stream().map(this.attivitaDTOMapper).toList();

        return ElencoAttivitaResponse.builder()
                .oreSvolte(tirocinio.getOreSvolte())
                .minutiSvolti(tirocinio.getMinutiSvolti())
                .durata(tirocinio.getDurata())
                .elencoAttivita(elencoAttivita)
                .build();
    }

    public AttivitaDTO getAttivita(Long idAttivita) {
        return this.attivitaDTOMapper.apply(this.attivitaRepository.findById(idAttivita).get());
    }

    public void modificaAttivita(ModificaAttivitaRequest modificaAttivitaRequest) {
        Attivita attivita = this.attivitaRepository.findById(modificaAttivitaRequest.getId()).get();

        attivita.setAttivitaSvolta(modificaAttivitaRequest.getAttivitaSvolta());

        this.attivitaRepository.save(attivita);
    }

    public void eliminaAttivita(Long idAttivita) {
        Attivita attivita = this.attivitaRepository.findById(idAttivita).get();

        Tirocinio tirocinio = this.tirocinioRepository.findTirocinioById(attivita.getTirocinio().getId());

        tirocinio.setOreSvolte(tirocinio.getOreSvolte() - attivita.getOre());
        tirocinio.setMinutiSvolti(tirocinio.getMinutiSvolti() - attivita.getMinuti());

        this.tirocinioRepository.save(tirocinio);

        this.attivitaRepository.deleteById(idAttivita);
    }

    public void creaNuovaAttivita(NuovaAttivitaRequest nuovaAttivitaRequest) {
        Attivita attivita = Attivita.builder()
                .data(nuovaAttivitaRequest.getData())
                .orarioEntrata(nuovaAttivitaRequest.getOrarioEntrata())
                .orarioUscita(nuovaAttivitaRequest.getOrarioUscita())
                .attivitaSvolta(nuovaAttivitaRequest.getAttivitaSvolta())
                .ore(nuovaAttivitaRequest.getOre())
                .minuti(nuovaAttivitaRequest.getMinuti())
                .tirocinio(this.tirocinioRepository.findTirocinioById(nuovaAttivitaRequest.getIdTirocinio()))
                .build();

        Tirocinio tirocinio = this.tirocinioRepository.findTirocinioById(nuovaAttivitaRequest.getIdTirocinio());

        if (tirocinio.getOreSvolte() < tirocinio.getDurata()) {
            tirocinio.setOreSvolte(tirocinio.getOreSvolte() + nuovaAttivitaRequest.getOre());

            if (tirocinio.getMinutiSvolti() + nuovaAttivitaRequest.getMinuti() >= 60) {
                tirocinio.setOreSvolte(tirocinio.getOreSvolte() + 1);
                tirocinio.setMinutiSvolti(tirocinio.getMinutiSvolti() + nuovaAttivitaRequest.getMinuti() - 60);
            } else
                tirocinio.setMinutiSvolti(tirocinio.getMinutiSvolti() + nuovaAttivitaRequest.getMinuti());
        } else
            throw new AttivitaGiaCompletateException("Impossibile aggiungere nuove attivita!");

        if (tirocinio.getOreSvolte() >= tirocinio.getDurata()) {
            tirocinio.setOreSvolte(tirocinio.getDurata());
            tirocinio.setMinutiSvolti(0);
        }

        this.tirocinioRepository.save(tirocinio);

        this.attivitaRepository.save(attivita);
    }

    public List<AllegatoDTO> getAllegatiTirocinio(Long idTirocinio) {
        return this.allegatoTirocinioRepository.findAllByTirocinio(this.tirocinioRepository.findTirocinioById(idTirocinio)).stream().map(this.allegatoTirocinioDTOMapper).toList();
    }

    public AllegatoDTO getAllegato(Long idAllegato) {
        return this.allegatoTirocinioDTOMapper.apply(this.allegatoTirocinioRepository.findById(idAllegato).get());
    }

    public void modificaAllegatoTirocinio(ModificaAllegatoRequest modificaAllegatoRequest) {
        AllegatoTirocinio allegatoTirocinio = this.allegatoTirocinioRepository.findById(modificaAllegatoRequest.getId()).get();

        allegatoTirocinio.setNome(modificaAllegatoRequest.getNome());
        allegatoTirocinio.setTipologiaAllegato(this.tipologiaAllegatoRepository.findById(modificaAllegatoRequest.getIdTipologia()).get());
        allegatoTirocinio.setNota(modificaAllegatoRequest.getNota());

        this.allegatoTirocinioRepository.save(allegatoTirocinio);
    }

    public List<TipologiaDTO> getTipologieTirocinio() {
        return this.tipologiaAllegatoRepository.findAllByIsTesiFalse().stream().map(this.tipologiaDTOMapper).toList();
    }

    public void creaNuovoAllegatoTirocinio(NuovoAllegatoTirocinioRequest nuovoAllegatoTirocinioRequest) {
        AllegatoTirocinio allegatoTirocinio = AllegatoTirocinio.builder()
                .nome(nuovoAllegatoTirocinioRequest.getNome())
                .nota(nuovoAllegatoTirocinioRequest.getNota())
                .percorso("")
                .tipologiaAllegato(this.tipologiaAllegatoRepository.findById(nuovoAllegatoTirocinioRequest.getIdTipologia()).get())
                .tirocinio(this.tirocinioRepository.findTirocinioById(nuovoAllegatoTirocinioRequest.getIdTirocinio()))
                .build();

        allegatoTirocinio = this.allegatoTirocinioRepository.save(allegatoTirocinio);

        Path percorso = Paths.get("allegati/tirocini/" + nuovoAllegatoTirocinioRequest.getIdTirocinio() + "/" + allegatoTirocinio.getId() + "/" + nuovoAllegatoTirocinioRequest.getFile().getOriginalFilename());

        File cartella = new File("allegati/tirocini/" + nuovoAllegatoTirocinioRequest.getIdTirocinio() + "/" + allegatoTirocinio.getId());
        if (!cartella.exists()) {
            cartella.mkdirs();
        }

        try {
            if (!(Files.exists(percorso)))
                Files.write(percorso, nuovoAllegatoTirocinioRequest.getFile().getBytes());
            else
                throw new FileGiaPresenteException("Hai già allegato un file con questo nome!");
        } catch (IOException ignored) {}

        allegatoTirocinio.setPercorso(percorso.toString());

        this.allegatoTirocinioRepository.save(allegatoTirocinio);
    }

    public void eliminaAllegatotirocinio(Long idAllegato) {
        AllegatoTirocinio allegatoTirocinio = this.allegatoTirocinioRepository.findById(idAllegato).get();

        Path percorso = Paths.get(allegatoTirocinio.getPercorso());

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

        this.allegatoTirocinioRepository.delete(allegatoTirocinio);
    }

    public CompletamentoTirocinioResponse getCompletamentoTirocinio(Long idTirocinio) {
        Tirocinio tirocinio = this.tirocinioRepository.findTirocinioById(idTirocinio);

        return CompletamentoTirocinioResponse.builder()
                .oreSvolte(tirocinio.getOreSvolte())
                .minutiSvolti(tirocinio.getMinutiSvolti())
                .build();
    }

    public Resource scaricaAllegatoTirocinio(Long idAllegato) throws MalformedURLException {
        AllegatoTirocinio allegatoTirocinio = this.allegatoTirocinioRepository.findById(idAllegato).get();

        Path percorso = Paths.get(allegatoTirocinio.getPercorso());

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

    public Resource generaLibrettoDiario(LibrettoDiarioRequest librettoDiarioRequest) throws IOException, InterruptedException {
        String outputPath = "allegati/tirocini/" + librettoDiarioRequest.getIdTirocinio() + "/libretto_diario/" + librettoDiarioRequest.getIdTirocinio() + ".pdf";

        Tirocinio tirocinio = this.tirocinioRepository.findTirocinioById(librettoDiarioRequest.getIdTirocinio());

        LibrettoDiarioInput librettoDiarioInput = LibrettoDiarioInput.builder()
                .outputPath(outputPath)
                .nomeDipartimento("Bioscienze e Territorio")
                .nomeCDS(tirocinio.getCorsoDiStudi())
                .nomeCognomeStudente(tirocinio.getStudente().getNome() + " " + tirocinio.getStudente().getCognome())
                .nomeLaboratorio(tirocinio.getLaboratorio().getNome())
                .luogoLaboratorio(tirocinio.getLaboratorio().getIndirizzo() + " - " + tirocinio.getLaboratorio().getCap() + " " + tirocinio.getLaboratorio().getCitta())
                .dataApprovProgForm(librettoDiarioRequest.getDataProgForm())
                .tutor("Prof. " + tirocinio.getTutor().getNome() + " " + tirocinio.getTutor().getCognome())
                .tutorUniversitario("Prof. " + librettoDiarioRequest.getTutorUniv())
                .dataInizio(librettoDiarioRequest.getDataInizio())
                .dataFine(librettoDiarioRequest.getDataFine())
                .elencoAttivita(this.attivitaRepository.findAllByTirocinio(tirocinio).stream().map(this.attivitaDTOMapper).toList())
                .annotazioni(librettoDiarioRequest.getAnnotazioni())
                .build();

        ObjectMapper mapper = new ObjectMapper();
        String jsonString = mapper.writeValueAsString(librettoDiarioInput);

        ProcessBuilder processBuilder = new ProcessBuilder("python", "script_python/genera_libd/genera_libd.py");
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
            writer.write(jsonString);
            writer.flush();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        process.waitFor();

        Path percorso = Paths.get(outputPath);

        Resource resource = new UrlResource(percorso.toUri());

        if (resource.exists() && resource.isReadable())
            return resource;
        else
            throw new FileNonTrovatoException("Impossibile leggere il file!");
    }
}
