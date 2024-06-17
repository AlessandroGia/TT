package it.unimol.tt.oggetti.response;

import it.unimol.tt.dto.TesiDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TesiResponse {

    private TesiDTO tesi;
    private String ruoloUtente;
}
