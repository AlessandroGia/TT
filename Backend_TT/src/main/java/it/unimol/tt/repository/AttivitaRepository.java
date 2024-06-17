package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.Attivita;
import it.unimol.tt.oggetti.entita.Tirocinio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttivitaRepository extends JpaRepository<Attivita, Long> {

    List<Attivita> findAllByTirocinio(Tirocinio tirocinio);
}
