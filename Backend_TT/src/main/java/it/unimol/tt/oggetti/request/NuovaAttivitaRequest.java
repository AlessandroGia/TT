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
public class NuovaAttivitaRequest {

    @NotNull
    private Long idTirocinio;

    @NotNull
    private String data;

    @NotNull
    private String orarioEntrata;

    @NotNull
    private String orarioUscita;

    @NotNull
    private int ore;

    @NotNull
    private int minuti;

    private String attivitaSvolta;
}
