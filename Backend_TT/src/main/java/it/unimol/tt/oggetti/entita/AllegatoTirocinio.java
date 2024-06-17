package it.unimol.tt.oggetti.entita;

import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "allegato-tirocinio")
public class AllegatoTirocinio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String nota;

    @Column(nullable = false)
    private String percorso;

    @ManyToOne
    @JoinColumn(name = "tipologia_allegato_id", nullable = false)
    private TipologiaAllegato tipologiaAllegato;

    @ManyToOne
    @JoinColumn(name = "tirocinio_id", nullable = false)
    private Tirocinio tirocinio;
}