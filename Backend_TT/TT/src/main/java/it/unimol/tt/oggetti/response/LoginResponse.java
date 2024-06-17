package it.unimol.tt.oggetti.response;

import it.unimol.tt.dto.CarrieraDTO;
import it.unimol.tt.dto.UtenteDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String jwt;
    private UtenteDTO utente;
    private List<CarrieraDTO> carriere;
}
