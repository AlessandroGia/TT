package it.unimol.tt.oggetti.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NuovoTirocinioRequest {

    @NotNull
    private Long idLaboratorio;

    @NotNull
    private Long idTutor;

    @NotNull
    private String nomeCDS;

    @NotNull
    private int cfu;

    @NotNull
    private int durata;

    private List<Long> idCollaboratori;
}
