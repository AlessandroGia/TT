package it.unimol.tt.dto.mapper;

import it.unimol.tt.dto.TipologiaDTO;
import it.unimol.tt.oggetti.entita.TipologiaAllegato;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class TipologiaDTOMapper implements Function<TipologiaAllegato, TipologiaDTO> {
    public TipologiaDTO apply(TipologiaAllegato t) {
        return new TipologiaDTO(
                t.getId(),
                t.getNome()
        );
    }
}
