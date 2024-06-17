package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.CorrelatoreTesi;
import it.unimol.tt.oggetti.entita.Tesi;
import it.unimol.tt.oggetti.entita.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CorrelatoreTesiRepository extends JpaRepository<CorrelatoreTesi, Long> {

    List<CorrelatoreTesi> findAllByCorrelatore(Utente utente);

    List<CorrelatoreTesi> findAllByTesi(Tesi tesi);

    Optional<CorrelatoreTesi> findByCorrelatoreAndTesi(Utente utente, Tesi tesi);
}
