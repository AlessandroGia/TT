package it.unimol.tt.dto.mapper;

import it.unimol.tt.dto.AllegatoDTO;
import it.unimol.tt.oggetti.entita.AllegatoTesi;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class AllegatoTesiDTOMapper implements Function<AllegatoTesi, AllegatoDTO> {

    @Override
    public AllegatoDTO apply(AllegatoTesi allegatoTesi) {
        return new AllegatoDTO(
                allegatoTesi.getId(),
                allegatoTesi.getNome(),
                allegatoTesi.getNota(),
                allegatoTesi.getPercorso(),
                allegatoTesi.getTipologiaAllegato().getNome()
        );
    }
}
