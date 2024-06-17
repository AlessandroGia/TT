package it.unimol.tt.dto;

import lombok.Builder;
import java.util.List;

@Builder
public record CarrieraDTO(
        String nomeCDS,
        List<InsegnamentoDTO> insegnamenti
) {}
