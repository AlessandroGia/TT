package it.unimol.tt.oggetti.response;

import it.unimol.tt.dto.TirocinioDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TirocinioResponse {

    private TirocinioDTO tirocinio;
    private String ruoloUtente;
}
