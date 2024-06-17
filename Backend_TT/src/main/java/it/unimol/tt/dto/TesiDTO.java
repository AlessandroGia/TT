package it.unimol.tt.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record TesiDTO(
        Long id,
        String titolo,
        String insegnamento,
        String nomeCDS,
        String dataDiscussione,
        String relatore,
        String studente,
        String statoTesi,
        List<UtenteDTO> correlatori
) {}
