package it.unimol.tt.oggetti.entita;

import it.unimol.tt.oggetti.enums.StatoTesi;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tesi")
public class Tesi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titolo;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatoTesi statoTesi;

    @Column(nullable = false)
    private String insegnamento;

    @Column(nullable = false)
    private String corsoDiStudi;

    private String dataDiscussione;

    @ManyToOne
    @JoinColumn(name = "studente_id", nullable = false)
    private Utente studente;

    @ManyToOne
    @JoinColumn(name = "relatore_id", nullable = false)
    private Utente relatore;

    @OneToMany(mappedBy = "tesi")
    List<CorrelatoreTesi> correlatori;
}
