package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.CollaboratoreTirocinio;
import it.unimol.tt.oggetti.entita.Tirocinio;
import it.unimol.tt.oggetti.entita.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollaboratoreTirocinioRepository extends JpaRepository<CollaboratoreTirocinio, Long> {

    List<CollaboratoreTirocinio> findAllByCollaboratore(Utente utente);

    List<CollaboratoreTirocinio> findAllByTirocinio(Tirocinio tirocinio);

    Optional<CollaboratoreTirocinio> findByCollaboratoreAndTirocinio(Utente utente, Tirocinio tirocinio);
}
