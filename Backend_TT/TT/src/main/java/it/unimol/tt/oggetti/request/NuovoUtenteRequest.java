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
public class NuovoUtenteRequest {

    @NotNull
    private String nome;

    @NotNull
    private String cognome;

    @NotNull
    private String nomeUtente;

    @NotNull
    private String password;
}
