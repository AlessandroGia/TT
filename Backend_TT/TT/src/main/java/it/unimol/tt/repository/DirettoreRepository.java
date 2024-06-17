package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.Direttore;
import it.unimol.tt.oggetti.entita.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DirettoreRepository extends JpaRepository<Direttore, Long> {

    Optional<Direttore> findDirettoreByUtente(Utente utente);
}
