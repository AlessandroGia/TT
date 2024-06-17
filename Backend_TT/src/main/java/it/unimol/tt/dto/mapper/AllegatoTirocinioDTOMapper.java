package it.unimol.tt.dto.mapper;

import it.unimol.tt.dto.AllegatoDTO;
import it.unimol.tt.oggetti.entita.AllegatoTirocinio;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class AllegatoTirocinioDTOMapper implements Function<AllegatoTirocinio, AllegatoDTO> {

    @Override
    public AllegatoDTO apply(AllegatoTirocinio allegatoTirocinio) {
        return new AllegatoDTO(
                allegatoTirocinio.getId(),
                allegatoTirocinio.getNome(),
                allegatoTirocinio.getNota(),
                allegatoTirocinio.getPercorso(),
                allegatoTirocinio.getTipologiaAllegato().getNome()
        );
    }
}
