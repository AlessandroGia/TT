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
public class NuovaTesiRequest {

    private String titolo;

    @NotNull
    private String insegnamento;

    @NotNull
    private String nomeCDS;

    @NotNull
    private Long idRelatore;

    private List<Long> idCorrelatori;
}
