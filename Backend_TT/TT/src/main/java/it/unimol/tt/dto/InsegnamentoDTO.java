package it.unimol.tt.dto;

import lombok.Builder;
import java.util.List;

@Builder
public record InsegnamentoDTO(
        String nome,
        List<UtenteDTO> docenti
) {}
