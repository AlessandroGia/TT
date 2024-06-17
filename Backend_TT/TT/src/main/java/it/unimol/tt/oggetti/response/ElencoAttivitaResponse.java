package it.unimol.tt.oggetti.response;

import it.unimol.tt.dto.AttivitaDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElencoAttivitaResponse {

    private int oreSvolte;
    private int minutiSvolti;
    private int durata;
    private List<AttivitaDTO> elencoAttivita;
}
