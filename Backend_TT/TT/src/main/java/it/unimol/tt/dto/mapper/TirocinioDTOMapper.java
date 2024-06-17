package it.unimol.tt.dto.mapper;

import it.unimol.tt.dto.TirocinioDTO;
import it.unimol.tt.oggetti.entita.CollaboratoreTirocinio;
import it.unimol.tt.oggetti.entita.Tirocinio;
import it.unimol.tt.oggetti.enums.StatoTirocinio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class TirocinioDTOMapper implements Function<Tirocinio, TirocinioDTO> {
    private final UtenteDTOMapper utenteDTOMapper;

    @Override
    public TirocinioDTO apply(Tirocinio tirocinio) {
        return new TirocinioDTO(
                tirocinio.getId(),
                tirocinio.getLaboratorio().getNome(),
                tirocinio.getCorsoDiStudi(),
                "Prof. " + tirocinio.getTutor().getNome() + " " + tirocinio.getTutor().getCognome(),
                tirocinio.getStudente().getNome() + " " + tirocinio.getStudente().getCognome(),
                tirocinio.getOreSvolte(),
                tirocinio.getMinutiSvolti(),
                tirocinio.getDurata(),
                tirocinio.getCfu(),
                tirocinio.getStatoTirocinio().equals(StatoTirocinio.DA_APPROVARE) ? StatoTirocinio.DA_APPROVARE.toString() : (
                        tirocinio.getStatoTirocinio().equals(StatoTirocinio.IN_CORSO) ? StatoTirocinio.IN_CORSO.toString() : (
                                tirocinio.getStatoTirocinio().equals(StatoTirocinio.COMPLETATO) ? StatoTirocinio.COMPLETATO.toString() : StatoTirocinio.ARCHIVIATO.toString()
                        )
                ),
                tirocinio.getCollaboratori().stream().map(CollaboratoreTirocinio::getCollaboratore).map(this.utenteDTOMapper).toList()
        );
    }
}
