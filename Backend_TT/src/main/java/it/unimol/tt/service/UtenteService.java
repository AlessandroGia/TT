package it.unimol.tt.service;

import it.unimol.tt.dto.UtenteDTO;
import it.unimol.tt.dto.mapper.UtenteDTOMapper;
import it.unimol.tt.eccezioni.NomeUtenteDuplicatoException;
import it.unimol.tt.eccezioni.PermessoNegatoException;
import it.unimol.tt.eccezioni.UtenteNonTrovatoException;
import it.unimol.tt.oggetti.entita.Utente;
import it.unimol.tt.oggetti.enums.Ruolo;
import it.unimol.tt.oggetti.request.NuovoUtenteRequest;
import it.unimol.tt.repository.DirettoreRepository;
import it.unimol.tt.repository.UtenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UtenteService {
    private final UtenteRepository utenteRepository;
    private final UtenteDTOMapper utenteDTOMapper;
    private final PasswordEncoder passwordEncoder;
    private final DirettoreRepository direttoreRepository;

    public UtenteDTO getUtente() {
        Utente utente = this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UtenteNonTrovatoException(""));

        return UtenteDTO.builder()
                .id(utente.getId())
                .nome(utente.getNome())
                .cognome(utente.getCognome())
                .ruolo(utente.getRuolo().toString())
                .build();
    }

    public List<UtenteDTO> getInterni() {
        return this.utenteRepository.findAllByRuolo(Ruolo.INTERNO).stream().map(this.utenteDTOMapper).toList();
    }

    public List<UtenteDTO> getRicerca(String stringaRicerca) {
        List<Utente> ricercaUtenti = this.utenteRepository.findAllByNomeContainingIgnoreCaseOrCognomeContainingIgnoreCase(stringaRicerca, stringaRicerca);

        ricercaUtenti.remove(this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName()).get());

        return ricercaUtenti.stream().map(this.utenteDTOMapper).toList();
    }

    public List<UtenteDTO> getDocenti() {
        return this.utenteRepository.findAllByRuolo(Ruolo.DOCENTE).stream().map(this.utenteDTOMapper).toList();
    }

    public void nuovoUtente(NuovoUtenteRequest nuovoUtenteRequest) {
        Utente direttore = this.utenteRepository.findUtenteByNomeUtente(SecurityContextHolder.getContext().getAuthentication().getName()).get();

        if (this.direttoreRepository.findDirettoreByUtente(direttore).isEmpty())
            throw new PermessoNegatoException("Permesso negato!");

        Optional<Utente> controlloNomeUtente = this.utenteRepository.findUtenteByNomeUtente(nuovoUtenteRequest.getNomeUtente());

        if (controlloNomeUtente.isPresent())
            throw new NomeUtenteDuplicatoException("Nome utente gia presente!");

        Utente interno = Utente.builder()
                .nome(nuovoUtenteRequest.getNome())
                .cognome(nuovoUtenteRequest.getCognome())
                .nomeUtente(nuovoUtenteRequest.getNomeUtente())
                .password(this.passwordEncoder.encode(nuovoUtenteRequest.getPassword()))
                .ruolo(Ruolo.INTERNO)
                .build();

        this.utenteRepository.save(interno);
    }
}
