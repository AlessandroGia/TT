package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.Utente;
import it.unimol.tt.oggetti.enums.Ruolo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UtenteRepository extends JpaRepository<Utente, Long> {

    Optional<Utente> findUtenteByNomeUtente(String nomeUtente);

    List<Utente> findAllByRuolo(Ruolo ruolo);

    List<Utente> findAllByNomeContainingIgnoreCaseOrCognomeContainingIgnoreCase(String nome, String cognome);
}
