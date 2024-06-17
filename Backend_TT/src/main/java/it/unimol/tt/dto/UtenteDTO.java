package it.unimol.tt.dto;

import lombok.Builder;

@Builder
public record UtenteDTO(
        Long id,
        String nome,
        String cognome,
        String ruolo
) {}
