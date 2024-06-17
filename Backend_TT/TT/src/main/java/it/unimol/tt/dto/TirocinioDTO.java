package it.unimol.tt.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record TirocinioDTO(
        Long id,
        String laboratorio,
        String nomeCDS,
        String tutor,
        String studente,
        int oreSvolte,
        int minutiSvolti,
        int durata,
        int cfu,
        String statoTirocinio,
        List<UtenteDTO> collaboratori
) {}
