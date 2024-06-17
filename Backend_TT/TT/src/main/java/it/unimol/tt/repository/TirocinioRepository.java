package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.Tirocinio;
import it.unimol.tt.oggetti.entita.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TirocinioRepository extends JpaRepository<Tirocinio, Long> {

    List<Tirocinio> findAllByStudente(Utente utente);

    List<Tirocinio> findAllByTutor(Utente utente);

    Tirocinio findTirocinioById(Long id);
}
