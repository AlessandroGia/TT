package it.unimol.tt.repository;

import it.unimol.tt.oggetti.entita.AllegatoTesi;
import it.unimol.tt.oggetti.entita.Tesi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllegatoTesiRepository extends JpaRepository<AllegatoTesi, Long> {

    List<AllegatoTesi> findAllByTesi(Tesi tesi);
}
