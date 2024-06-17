package it.unimol.tt.oggetti.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NuovoAllegatoTirocinioRequest {

    @NotNull
    private Long idTirocinio;

    private String nome;

    @NotNull
    private Long idTipologia;

    private String nota;

    @NotNull
    private MultipartFile file;
}