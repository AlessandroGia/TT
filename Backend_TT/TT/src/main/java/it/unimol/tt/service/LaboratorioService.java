package it.unimol.tt.service;

import it.unimol.tt.dto.LaboratorioDTO;
import it.unimol.tt.dto.mapper.LaboratorioDTOMapper;
import it.unimol.tt.repository.LaboratorioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LaboratorioService {
    private final LaboratorioRepository laboratorioRepository;
    private final LaboratorioDTOMapper laboratorioDTOMapper;

    public List<LaboratorioDTO> getLaboratori() {
        return this.laboratorioRepository.findAll().stream().map(this.laboratorioDTOMapper).toList();
    }
}
