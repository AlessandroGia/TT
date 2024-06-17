package it.unimol.tt.oggetti.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModificaAllegatoRequest {

    @NotNull
    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private Long idTipologia;

    private String nota;
}
