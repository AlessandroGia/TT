package it.unimol.tt.dto.mapper;

import it.unimol.tt.dto.UtenteDTO;
import it.unimol.tt.oggetti.entita.Utente;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class UtenteDTOMapper implements Function<Utente, UtenteDTO> {

    @Override
    public UtenteDTO apply(Utente utente) {
        return new UtenteDTO(
                utente.getId(),
                utente.getNome(),
                utente.getCognome(),
                utente.getRuolo().toString()
        );
    }
}
