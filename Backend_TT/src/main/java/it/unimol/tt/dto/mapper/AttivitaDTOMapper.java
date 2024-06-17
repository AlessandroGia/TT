package it.unimol.tt.dto.mapper;

import it.unimol.tt.dto.AttivitaDTO;
import it.unimol.tt.oggetti.entita.Attivita;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class AttivitaDTOMapper implements Function<Attivita, AttivitaDTO> {

    @Override
    public AttivitaDTO apply(Attivita attivita) {
        return new AttivitaDTO(
                attivita.getId(),
                attivita.getData(),
                attivita.getOre(),
                attivita.getMinuti(),
                attivita.getOrarioEntrata(),
                attivita.getOrarioUscita(),
                attivita.getAttivitaSvolta()
        );
    }
}
