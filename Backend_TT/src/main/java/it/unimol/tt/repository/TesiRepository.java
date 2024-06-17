package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.Tesi;
import it.unimol.tt.oggetti.entita.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TesiRepository extends JpaRepository<Tesi, Long> {

    List<Tesi> findAllByStudente(Utente utente);

    List<Tesi> findAllByRelatore(Utente utente);

    Tesi findTesiById(Long id);
}
