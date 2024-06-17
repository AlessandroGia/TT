package it.unimol.tt.oggetti.script_input;

import it.unimol.tt.dto.AttivitaDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibrettoDiarioInput {

    String inputPath;
    String outputPath;
    String nomeDipartimento;
    String nomeCDS;
    String nomeCognomeStudente;
    String nomeLaboratorio;
    String cittaLaboratorio;
    String dataApprovProgForm;
    String tutor;
    String tutorUniversitario;
    String dataInizio;
    String dataFine;
    List<AttivitaDTO> elencoAttivita;
    String annotazioni;
}
