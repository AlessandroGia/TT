package it.unimol.tt.dto;

import lombok.Builder;

@Builder
public record AllegatoDTO(
        Long id,
        String nome,
        String nota,
        String percorso,
        String nomeTipologia
) {}
