package it.unimol.tt.dto.mapper;

import it.unimol.tt.dto.LaboratorioDTO;
import it.unimol.tt.oggetti.entita.Laboratorio;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class LaboratorioDTOMapper implements Function<Laboratorio, LaboratorioDTO> {

    @Override
    public LaboratorioDTO apply(Laboratorio laboratorio) {
        return new LaboratorioDTO(
                laboratorio.getId(),
                laboratorio.getNome()
        );
    }
}
