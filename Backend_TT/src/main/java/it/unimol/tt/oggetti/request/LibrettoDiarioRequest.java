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
public class LibrettoDiarioRequest {

    @NotNull
    Long idTirocinio;

    @NotNull
    String dataProgForm;

    @NotNull
    String tutorUniv;

    @NotNull
    String dataInizio;

    @NotNull
    String dataFine;

    String annotazioni;
}
