package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.DocenteEsse3;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocenteEsse3Repository extends JpaRepository<DocenteEsse3, Long> {

    Optional<DocenteEsse3> findDocenteEsse3ByCodEsse3(String codEsse3);
}
