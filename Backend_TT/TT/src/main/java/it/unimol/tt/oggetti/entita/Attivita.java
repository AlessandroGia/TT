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
@Table(name = "attivita")
public class Attivita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String data;

    @Column(nullable = false)
    private String orarioEntrata;

    @Column(nullable = false)
    private String orarioUscita;

    @Column(nullable = false)
    private String attivitaSvolta;

    @Column(nullable = false)
    private int ore;

    @Column(nullable = false)
    private int minuti;

    @ManyToOne
    @JoinColumn(name = "tirocinio_id", nullable = false)
    private Tirocinio tirocinio;
}
