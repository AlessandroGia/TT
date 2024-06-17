package it.unimol.tt.dto;

import lombok.Builder;

@Builder
public record AttivitaDTO(
        Long id,
        String data,
        int ore,
        int minuti,
        String orarioEntrata,
        String orarioUscita,
        String attivitaSvolta
) {}
