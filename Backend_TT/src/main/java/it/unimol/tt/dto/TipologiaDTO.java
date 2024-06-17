package it.unimol.tt.dto;

import lombok.Builder;

@Builder
public record TipologiaDTO(
        Long idTipologia,
        String nomeTipologia
) {}
