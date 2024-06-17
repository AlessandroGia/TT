package it.unimol.tt.oggetti.entita;

import it.unimol.tt.oggetti.enums.StatoTirocinio;
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
@Table(name = "tirocinio")
public class Tirocinio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatoTirocinio statoTirocinio;

    @Column(nullable = false)
    private int durata;

    @Column(nullable = false)
    private int oreSvolte;

    @Column(nullable = false)
    private int minutiSvolti;

    @Column(nullable = false)
    private int cfu;

    @Column(nullable = false)
    private String corsoDiStudi;

    @ManyToOne
    @JoinColumn(name = "studente_id", nullable = false)
    private Utente studente;

    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private Utente tutor;

    @ManyToOne
    @JoinColumn(name = "laboratorio_id", nullable = false)
    private Laboratorio laboratorio;

    @OneToMany(mappedBy = "tirocinio")
    List<CollaboratoreTirocinio> collaboratori;
}
