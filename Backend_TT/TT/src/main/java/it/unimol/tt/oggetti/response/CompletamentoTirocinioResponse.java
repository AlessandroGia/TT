package it.unimol.tt.oggetti.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompletamentoTirocinioResponse {

    private int oreSvolte;
    private int minutiSvolti;
}
