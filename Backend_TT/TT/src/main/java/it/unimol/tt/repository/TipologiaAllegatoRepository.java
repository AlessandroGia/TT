package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.TipologiaAllegato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipologiaAllegatoRepository extends JpaRepository<TipologiaAllegato, Long> {

    List<TipologiaAllegato> findAllByIsTesiTrue();

    List<TipologiaAllegato> findAllByIsTesiFalse();
}
