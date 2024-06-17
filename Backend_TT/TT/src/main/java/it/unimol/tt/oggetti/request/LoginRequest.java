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
public class LoginRequest {

    @NotNull(message = "Inserire un nome utente!")
    private String nomeUtente;

    @NotNull(message = "Inserire una password!")
    private String password;
}
