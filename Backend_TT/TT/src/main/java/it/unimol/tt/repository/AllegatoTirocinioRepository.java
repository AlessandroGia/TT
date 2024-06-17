package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.AllegatoTirocinio;
import it.unimol.tt.oggetti.entita.Tirocinio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllegatoTirocinioRepository extends JpaRepository<AllegatoTirocinio, Long> {

    List<AllegatoTirocinio> findAllByTirocinio(Tirocinio tirocinio);
}
